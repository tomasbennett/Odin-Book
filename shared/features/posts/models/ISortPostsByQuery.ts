import z from "zod";
import { VALID_SORT_OPTIONS } from "../constants";



export const SortPostByQuerySchema = z.enum(VALID_SORT_OPTIONS);



export type ISortPostByQuery = z.infer<typeof SortPostByQuerySchema>;