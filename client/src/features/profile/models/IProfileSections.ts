export const ProfileSections = ["Replies", "Posts", "Comments"] as const;


export type IProfileSections = typeof ProfileSections[number];