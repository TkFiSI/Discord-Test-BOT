import { PrismaClient } from '@prisma/client'

// Use the same database file as the dashboard
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../dashboard/prisma/dev.db'
    }
  }
})

// Helper function to get guild settings
export async function getGuildSettings(guildId) {
  let settings = await prisma.guildSettings.findUnique({
    where: { guildId }
  })
  
  if (!settings) {
    // Create default settings if not found
    settings = await prisma.guildSettings.create({
      data: {
        guildId,
        logChannelId: process.env.LOG_CHANNEL_ID || null,
        modLogEnabled: true,
        auditLogEnabled: true
      }
    })
  }
  
  return settings
}

// Helper to get log channel from settings
export async function getLogChannel(guild) {
  const settings = await getGuildSettings(guild.id)
  if (!settings.logChannelId) return null
  return guild.channels.cache.get(settings.logChannelId) || null
}

// Close Prisma connection on shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
