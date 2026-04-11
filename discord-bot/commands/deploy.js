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
    // Defer a resposta imediatamente para ganhar tempo (75 segundos)
    console.log('⏱️ Deferindo resposta...');
    await interaction.deferReply({ ephemeral: true });
    console.log('✅ Resposta deferida!');
    const channelId = process.env.CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      return await interaction.editReply('❌ Canal #pilotos não encontrado!');
    }

    // Verificar permissões do bot no canal
    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has('ViewChannel') || !permissions.has('ReadMessageHistory')) {
      return await interaction.editReply(
        '❌ Bot não tem permissão para ler mensagens do canal #pilotos!\n\nSolução: Clique em #pilotos → Permissões → Adicione @TucanosBot com permissões:\n✅ Ver canal\n✅ Ver histórico de mensagens'
      );
    }

    // Buscar últimas 100 mensagens do canal
    const messages = await channel.messages.fetch({ limit: 100 });
    const messageArray = Array.from(messages.values()).reverse();

    // Parse dos dados
    const pilotos = parseChannelMessages(messageArray);

    if (pilotos.length === 0) {
      return await interaction.editReply(
        '❌ Nenhum dado de piloto encontrado no formato correto!\n\nFormato esperado: `Nome: vitórias,pódios`\nExemplo: `Douglas Pedroso: 5,2`'
      );
    }

    // Formatar JSON
    const jsonData = formatPilotosJSON(pilotos);

    // Push para GitHub
    const result = await pushToGitHub(
      jsonData,
      process.env.LOCAL_REPO_PATH,
      `${process.env.GITHUB_REPO_PATH}/${process.env.GITHUB_FILE_NAME}`,
      process.env.GITHUB_TOKEN,
      process.env.GITHUB_REPO
    );

    if (result.success) {
      const pilotosList = pilotos.map((p) => `• ${p.nome}: ${p.vitorias} vitórias, ${p.podios} pódios`).join('\n');

      await interaction.editReply(
        `✅ **Deploy realizado com sucesso!**\n\n📊 **Pilotos atualizados (${pilotos.length}):**\n${pilotosList}\n\n🚀 Dados enviados para o GitHub!\n⏰ Atualização: ${new Date().toLocaleString('pt-BR')}`
      );
    } else {
      await interaction.editReply(`❌ Erro ao fazer deploy: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    await interaction.editReply(`❌ Erro ao processar comando: ${error.message}`);
  }
}
