import z from "zod";

export const OAUTH_ERROR_CODES = [
    "missing_required_parameter",
    "account_not_linked", //THIS ONE ISN'T FOUND IN OUR DATABASE
    "account_already_linked",
    "unknown_error",
    "session_expired",
    "invalid_code_provided",
    "invalid_token_payload"
] as const;



export const OAuthErrorCodeSchema = z.enum(OAUTH_ERROR_CODES);



export type IOauthErrorCode = z.infer<typeof OAuthErrorCodeSchema>;



//ALSO CHECK FOR CANCEL



const ErrorOAuthSchema = z.record(
    OAuthErrorCodeSchema,
    z.string()
);



export type IErrorOAuth = z.infer<typeof ErrorOAuthSchema>;