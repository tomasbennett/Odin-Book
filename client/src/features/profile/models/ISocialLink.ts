export type ISocialLink = {
    socialLinkExists: false;
} | {
    socialLinkExists: true;
    link: string;
    username: string;
}