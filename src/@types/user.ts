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

enum DISCORD_API_ROUTES {
    OAUTH2_TOKEN = 'https://discord.com/api/v8/oauth2/token',
    OAUTH2_USER = 'https://discord.com/api/v8/users/@me',
    OAUTH2_TOKEN_REVOKE = 'https://discord.com/api/v8/oauth2/token/revoke'
}

type DiscordOAuth2ExchangeRequestParams = {
    client_id: string;
    client_secret: string;
    grant_type: string;
    code: string;
    redirect_uri: string;
};

type DiscordOAuth2CredentialsResponse = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
};

type DiscordOAuth2UserResponse = {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    email?: string;
    verified?: boolean;
    public_flags: number;
    flags: number;
    banner: string | null;
    banner_color: string | null;
    accent_color: string | null;
    locale: string;
    mfa_enabled: boolean;
};

type UserParams = {
    dUsername: string;
    dAvatar: string;
    dClientId: string;
    dLocale: string;
    dAccessToken: string;
    dRefreshToken: string;
};

type EncryptedTokens = {
    dAccessToken: string;
    dRefreshToken: string;
};

export {
    User,
    DISCORD_API_ROUTES,
    DiscordOAuth2ExchangeRequestParams,
    DiscordOAuth2CredentialsResponse,
    DiscordOAuth2UserResponse,
    UserParams,
    EncryptedTokens
};
