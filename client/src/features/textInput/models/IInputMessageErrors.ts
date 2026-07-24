import { IJWTFetchResponses } from "../../../models/IJWTFetchResponses";


export type IUseInputMessageParams = {
    parseInputFunc: IInputMessageParse,
    parseResponseFunc: IParseResponseFunc
    allowedFileMimeTypes: string[],
    allowedMaxFileSize: number
}


export type IParseResponseFunc = (data: unknown) => { ok: true } | { ok: false }


export type IInputMessageBody = {
    textContent: string | undefined,
    files: File[]
}


export type IInputMessageParse = ({
    textContent, files
}: IInputMessageBody) => 
    { success: true, fetchUrl: string, reqBody: RequestInit } | { success: false, error: IInputMessageErrors }
;


export type IInputMessageErrors = ({
    content: string | undefined
    files: string | undefined
    root: string | undefined;
});