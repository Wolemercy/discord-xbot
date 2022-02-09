-- CreateEnum
CREATE TYPE "MATCH_STATUS" AS ENUM ('ACTIVE', 'PAUSED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "dUsername" TEXT NOT NULL,
    "dAvatar" TEXT,
    "dClientId" TEXT NOT NULL,
    "dLocale" TEXT,
    "dAccessToken" TEXT NOT NULL,
    "dRefreshToken" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "dGuildId" TEXT NOT NULL,
    "dOwnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "defaultPermissions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerSetting" (
    "id" SERIAL NOT NULL,
    "dGuildId" TEXT NOT NULL,
    "botNicName" TEXT DEFAULT E'xBot',
    "botCommandPrefix" TEXT NOT NULL DEFAULT E'*',
    "isBotActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "serverOwnerId" TEXT NOT NULL,
    "dGuildId" TEXT NOT NULL,
    "lastMatchDate" TIMESTAMP(3) NOT NULL,
    "nextMatchDate" TIMESTAMP(3) NOT NULL,
    "matchChannelId" TEXT NOT NULL DEFAULT E'',
    "matchFrequency" INTEGER NOT NULL DEFAULT 7,
    "status" "MATCH_STATUS" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerUserMatch" (
    "id" SERIAL NOT NULL,
    "dGuildId" TEXT NOT NULL,
    "dUserId" TEXT NOT NULL,
    "dUserMatchedId" TEXT NOT NULL,
    "isMatchActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerUserMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerModule" (
    "id" SERIAL NOT NULL,
    "dGuildId" TEXT NOT NULL,
    "xBotModuleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "modulePermissions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_dClientId_key" ON "User"("dClientId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "Server_dGuildId_key" ON "Server"("dGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerSetting_dGuildId_key" ON "ServerSetting"("dGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_serverOwnerId_key" ON "Match"("serverOwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_dGuildId_key" ON "Match"("dGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerModule_dGuildId_key" ON "ServerModule"("dGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerModule_xBotModuleId_key" ON "ServerModule"("xBotModuleId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_dOwnerId_fkey" FOREIGN KEY ("dOwnerId") REFERENCES "User"("dClientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerSetting" ADD CONSTRAINT "ServerSetting_dGuildId_fkey" FOREIGN KEY ("dGuildId") REFERENCES "Server"("dGuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_serverOwnerId_fkey" FOREIGN KEY ("serverOwnerId") REFERENCES "User"("dClientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_dGuildId_fkey" FOREIGN KEY ("dGuildId") REFERENCES "Server"("dGuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerUserMatch" ADD CONSTRAINT "ServerUserMatch_dGuildId_fkey" FOREIGN KEY ("dGuildId") REFERENCES "Server"("dGuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerModule" ADD CONSTRAINT "ServerModule_dGuildId_fkey" FOREIGN KEY ("dGuildId") REFERENCES "Server"("dGuildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerModule" ADD CONSTRAINT "ServerModule_xBotModuleId_fkey" FOREIGN KEY ("xBotModuleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
