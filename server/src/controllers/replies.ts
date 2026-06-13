import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";

export const router = Router();



router.get("/", ensureJWTAuthentication, (req: Request, res: Response, next: NextFunction) => {
    //THIS ENDPOINT IS SOLELY FOR THE LOAD MORE ON REPLIES AS THE ORIGINAL BULK OF REPLIES WILL BE LOADED FROM /USERS/:USERID, AND THIS ENDPOINT WILL BE USED TO GET ANY ADDITIONAL REPLIES THAT THE USER HAS MADE, AND WILL BE USED FOR INFINITE SCROLLING BUT NOT HAVING TO LOAD IT ALL IN ONE GO!!!

});