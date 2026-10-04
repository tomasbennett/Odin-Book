import { Router, Request, Response, NextFunction } from "express";
import { CheckAccessTokenPayload } from "../auth/CheckAccessTokenPayload";

import crypto from "crypto";
import { prisma } from "../../lib/prisma";
import { GmailOAuthResponseSchema } from "../models/IOAuthModels";
import { domain } from "../constants/domain";
import { google } from "googleapis";
import { CodeChallengeMethod } from "google-auth-library";
import { ISuccessRedirectUrl } from "../../../shared/features/oauth/models/IRedirect";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import { IOauthErrorCode } from "../../../shared/features/oauth/models/IErrorOAuth";
import { OAuthErrorKey } from "../../../shared/features/oauth/constants";
import { OAuth2Client } from "google-auth-library";
import { googleOAuthUserInfoFetch } from "../services/GoogleOAuth";
import { CreateRefreshToken } from "../auth/CreateRefreshToken";
import { refreshTokenCookieKey } from "../constants/constants";


export const router = Router();




const gmailRouter = Router();
const linkedInRouter = Router();
const githubRouter = Router();


router.use("/google", gmailRouter);
router.use("/linkedin", linkedInRouter);
router.use("/github", githubRouter);



gmailRouter.get("/login",
    async (req: Request, res: Response<ISuccessRedirectUrl | ICustomErrorResponse>, next: NextFunction) => {

        try {

            const state: string = crypto.randomBytes(64).toString('hex');
            const stateHash = crypto
                .createHash("sha256")
                .update(state)
                .digest("hex");

            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_CALLBACK_URL
            );

            const scopes: string[] = [
                "openid",
                "https://www.googleapis.com/auth/userinfo.email"
            ];

            const {
                codeVerifier,
                codeChallenge
            } = await oauth2Client.generateCodeVerifierAsync();

            if (typeof codeChallenge !== "string") {
                return res.status(500).json({
                    ok: false,
                    status: 500,
                    message: "Failed to generate code challenge for Google OAuth"
                });
            }


            const oauthSession = await prisma.oAuthSession.create({
                data: {
                    state: stateHash,
                    userId: null,
                    expiresAt: expiresAt,
                    purpose: "LOGIN",
                    provider: "GMAIL",
                    codeChallenge: codeChallenge,
                    codeVerifier: codeVerifier
                }
            });


            const googleAuthUrl: string = oauth2Client.generateAuthUrl({
                // access_type: "offline",
                response_type: "code",
                scope: scopes,
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: CodeChallengeMethod.S256,
            });



            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Redirect URL generated successfully!!!",
                url: googleAuthUrl
            })


        } catch (error: unknown) {
            next(error);

        }








    });



gmailRouter.post("/link",
    ensureJWTAuthentication,
    async (req: Request, res: Response<ISuccessRedirectUrl | ICustomErrorResponse>, next: NextFunction) => {

        try {

            const user = req.user!;

            const state: string = crypto.randomBytes(64).toString('hex');
            const stateHash = crypto
                .createHash("sha256")
                .update(state)
                .digest("hex");

            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_CALLBACK_URL
            );

            const scopes: string[] = [
                "openid",
                "https://www.googleapis.com/auth/userinfo.email"
            ];

            const {
                codeVerifier,
                codeChallenge
            } = await oauth2Client.generateCodeVerifierAsync();

            if (typeof codeChallenge !== "string") {
                return res.status(500).json({
                    ok: false,
                    status: 500,
                    message: "Failed to generate code challenge for Google OAuth"
                });
            }

            const oauthSession = await prisma.oAuthSession.create({
                data: {
                    state: stateHash,
                    userId: user.userId,
                    expiresAt: expiresAt,
                    purpose: "LINK",
                    provider: "GMAIL",
                    codeChallenge: codeChallenge,
                    codeVerifier: codeVerifier
                }
            });

            // if (!userResult.ok) {
            //     const oauthSession = await prisma.oAuthSession.create({
            //         data: {
            //             state: stateHash,
            //             userId: null,
            //             expiresAt: expiresAt,
            //             purpose: "LOGIN",
            //             provider: "GMAIL",
            //             codeChallenge: codeChallenge,
            //             codeVerifier: codeVerifier
            //         }
            //     });



            // } else {





            // }



            // const googleAuthUrl: string =
            //     "https://accounts.google.com/o/oauth2/v2/auth" +
            //     `?client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID!)}` +
            //     `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL!)}` +
            //     `&response_type=code` +
            //     `&scope=${encodeURIComponent("openid profile email")}` +
            //     `&state=${encodeURIComponent(state)}`;


            const googleAuthUrl: string = oauth2Client.generateAuthUrl({
                // access_type: "offline",
                response_type: "code",
                scope: scopes,
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: CodeChallengeMethod.S256,
            });



            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Redirect URL generated successfully!!!",
                url: googleAuthUrl
            })


        } catch (error: unknown) {
            next(error);

        }






    });



gmailRouter.get("/callback",
    async (req: Request, res: Response, next: NextFunction) => {

        try {

            const {
                code,
                state,
                error,
                error_description
            } = req.query;

            if (
                !state ||
                typeof state !== "string" ||
                !code ||
                typeof code !== "string"
            ) {
                const missingStateKey: IOauthErrorCode = "missing_required_parameter";

                return res.redirect(`${domain}?${OAuthErrorKey}=${missingStateKey}`);
            }




            const stateHash = crypto
                .createHash("sha256")
                .update(state)
                .digest("hex");

            const oauthSession = await prisma.oAuthSession.findUnique({
                where: {
                    state: stateHash
                }
            });

            if (!oauthSession || oauthSession.expiresAt.getTime() < Date.now()) {
                const expiredStateKey: IOauthErrorCode = "session_expired";

                return res.redirect(`${domain}?${OAuthErrorKey}=${expiredStateKey}`);
            }


            const returnUrl = `${domain}/${oauthSession.purpose === "LINK" ? ("profile/" + oauthSession.userId) : oauthSession.purpose === "LOGIN" ? "login" : ""}`;




            if (error === "access_denied") {

                return res.redirect(`${returnUrl}`);
            }

            if (error) {
                const unknownErrorKey: IOauthErrorCode = "unknown_error";

                console.log(`OAuth error from provider: ${error} - ${error_description}`);

                return res.redirect(`${returnUrl}?${OAuthErrorKey}=${unknownErrorKey}`);
            }


            const oauth2Client: OAuth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_CALLBACK_URL
            );




            const googleOAuthResponse = await googleOAuthUserInfoFetch({
                code: code,
                codeVerifier: oauthSession.codeVerifier,
                oauth2Client: oauth2Client
            });

            if (!googleOAuthResponse.ok) {
                return res.redirect(`${returnUrl}?${OAuthErrorKey}=${googleOAuthResponse.error}`);
            }

            const { email, sub } = googleOAuthResponse;



            const existingAccount = await prisma.externalAccount.findUnique({
                where: {
                    unique_provider_account: {
                        provider: "GMAIL",
                        providerId: sub
                    }
                }
            });


            if (oauthSession.purpose === "LINK" && existingAccount && existingAccount.userId !== oauthSession.userId) {
                const accountAlreadyLinkedKey: IOauthErrorCode = "account_already_linked";

                return res.redirect(`${returnUrl}?${OAuthErrorKey}=${accountAlreadyLinkedKey}`);
            }


            if (oauthSession.purpose === "LOGIN" && !existingAccount) {
                const accountNotLinkedKey: IOauthErrorCode = "account_not_linked";

                return res.redirect(`${returnUrl}?${OAuthErrorKey}=${accountNotLinkedKey}`);
            }


            await prisma.externalAccount.upsert({
                where: {
                    unique_provider_account: {
                        provider: "GMAIL",
                        providerId: sub
                    }
                },
                update: {
                    providerEmail: email
                },
                create: {
                    provider: "GMAIL",
                    providerId: sub,
                    providerEmail: email,
                    userId: oauthSession.userId!
                }
            });

            if (oauthSession.purpose ==="LOGIN") {
                const refreshTokenResponse = await CreateRefreshToken(existingAccount!.userId);

                if (!refreshTokenResponse.ok) {
                    const unknownErrorKey: IOauthErrorCode = "unknown_error";

                    console.log(`Error creating refresh token for user ${existingAccount!.userId}: ${refreshTokenResponse.error}`);

                    return res.redirect(`${returnUrl}?${OAuthErrorKey}=${unknownErrorKey}`);
                }

                return res
                    .cookie(refreshTokenCookieKey, refreshTokenResponse.refreshToken, refreshTokenResponse.cookieOptions)
                    .redirect(`${returnUrl}`);
            }



            return res.redirect(`${returnUrl}`);



        } catch (error: unknown) {
            const unknownErrorKey: IOauthErrorCode = "unknown_error";

            console.log(`Error during OAuth callback processing: ${error instanceof Error ? error.message : String(error)}`);

            return res.redirect(`${domain}?${OAuthErrorKey}=${unknownErrorKey}`);

        }


    });