import { IErrorOAuth } from "./models/IErrorOAuth";




export const OAUTH_ERRORS: IErrorOAuth = {
    missing_required_parameter: "A required parameter is missing from the request.",
    account_not_linked: "The account is not linked to any user in our database.",
    account_already_linked: "The account is already linked to another user.",
    // account_not_found: "The account was not found in Google.",
    unknown_error: "An unknown error occurred during the OAuth process.",
    session_expired: "The session has expired. Please try again.",
    invalid_code_provided: "The provided code is invalid or has already been used.",
    invalid_token_payload: "The token payload is invalid or malformed.",
}


export const OAuthErrorKey: string = "oauth_error";