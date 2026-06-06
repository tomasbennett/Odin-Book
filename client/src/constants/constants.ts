import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse"

export const jsonParsingError: ICustomErrorResponse = {
    ok: false,
    status: 0,
    message: "There was an error parsing the json data!!!"
}



export const notExpectedFormatError: ICustomErrorResponse = {
    ok: false,
    status: 0,
    message: "The returned data was not in the correct format!!!"
}



export const accessTokenLocalStorageKey: string = "accessToken";



export const thinScreenMaxWidth: string = "53.125rem";
export const mediumScreenMaxWidth: string = "84.375rem";
export const wideScreenMINWidth: string = mediumScreenMaxWidth;