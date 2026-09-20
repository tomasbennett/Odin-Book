import { Router, Request, Response, NextFunction } from "express";
import { CheckAccessTokenPayload } from "../auth/CheckAccessTokenPayload";

export const router = Router();




const gmailRouter = Router();
const linkedInRouter = Router();
const githubRouter = Router();


router.use("/gmail", gmailRouter);
router.use("/linkedin", linkedInRouter);
router.use("/github", githubRouter);







gmailRouter.get("/redirect", async (req: Request, res: Response, next: NextFunction) => {
    
    const header = req.headers.authorization;

    const userResult = await CheckAccessTokenPayload(header);

    




});