import { SlashCommandBuilder } from 'discord.js';
import { pushToGitHub } from '../utils/githubPush.js';
import fs from 'fs';
import path from 'path';

export const data = new SlashCommandBuilder()
  .setName('expirar-evento')
  .setDescription('Marca um evento como expirado')
  .addStringOption(option =>
    option
      .setName('nome')
      .setDescription('Nome do evento a expirar (ex: Suzuka)')
      .setRequired(true)
  );

export async function execute(interaction, client) {
  console.log(`\n🕐 Comando /expirar-evento recebido de ${interaction.user.tag}`);
  console.log(`⏰ Timestamp: ${new Date().toLocaleString('pt-BR')}`);

  try {
    // Responder super rápido ao Discord
    console.log('📤 Respondendo ao Discord IMEDIATAMENTE...');
    await interaction.reply({
      content: '⏳ Buscando evento...',
      flags: 64, // ephemeral
    });
    console.log('✅ Resposta enviada ao Discord!');

    const nomeEvento = interaction.options.getString('nome').toLowerCase();

    // Ler arquivo de eventos
    const eventsFilePath = path.join(process.env.LOCAL_REPO_PATH, 'public', 'eventos.json');
    const eventosData = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));

    // Encontrar evento pelo nome
    const eventoIdx = eventosData.eventos.findIndex(e => e.nome.toLowerCase() === nomeEvento);

    if (eventoIdx === -1) {
      const nomes = eventosData.eventos.map(e => e.nome).join(', ') || 'nenhum';
      return await interaction.editReply(
        `❌ Evento "${nomeEvento}" não encontrado!\n\nEventos disponíveis: ${nomes}`
      );
    }

    const evento = eventosData.eventos[eventoIdx];

    // Se já está expirado
    if (evento.status === 'expirado') {
      return await interaction.editReply(
        `⏰ Evento "${evento.nome}" já está marcado como EXPIRADO`
      );
    }

    // Marcar como expirado
    console.log(`🕐 Marcando evento "${evento.nome}" como expirado...`);
    evento.status = 'expirado';
    eventosData.ultimaAtualizacao = new Date().toISOString();

    // Salvar localmente
    fs.writeFileSync(eventsFilePath, JSON.stringify(eventosData, null, 2));
    console.log('✅ Arquivo eventos.json atualizado localmente');

    // Também em /docs para GitHub Pages
    const docsPath = path.join(process.env.LOCAL_REPO_PATH, 'docs', 'eventos.json');
    fs.writeFileSync(docsPath, JSON.stringify(eventosData, null, 2));
    console.log('✅ Arquivo /docs/eventos.json atualizado');

    // Push para GitHub
    console.log('🚀 Fazendo push para GitHub...');
    const result = await pushToGitHub(
      eventosData,
      process.env.LOCAL_REPO_PATH,
      'public/eventos.json',
      process.env.GITHUB_TOKEN,
      process.env.GITHUB_REPO
    );

    if (result.success) {
      console.log('✅ Push para GitHub bem-sucedido');
      await interaction.editReply(
        `✅ **Evento marcado como EXPIRADO!**\n\n⏰ **${evento.nome}** - ${evento.data} às ${evento.hora}\n📍 ${evento.timezone}${evento.jogo ? ` | 🎮 ${evento.jogo}` : ''}\n\nO evento agora aparecerá como EXPIRADO no site!\n⏰ Atualização: ${new Date().toLocaleString('pt-BR')}`
      );
    } else {
      console.error('❌ Erro ao fazer push:', result.error);
      await interaction.editReply(`❌ Erro ao fazer push: ${result.error}`);
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
