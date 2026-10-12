import { ILinkLoginUrlOAuth } from "../models/ILinkLoginUrlOAuth";

type IUsePhoneNumberSubmission = {
    fetchUrl: ILinkLoginUrlOAuth;
}


export function usePhoneNumberSubmission({
    fetchUrl
}: IUsePhoneNumberSubmission) {

    const onSubmit = async () => {

    }



    return {
        onSubmit
    }

}