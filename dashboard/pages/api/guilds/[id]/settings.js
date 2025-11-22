import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      let settings = await prisma.guildSettings.findUnique({
        where: { guildId: id }
      })

      if (!settings) {
        settings = await prisma.guildSettings.create({
          data: {
            guildId: id,
            logChannelId: '1397869920401883188', // Default log channel
          }
        })
      }

      res.status(200).json(settings)
    } catch (error) {
      console.error('Error fetching guild settings:', error)
      res.status(500).json({ error: 'Failed to fetch settings' })
    }
  } else if (req.method === 'POST') {
    try {
      const { logChannelId, modLogEnabled, auditLogEnabled, autoRoles, welcomeMessage, goodbyeMessage } = req.body

      const settings = await prisma.guildSettings.upsert({
        where: { guildId: id },
        update: {
          logChannelId,
          modLogEnabled,
          auditLogEnabled,
          autoRoles,
          welcomeMessage,
          goodbyeMessage,
        },
        create: {
          guildId: id,
          logChannelId,
          modLogEnabled,
          auditLogEnabled,
          autoRoles,
          welcomeMessage,
          goodbyeMessage,
        }
      })

      res.status(200).json(settings)
    } catch (error) {
      console.error('Error updating guild settings:', error)
      res.status(500).json({ error: 'Failed to update settings' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
