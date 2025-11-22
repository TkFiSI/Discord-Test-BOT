import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, Events, PermissionsBitField } from 'discord.js';
import { getLogChannel } from './database.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.GuildMember]
});

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'cb_ping') {
      return interaction.reply({ content: 'Pong!', ephemeral: true });
    }

    if (interaction.commandName === 'cb_role') {
      // Permission guard: require ManageRoles
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: 'Du benötigst die Berechtigung Rollen verwalten.', ephemeral: true });
      }

      const sub = interaction.options.getSubcommand();
      if (sub === 'add' || sub === 'remove') {
        const user = interaction.options.getUser('user', true);
        const role = interaction.options.getRole('role', true);
        const member = await interaction.guild.members.fetch(user.id);

        // Prevent acting on higher/equal roles
        const botMember = await interaction.guild.members.fetchMe();
        if (role.position >= botMember.roles.highest.position) {
          return interaction.reply({ content: 'Ich kann diese Rolle nicht verwalten (Position zu hoch).', ephemeral: true });
        }

        if (sub === 'add') {
          await member.roles.add(role);
          return interaction.reply({ content: `Rolle ${role.name} zu ${member.user.tag} hinzugefügt.`, ephemeral: false });
        } else {
          await member.roles.remove(role);
          return interaction.reply({ content: `Rolle ${role.name} von ${member.user.tag} entfernt.`, ephemeral: false });
        }
      }

      if (sub === 'list') {
        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);
        const names = member.roles.cache
          .filter(r => r.name !== '@everyone')
          .map(r => r.name)
          .sort();
        const list = names.length ? names.join(', ') : 'Keine Rollen';
        return interaction.reply({ content: `Rollen von ${member.user.tag}: ${list}`, ephemeral: false });
      }
    }

    // Moderation: timeout
    if (interaction.commandName === 'cb_timeout') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers)) {
        return interaction.reply({ content: 'Du benötigst die Berechtigung Mitglieder moderieren.', ephemeral: true });
      }
      const user = interaction.options.getUser('user', true);
      const minutes = interaction.options.getInteger('minutes', true);
      const reason = interaction.options.getString('reason') ?? 'Keine Angabe';
      const member = await interaction.guild.members.fetch(user.id);
      const ms = Math.max(60_000, minutes * 60_000);
      await member.timeout(ms, reason);
      await interaction.reply({ content: `${member.user.tag} für ${minutes} Minuten getimeoutet. Grund: ${reason}` });
      const log = await getLogChannel(interaction.guild);
      log?.send(`⏳ Timeout: ${member.user.tag} (${member.id}) für ${minutes}m durch ${interaction.user.tag}. Grund: ${reason}`);
      return;
    }

    // Moderation: kick
    if (interaction.commandName === 'cb_kick') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.KickMembers)) {
        return interaction.reply({ content: 'Du benötigst die Berechtigung Mitglieder kicken.', ephemeral: true });
      }
      const user = interaction.options.getUser('user', true);
      const reason = interaction.options.getString('reason') ?? 'Keine Angabe';
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(reason);
      await interaction.reply({ content: `${member.user.tag} wurde gekickt. Grund: ${reason}` });
      const log = await getLogChannel(interaction.guild);
      log?.send(`👢 Kick: ${member.user.tag} (${member.id}) durch ${interaction.user.tag}. Grund: ${reason}`);
      return;
    }

    // Moderation: ban
    if (interaction.commandName === 'cb_ban') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: 'Du benötigst die Berechtigung Mitglieder bannen.', ephemeral: true });
      }
      const user = interaction.options.getUser('user', true);
      const reason = interaction.options.getString('reason') ?? 'Keine Angabe';
      await interaction.guild.members.ban(user.id, { reason });
      await interaction.reply({ content: `${user.tag} wurde gebannt. Grund: ${reason}` });
      const log = await getLogChannel(interaction.guild);
      log?.send(`🔨 Ban: ${user.tag} (${user.id}) durch ${interaction.user.tag}. Grund: ${reason}`);
      return;
    }

    // Moderation: unban
    if (interaction.commandName === 'cb_unban') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers)) {
        return interaction.reply({ content: 'Du benötigst die Berechtigung Mitglieder bannen.', ephemeral: true });
      }
      const userId = interaction.options.getString('user_id', true);
      const reason = interaction.options.getString('reason') ?? 'Keine Angabe';
      await interaction.guild.bans.remove(userId, reason).catch(() => {});
      await interaction.reply({ content: `User ${userId} wurde entbannt. Grund: ${reason}` });
      const log = await getLogChannel(interaction.guild);
      log?.send(`♻️ Unban: ${userId} durch ${interaction.user.tag}. Grund: ${reason}`);
      return;
    }

    // Moderation: clear
    if (interaction.commandName === 'cb_clear') {
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageMessages)) {
        return interaction.reply({ content: 'Du benötigst die Berechtigung Nachrichten verwalten.', ephemeral: true });
      }
      const amount = interaction.options.getInteger('amount', true);
      const user = interaction.options.getUser('user');
      const channel = interaction.channel;
      const fetched = await channel.messages.fetch({ limit: 100 });
      let toDelete = fetched.first(Math.min(amount, 100));
      if (user) {
        toDelete = toDelete.filter(m => m.author.id === user.id);
      }
      const delCount = toDelete.length;
      await channel.bulkDelete(toDelete, true);
      await interaction.reply({ content: `${delCount} Nachricht(en) gelöscht.${user ? ` (nur von ${user.tag})` : ''}` , ephemeral: true });
      const log = await getLogChannel(interaction.guild);
      log?.send(`🧹 Clear: ${delCount} Nachrichten in #${channel.name} durch ${interaction.user.tag}${user ? ` (nur von ${user.tag})` : ''}`);
      return;
    }
  } catch (err) {
    console.error('Interaction error:', err);
    if (interaction.isRepliable()) {
      return interaction.reply({ content: 'Es ist ein Fehler aufgetreten.', ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
