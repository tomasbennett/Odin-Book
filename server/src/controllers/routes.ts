import { NextFunction, Request, Response, Router } from "express";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

import { router as authRouter } from "./auth";
import { router as signInRouter } from "./sign-in";

export const apiRouter = Router();


apiRouter.use("/auth", authRouter);
apiRouter.use("/sign-in", signInRouter);



apiRouter.use((req: Request, res: Response<ICustomErrorResponse>, next: NextFunction) => {
    return res.status(404).json({
        ok: false,
        status: 404,
        message: "The requested endpoint does not exist!!!"
    });
});