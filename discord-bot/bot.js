import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import * as deployCommand from './commands/deploy.js';
import * as deployEventsCommand from './commands/deployEvents.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Armazenar comandos
client.commands = new Collection();
client.commands.set('deploy', deployCommand);
client.commands.set('deploy-eventos', deployEventsCommand);

// Evento: Bot conectado
client.once('ready', async () => {
  console.log(`✅ Bot conectado como: ${client.user.tag}`);
  console.log(`🆔 Guild ID: ${process.env.GUILD_ID}`);
  console.log(`📢 Channel ID (pilotos): ${process.env.CHANNEL_ID}`);
  console.log(`🎪 Channel ID (eventos): ${process.env.EVENTOS_CHANNEL_ID || 'NÃO CONFIGURADO'}`);
  console.log(`\n💡 Use /deploy no Discord para coletar pilotos`);
  console.log(`💡 Use /deploy-eventos no Discord para coletar eventos\n`);

  // Registrar slash commands na primeira conexão
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const commands = [
      {
        name: 'deploy',
        description: 'Coleta dados de pilotos e faz deploy para o GitHub',
      },
      {
        name: 'deploy-eventos',
        description: 'Coleta eventos e participantes (reações) e faz deploy',
      },
    ];
    await guild.commands.set(commands);
    console.log('✅ Slash commands registrados! (/deploy, /deploy-eventos)');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
});

// Evento: Comando slash recebido
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Comando não encontrado: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error('Erro ao executar comando:', error);
    // Só responder se a interaction não foi respondida ainda
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '❌ Erro ao executar o comando!',
        flags: 64,
      });
    } else if (interaction.deferred) {
      await interaction.editReply('❌ Erro ao executar o comando!');
    }
  }
});



// Login
client.login(process.env.DISCORD_TOKEN);
