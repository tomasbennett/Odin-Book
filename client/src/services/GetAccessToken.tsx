import { NavigateFunction } from "react-router-dom";
import { accessTokenLocalStorageKey } from "../constants/constants";
import { NewAccessTokenRequest } from "./NewAccessTokenRequest";
import { IResponseTypes } from "../models/IResponseTypes";

export async function GetAccessToken(
    navigate: NavigateFunction
): Promise<IResponseTypes<string> | null> {
    const accessToken = localStorage.getItem(accessTokenLocalStorageKey);
    if (accessToken) return {
        type: "response",
        data: accessToken
    };
    
    console.log("ACCESS TOKEN NOT FOUND");

    const newAccessToken = await NewAccessTokenRequest(navigate);
    if (!newAccessToken) return null;
    return newAccessToken;


}