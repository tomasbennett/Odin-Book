import z from "zod";

export const OAUTH_PROVIDERS = [
    "google",
    "github",
] as const;


export const OAuthProviderSchema = z.enum(OAUTH_PROVIDERS);



export type IOauthProvider = z.infer<typeof OAuthProviderSchema>;