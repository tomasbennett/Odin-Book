import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { UserSearchBarSchema } from "./ISearchBarUser";


export const UserSearchedAPISuccessSchema = APISuccessSchema.extend({
    usersSearched: z.array(UserSearchBarSchema)
});



export type IUserSearchedAPISuccess = z.infer<typeof UserSearchedAPISuccessSchema>;