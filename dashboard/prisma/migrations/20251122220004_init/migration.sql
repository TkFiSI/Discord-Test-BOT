-- CreateTable
CREATE TABLE "guild_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guildId" TEXT NOT NULL,
    "logChannelId" TEXT,
    "modLogEnabled" BOOLEAN NOT NULL DEFAULT true,
    "auditLogEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoRoles" TEXT,
    "welcomeMessage" TEXT,
    "goodbyeMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_settings_guildId_key" ON "guild_settings"("guildId");
