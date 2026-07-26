import z from "zod";
import { IComment } from "../../../../../shared/features/comments/models/IComment";
import { IPost } from "../../../../../shared/features/posts/models/IPost";


export const ProfileSections = ["replies", "posts", "comments"] as const;


export type IProfileSections = typeof ProfileSections[number];

export const ProfileSectionsSchema = z.enum(ProfileSections);

