import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import upload from "../supabase/multer";
import { POST_FILE_ARRAY_KEY } from "../../../shared/features/posts/constants";


export const router = Router();


router.get("/:userId", ensureJWTAuthentication, (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
    //SO WHILST YOU'LL GET THE ORIGINAL BULK FROM /USERS/:USERID, THIS ENDPOINT WILL BE USED TO GET ANY ADDITIONAL POSTS THAT THE USER HAS MADE, AND WILL BE USED FOR INFINITE SCROLLING BUT NOT HAVING TO LOAD IT ALL IN ONE GO!!!
});





router.get("/:postId/comments", ensureJWTAuthentication, (req: Request<{ postId: string }>, res: Response, next: NextFunction) => {

});


router.post("/", ensureJWTAuthentication, upload.array(POST_FILE_ARRAY_KEY), async (req: Request, res: Response, next: NextFunction) => {
//DONT FORGET TO ALLOW IN THE BODY FOR THIS TO BE A REPLY

});


router.delete("/:postId", ensureJWTAuthentication, async (req: Request<{ postId: string }>, res: Response, next: NextFunction) => {

});


router.post("/:postId/like", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});

router.post("/:postId/unlike", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});