interface ServerSetting {
    id: number;
    xBotServerId: number;
    botNicName: string;
    botCommandPrefix: string;
    isBotActive: boolean;
    createdAt: string;
    updatedAt: string;
}

type RolePermission = {
    id: string;
    type: string;
    permission: boolean;
};
type fullPermission = {
    id: string;
    permissions: RolePermission[];
};

export { ServerSetting, RolePermission, fullPermission };
