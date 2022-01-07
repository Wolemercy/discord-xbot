-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "dGuildId" TEXT NOT NULL,
    "xBotUserId" INTEGER NOT NULL,
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
CREATE TABLE "SeverSetting" (
    "id" SERIAL NOT NULL,
    "xBotServerId" INTEGER NOT NULL,
    "botNicName" TEXT NOT NULL DEFAULT E'xBot',
    "botCommandPrefix" TEXT NOT NULL DEFAULT E'*',
    "isBotActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeverSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "xBotUserId" INTEGER NOT NULL,
    "xBotServerId" INTEGER NOT NULL,
    "lastMatchDate" TIMESTAMP(3) NOT NULL,
    "nextMatchDate" TIMESTAMP(3) NOT NULL,
    "matchFrequency" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerUserMatche" (
    "id" SERIAL NOT NULL,
    "xBotServerId" INTEGER NOT NULL,
    "dUserId" TEXT NOT NULL,
    "dUserMatchedId" TEXT NOT NULL,
    "isMatchActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerUserMatche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerModule" (
    "id" SERIAL NOT NULL,
    "xBotServerId" INTEGER NOT NULL,
    "xBotModuleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "modulePermissions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeverSetting_xBotServerId_key" ON "SeverSetting"("xBotServerId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_xBotUserId_key" ON "Match"("xBotUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_xBotServerId_key" ON "Match"("xBotServerId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerUserMatche_xBotServerId_key" ON "ServerUserMatche"("xBotServerId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerModule_xBotServerId_key" ON "ServerModule"("xBotServerId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerModule_xBotModuleId_key" ON "ServerModule"("xBotModuleId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_xBotUserId_fkey" FOREIGN KEY ("xBotUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeverSetting" ADD CONSTRAINT "SeverSetting_xBotServerId_fkey" FOREIGN KEY ("xBotServerId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_xBotUserId_fkey" FOREIGN KEY ("xBotUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_xBotServerId_fkey" FOREIGN KEY ("xBotServerId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerUserMatche" ADD CONSTRAINT "ServerUserMatche_xBotServerId_fkey" FOREIGN KEY ("xBotServerId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerModule" ADD CONSTRAINT "ServerModule_xBotServerId_fkey" FOREIGN KEY ("xBotServerId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerModule" ADD CONSTRAINT "ServerModule_xBotModuleId_fkey" FOREIGN KEY ("xBotModuleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
