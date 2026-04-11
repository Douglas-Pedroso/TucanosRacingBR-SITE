import { SlashCommandBuilder } from 'discord.js';
import { extrairEventosDesMensagens, formatEventosJSON, processarReacoes } from '../utils/parseEventos.js';
import { pushToGitHub } from '../utils/githubPush.js';

export const data = new SlashCommandBuilder()
  .setName('deploy-eventos')
  .setDescription('Coleta eventos e participantes para deploy no GitHub');

export async function execute(interaction, client) {
  console.log(`\n🎪 Comando /deploy-eventos recebido de ${interaction.user.tag}`);
  console.log(`⏰ Timestamp: ${new Date().toLocaleString('pt-BR')}`);

  try {
    // Responder ao Discord imediatamente
    await interaction.reply({
      content: '⏳ Coletando eventos e participantes... aguarde!',
      flags: 64, // ephemeral
    });
    console.log('📤 Resposta enviada ao Discord!');

    const channelId = process.env.EVENTOS_CHANNEL_ID;
    if (!channelId) {
      console.log('❌ EVENTOS_CHANNEL_ID não configurado');
      return await interaction.editReply(
        '❌ Canal #eventos não configurado!\n\nSolução: Adicione `EVENTOS_CHANNEL_ID` ao `.env` do bot'
      );
    }

    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      console.log('❌ Canal #eventos não encontrado');
      return await interaction.editReply('❌ Canal #eventos não encontrado!');
    }

    console.log('✅ Canal #eventos encontrado');

    // Verificar permissões
    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has('ViewChannel') || !permissions.has('ReadMessageHistory')) {
      return await interaction.editReply(
        '❌ Bot não tem permissão para ler mensagens no canal #eventos!'
      );
    }

    console.log('✅ Permissões validadas');

    // Buscar todas as mensagens do canal
    console.log('📨 Buscando mensagens de eventos...');
    let allMessages = [];
    let lastMessageId = null;
    let iterations = 0;
    const MAX_ITERATIONS = 5; // Limitar a 5 buscas para não sobrecarregar

    while (iterations < MAX_ITERATIONS) {
      const options = { limit: 100 };
      if (lastMessageId) options.before = lastMessageId;

      const messages = await channel.messages.fetch(options);
      if (messages.size === 0) break;

      allMessages = allMessages.concat(Array.from(messages.values()));
      lastMessageId = messages.last().id;
      iterations++;
    }

    console.log(`📨 ${allMessages.length} mensagens encontradas`);

    // Parse dos eventos
    console.log('🎪 Extraindo eventos...');
    const eventos = extrairEventosDesMensagens(allMessages);
    console.log(`✅ ${eventos.length} eventos encontrados`);

    if (eventos.length === 0) {
      return await interaction.editReply(
        '❌ Nenhum evento encontrado!\n\nFormato esperado: `Evento: [Nome] [Data] [Hora] [Timezone]`\nExemplo: `Evento: Suzuka 11/04/2026 18:00 Brasília`'
      );
    }

    // Processar reações e coletar participantes
    console.log('👥 Coletando participantes de reações...');
    const eventosComParticipantes = await processarReacoes(eventos, client);

    // Formatar JSON
    const jsonData = formatEventosJSON(eventosComParticipantes);
    console.log('📝 JSON formatado');

    // Push para GitHub
    console.log('🚀 Iniciando push para GitHub...');
    const result = await pushToGitHub(
      jsonData,
      process.env.LOCAL_REPO_PATH,
      `${process.env.GITHUB_REPO_PATH}/${process.env.GITHUB_EVENTOS_FILE}`,
      process.env.GITHUB_TOKEN,
      process.env.GITHUB_REPO,
      true // Flag para também atualizar em /docs
    );

    if (result.success) {
      console.log('✅ Push para GitHub bem-sucedido');

      const eventosList = eventosComParticipantes
        .map((e) => {
          const statusEmoji = e.status === 'expirado' ? '❌' : '✅';
          return `• ${statusEmoji} **${e.nome}** - ${e.data} ${e.hora} (${e.timezone})\n  👥 ${e.totalParticipantes} participante${e.totalParticipantes !== 1 ? 's' : ''}`;
        })
        .join('\n');

      await interaction.editReply(
        `✅ **Deploy de eventos realizado com sucesso!**\n\n🎪 **Eventos (${eventosComParticipantes.length}):**\n${eventosList}\n\n🚀 Dados enviados para o GitHub!\n⏰ Atualização: ${new Date().toLocaleString('pt-BR')}`
      );
    } else {
      console.error('❌ Erro ao fazer push:', result.error);
      await interaction.editReply(`❌ Erro ao fazer deploy: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Erro total:', error);
    try {
      await interaction.editReply(`❌ Erro ao processar comando: ${error.message}`);
    } catch (e) {
      console.error('❌ Não conseguiu responder ao Discord:', e);
    }
  }
}
