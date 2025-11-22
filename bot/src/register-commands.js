import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('Please set DISCORD_TOKEN, DISCORD_CLIENT_ID and GUILD_ID in your .env');
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder().setName('cb_ping').setDescription('Replies with Pong!'),
  new SlashCommandBuilder()
    .setName('cb_role')
    .setDescription('Manage roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(sub => sub
      .setName('add')
      .setDescription('Add a role to a user')
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role to add').setRequired(true))
    )
    .addSubcommand(sub => sub
      .setName('remove')
      .setDescription('Remove a role from a user')
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role to remove').setRequired(true))
    )
    .addSubcommand(sub => sub
      .setName('list')
      .setDescription('List roles of a user')
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    )
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('Clearing existing guild commands...');
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
  console.log('Registering new guild commands...');
  // Add moderation commands
  const modCommands = [
    new SlashCommandBuilder()
      .setName('cb_timeout')
      .setDescription('Timeout a member for a number of minutes')
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder()
      .setName('cb_kick')
      .setDescription('Kick a member')
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder()
      .setName('cb_ban')
      .setDescription('Ban a member')
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder()
      .setName('cb_unban')
      .setDescription('Unban a user by ID')
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addStringOption(o => o.setName('user_id').setDescription('User ID to unban').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder()
      .setName('cb_clear')
      .setDescription('Clear a number of recent messages (optionally for a user)')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addIntegerOption(o => o.setName('amount').setDescription('How many messages (1-100)').setMinValue(1).setMaxValue(100).setRequired(true))
      .addUserOption(o => o.setName('user').setDescription('Only delete messages from this user'))
  ].map(c => c.toJSON());

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [...commands, ...modCommands] });
  console.log('Successfully registered new application (/) commands.');
} catch (error) {
  console.error(error);
  process.exit(1);
}

