import { NextFunction, Request, Response, Router } from "express";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

import { router as authRouter } from "./auth";
import { router as signInRouter } from "./sign-in";
import { router as commentsRouter } from "./comments";
import { router as postsRouter } from "./posts";
import { router as usersRouter } from "./users";
import { router as homeRouter } from "./home";
import { router as repliesRouter } from "./replies";
import { router as profileRouter } from "./profile";


export const apiRouter = Router();


apiRouter.use("/auth", authRouter);
apiRouter.use("/sign-in", signInRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/home", homeRouter);
apiRouter.use("/replies", repliesRouter);
apiRouter.use("/profile", profileRouter);



apiRouter.use((req: Request, res: Response<ICustomErrorResponse>, next: NextFunction) => {
    return res.status(404).json({
        ok: false,
        status: 404,
        message: "The requested endpoint does not exist!!!"
    });
});