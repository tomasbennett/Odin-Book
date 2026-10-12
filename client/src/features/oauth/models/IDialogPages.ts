// import { DIALOG_PAGES } from "../constants/DialogPages";

export const DIALOG_PAGES = ["social", "phoneNumber", "phoneCode"] as const;

export type IDialogPages = typeof DIALOG_PAGES[number];