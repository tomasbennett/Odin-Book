import React, { useEffect, useRef, useState } from "react";
import { ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import styles from "./ErrorContext.module.css";
import { waitForAnimationEnd } from "../../../util/WaitForAnimationToEnd";
import { popupTime } from "../../../constants/popUpConstants";
import { usePopup } from "../../../hooks/usePopup";
import { noErrorCtxError } from "../../../constants/errorConstants";


const ErrorContext = React.createContext<{
    throwError: (error: ICustomErrorResponse) => void;
} | null>(null);


export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const {
        startPopup: throwError,
        infoContainerRef: errorContainerRef,
        isClosing,
        info: error
    } = usePopup<ICustomErrorResponse>();



    useEffect(() => {
        if (error) {
            console.log(error.message);
            console.dir(error);
        }
    }, [error]);

    return (
        <ErrorContext.Provider value={{ throwError }}>
            {
                children
            }
            {
                error && (
                    <>
                        <div
                            ref={errorContainerRef}
                            className={`${styles.outerContainer} ${isClosing ? styles.exitScreen : ""}`}
                        >
                            <strong>Error: {error.message}</strong>
                            <p>Status: {error.status}</p>
                        </div>
                    </>
                )
            }
        </ErrorContext.Provider>
    );
};


export const useError = () => {
    const context = React.useContext(ErrorContext);

    if (!context) {
        throw new Error(noErrorCtxError.message);
    }

    return context;
};