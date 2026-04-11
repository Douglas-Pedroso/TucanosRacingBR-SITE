import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import * as deployCommand from './commands/deploy.js';

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

// Evento: Bot conectado
client.once('ready', () => {
  console.log(`✅ Bot conectado como: ${client.user.tag}`);
  console.log(`🆔 Guild ID: ${process.env.GUILD_ID}`);
  console.log(`📢 Channel ID: ${process.env.CHANNEL_ID}`);
  console.log(`\n💡 Use /deploy no Discord para coletar dados e fazer push ao GitHub!\n`);
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
    await interaction.reply({
      content: '❌ Erro ao executar o comando!',
      ephemeral: true,
    });
  }
});

// Registrar slash commands
client.on('ready', async () => {
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const commands = [
      {
        name: 'deploy',
        description: 'Coleta dados de pilotos e faz deploy para o GitHub',
      },
    ];

    await guild.commands.set(commands);
    console.log('✅ Slash commands registrados!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
