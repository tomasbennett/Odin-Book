import z from "zod";
import { minUsernamePasswordLength, maxUsernamePasswordLength, usernamePasswordRegex } from "../constants";

export const usernamePasswordSchema = z.string()
    .min(minUsernamePasswordLength, { message: `Must be at least ${minUsernamePasswordLength} characters long.` })
    .max(maxUsernamePasswordLength, { message: `Must be at most ${maxUsernamePasswordLength} characters long.` })
    .regex(usernamePasswordRegex, { message: "This contains certain invalid characters." });


export type IUsernamePassword = z.infer<typeof usernamePasswordSchema>;