import { IOauthErrorCode } from "../../../shared/features/oauth/models/IErrorOAuth";
import { OAuth2Client } from "google-auth-library";

export async function googleOAuthUserInfoFetch({
    code,
    codeVerifier,
    oauth2Client,
}: {
    code: string;
    codeVerifier: string;
    oauth2Client: OAuth2Client;
}): Promise<{
    ok: true;
    email: string;
    sub: string;
} | {
    ok: false;
    error: IOauthErrorCode
}> {

    try {
        const { tokens } = await oauth2Client.getToken({
            code: code,
            codeVerifier: codeVerifier
        });

        if (!tokens || !tokens.id_token || !tokens.access_token) {
            const invalidCodeKey: IOauthErrorCode = "invalid_code_provided";

            return {
                ok: false,
                error: invalidCodeKey
            }
        }

        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload?.sub || !payload.email) {
            const invalidTokenPayloadKey: IOauthErrorCode = "invalid_token_payload";

            return {
                ok: false,
                error: invalidTokenPayloadKey
            }
        }

        const googleId = payload.sub;
        const email = payload.email;

        return {
            ok: true,
            email: email,
            sub: googleId
        }


        //FIRSTLY IF WE ARE LINKING AN ACCOUNT, WE NEED TO CHECK IF THE GOOGLE ACCOUNT IS ALREADY LINKED TO ANOTHER USER
        //NEXT IF IT IS A LOGIN OR A LINK AND THE ACCOUNT DOESN'T ALREADY EXIST UNDER ANOTHER USER FOR LINK THEN WE CREATE OR UPDATE
        //FINALLY IF ALL SUCCESSFUL WE WILL REDIRECT TO THE APPROPRIATE PAGE BASED ON THE PURPOSE OF THE OAUTH SESSION WITH A VALID ACCESS TOKEN AND REFRESH TOKEN SOMEHOW SENT FOR LOGIN






    } catch (error) {
        const invalidCodeKey: IOauthErrorCode = "invalid_code_provided";

        return {
            ok: false,
            error: invalidCodeKey
        }


    }
}