import { SlashCommandBuilder } from 'discord.js';
import { parseChannelMessages, formatPilotosJSON } from '../utils/parseData.js';
import { pushToGitHub } from '../utils/githubPush.js';

export const data = new SlashCommandBuilder()
  .setName('deploy')
  .setDescription('Coleta dados de pilotos e faz deploy para o GitHub');

export async function execute(interaction, client) {
  console.log(`\n🔍 Comando /deploy recebido de ${interaction.user.tag}`);
  console.log(`⏰ Timestamp: ${new Date().toLocaleString('pt-BR')}`);
  
  try {
    // PRIMEIRO: Responder super rápido ao Discord (< 1 segundo)
    console.log('📤 Respondendo ao Discord IMEDIATAMENTE...');
    await interaction.reply({
      content: '⏳ Processando deploy... aguarde!',
      flags: 64, // ephemeral
    });
    console.log('✅ Resposta enviada ao Discord!');

    // DEPOIS: Fazer o processamento pesado
    console.log('🔍 Buscando mensagens do canal...');
    const channelId = process.env.CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.log('❌ Canal não encontrado');
      return await interaction.editReply('❌ Canal #pilotos não encontrado!');
    }

    console.log('✅ Canal encontrado');

    // Verificar permissões do bot no canal
    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has('ViewChannel') || !permissions.has('ReadMessageHistory')) {
      console.log('❌ Bot sem permissão no canal');
      return await interaction.editReply(
        '❌ Bot não tem permissão para ler mensagens do canal #pilotos!'
      );
    }

    console.log('✅ Permissões validadas');

    // Buscar últimas 100 mensagens do canal
    console.log('📨 Buscando mensagens...');
    const messages = await channel.messages.fetch({ limit: 100 });
    const messageArray = Array.from(messages.values()).reverse();
    console.log(`📨 ${messageArray.length} mensagens encontradas`);

    // Parse dos dados
    const pilotos = parseChannelMessages(messageArray);
    console.log(`✅ ${pilotos.length} pilotos parseados`);

    if (pilotos.length === 0) {
      console.log('❌ Nenhum piloto encontrado');
      return await interaction.editReply(
        '❌ Nenhum dado de piloto encontrado no formato correto!\n\nFormato esperado: `Nome: vitórias,pódios`'
      );
    }

    // Formatar JSON
    const jsonData = formatPilotosJSON(pilotos);
    console.log('📝 JSON formatado');

    // Push para GitHub
    console.log('🚀 Iniciando push para GitHub...');
    const result = await pushToGitHub(
      jsonData,
      process.env.LOCAL_REPO_PATH,
      `${process.env.GITHUB_REPO_PATH}/${process.env.GITHUB_FILE_NAME}`,
      process.env.GITHUB_TOKEN,
      process.env.GITHUB_REPO
    );

    if (result.success) {
      console.log('✅ Push para GitHub bem-sucedido');
      const pilotosList = pilotos.map((p) => `• ${p.nome}: ${p.vitorias} vitórias, ${p.podios} pódios`).join('\n');

      await interaction.editReply(
        `✅ **Deploy realizado com sucesso!**\n\n📊 **Pilotos atualizados (${pilotos.length}):**\n${pilotosList}\n\n🚀 Dados enviados para o GitHub!\n⏰ Atualização: ${new Date().toLocaleString('pt-BR')}`
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
