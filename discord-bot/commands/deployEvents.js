import { SlashCommandBuilder } from 'discord.js';
import { collectEvents, formatEventosJSON } from '../utils/parseEvents.js';
import { pushToGitHub } from '../utils/githubPush.js';

export const data = new SlashCommandBuilder()
  .setName('deploy-eventos')
  .setDescription('Coleta eventos com reações e atualiza no GitHub');

export async function execute(interaction, client) {
  console.log(`\n🎯 Comando /deploy-eventos recebido de ${interaction.user.tag}`);
  console.log(`⏰ Timestamp: ${new Date().toLocaleString('pt-BR')}`);

  try {
    // PRIMEIRO: Responder super rápido ao Discord (< 1 segundo)
    console.log('📤 Respondendo ao Discord IMEDIATAMENTE...');
    await interaction.reply({
      content: '⏳ Coletando eventos e participantes... aguarde!',
      flags: 64, // ephemeral
    });
    console.log('✅ Resposta enviada ao Discord!');

    // DEPOIS: Fazer o processamento pesado
    console.log('🎪 Buscando canal de eventos...');
    const eventsChannelId = process.env.EVENTS_CHANNEL_ID;
    const eventsChannel = await client.channels.fetch(eventsChannelId);

    if (!eventsChannel) {
      console.log('❌ Canal de eventos não encontrado');
      return await interaction.editReply('❌ Canal #eventos não encontrado!');
    }

    console.log('✅ Canal encontrado');

    // Verificar permissões
    const permissions = eventsChannel.permissionsFor(client.user);
    if (!permissions.has('ViewChannel') || !permissions.has('ReadMessageHistory')) {
      console.log('❌ Bot sem permissão no canal');
      return await interaction.editReply(
        '❌ Bot não tem permissão para ler mensagens do canal #eventos!'
      );
    }

    console.log('✅ Permissões validadas');

    // Buscar mensagens do canal
    console.log('📨 Buscando mensagens de eventos...');
    const messages = await eventsChannel.messages.fetch({ limit: 100 });
    const messageArray = Array.from(messages.values()).reverse();
    console.log(`📨 ${messageArray.length} mensagens encontradas`);

    // Coletar eventos com reactions
    console.log('🎯 Coletando eventos e participants...');
    const eventos = await collectEvents(eventsChannel, messageArray);
    console.log(`✅ ${eventos.length} eventos encontrados`);

    if (eventos.length === 0) {
      console.log('❌ Nenhum evento encontrado');
      return await interaction.editReply(
        '❌ Nenhum evento encontrado no formato correto!\n\nFormato esperado: `Evento: [Nome] [Data] [Hora] [Timezone]`\nExemplo: `Evento: Suzuka 11/04/2026 18:00 Brasília`'
      );
    }

    // Formatar JSON
    const jsonData = formatEventosJSON(eventos);
    console.log('📝 JSON formatado');

    // Push para GitHub
    console.log('🚀 Iniciando push para GitHub...');
    const result = await pushToGitHub(
      jsonData,
      process.env.LOCAL_REPO_PATH,
      `${process.env.EVENTS_REPO_PATH}/${process.env.EVENTS_FILE_NAME}`,
      process.env.GITHUB_TOKEN,
      process.env.GITHUB_REPO
    );

    if (result.success) {
      console.log('✅ Push para GitHub bem-sucedido');
      
      const eventosList = eventos
        .map((e) => {
          const status = e.status === 'expirado' ? '⏰ EXPIRADO' : '🔴 ATIVO';
          return `• **${e.nome}** - ${e.data} às ${e.hora} (${e.timezone})\n  ${status} | ${e.totalParticipantes} participantes`;

        })
        .join('\n');

      await interaction.editReply(
        `✅ **Deploy de eventos realizado com sucesso!**\n\n🎪 **Eventos (${eventos.length}):**\n${eventosList}\n\n🚀 Dados enviados para o GitHub!\n⏰ Atualização: ${new Date().toLocaleString('pt-BR')}`
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
