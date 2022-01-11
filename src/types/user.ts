interface User {
    id: number;
    dUsername: string;
    dAvatar: string;
    dClientId: string;
    dLocale: string;
    dAccessToken: string;
    dRefreshToken: string;
    isPremium: boolean;
    createdAt: string;
    updatedAt: string;
}

export { User };
