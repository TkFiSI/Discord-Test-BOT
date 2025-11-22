// Prisma configuration
// This file configures the database connection for Prisma

const config = {
  schemaPath: './prisma/schema.prisma',
  datasources: {
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./dev.db',
    },
  },
}

export default config
