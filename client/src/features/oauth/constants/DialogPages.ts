import { IDialogPages } from "../models/IDialogPages";
import { ILinkLoginUrlOAuth } from "../models/ILinkLoginUrlOAuth";



export const DIALOG_PAGES_MAP: Record<ILinkLoginUrlOAuth, IDialogPages[]> = {
    "link": ["social", "phoneNumber", "phoneCode"],
    "login": ["phoneNumber", "phoneCode"]
}