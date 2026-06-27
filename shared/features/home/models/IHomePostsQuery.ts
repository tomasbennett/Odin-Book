import z from "zod";
import { SearchQuerySchema } from "../../util/models/ISearchQuery";
import { sortKeyWord } from "../../posts/constants";
import { SortPostByQuerySchema } from "../../posts/models/ISortPostsByQuery";
import { sortPostsDefaultHomePage } from "../constants";


export const HomePostsQuerySchema = SearchQuerySchema.extend({
    [sortKeyWord]: SortPostByQuerySchema.catch(sortPostsDefaultHomePage)
});


export type IHomePostsQuery = z.infer<typeof HomePostsQuerySchema>;