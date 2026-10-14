export type ISocialLink = {
    socialLinkExists: false;
} | {
    socialLinkExists: true;
    link?: string | undefined;
    username?: string | undefined;
}