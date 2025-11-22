import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('Missing env: DISCORD_TOKEN / DISCORD_CLIENT_ID / GUILD_ID');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  const cmds = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
  console.log(`Found ${cmds.length} guild command(s):`);
  for (const c of cmds) {
    console.log(`- ${c.name} (id: ${c.id})`);
  }
} catch (e) {
  console.error('Error fetching guild commands:', e);
  process.exit(1);
}
