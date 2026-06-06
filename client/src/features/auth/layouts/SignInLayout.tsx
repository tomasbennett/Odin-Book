import { Link, Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import styles from "./SignInLayout.module.css";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { domain } from "../../../constants/EnvironmentAPI";
import { useEffect, useMemo, useRef } from "react";
import { ISignInError, SignInErrorSchema, ILoginForm, loginFormSchema } from "../../../../../shared/features/auth/models/ILoginSchema";
import { ISignInContext } from "../models/ISignInContext";
import { BackgroundVideoContainer } from "../../../components/BackgroundVideoContainer";
import { AccessTokenResponseSchema } from "../../../../../shared/features/auth/models/IAccessTokenResponse";
import { accessTokenLocalStorageKey, mediumScreenMaxWidth, thinScreenMaxWidth, wideScreenMINWidth } from "../../../constants/constants";
import { useMediaQuery } from "react-responsive";


export function SignInLayout() {
    const matches = useMatches() as Array<{ handle?: ISignInContext }>;

    const title = matches.find(match => match.handle?.title)?.handle?.title || "Sign In";
    const submitUrl = title.toLowerCase();




    const navigate = useNavigate();

    const location = useLocation();
    const stateERRORS = location.state?.error as ISignInError | undefined;

    const defaultErrors = useMemo(() => {
        const result = SignInErrorSchema.safeParse(stateERRORS);
        if (!result.success) return undefined;

        return {
            [result.data.inputType]: {
                type: "server",
                message: result.data.message,
            },
        };
    }, [stateERRORS]);




    useEffect(() => {
        if (stateERRORS) {
            window.history.replaceState({}, document.title);
        }

    }, []);







    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<ILoginForm>({
        resolver: zodResolver(loginFormSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        errors: defaultErrors
    });



    const prevPathRef = useRef(location.pathname);

    useMemo(() => {
        if (prevPathRef.current !== location.pathname) {
            clearErrors();
            prevPathRef.current = location.pathname;
        }
    }, [location.pathname, clearErrors]);







    const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
        try {
            const response = await fetch(`${domain}/api/${submitUrl}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                // credentials: "include"
            });


            const responseData = await response.json();
            
            const accessTokenResult = AccessTokenResponseSchema.safeParse(responseData);
            if (accessTokenResult.success) {
                localStorage.setItem(accessTokenLocalStorageKey, accessTokenResult.data.accessToken);
                navigate("/");
                return;
            }
            
            
            const errorResult = SignInErrorSchema.safeParse(responseData);
            if (errorResult.success) {
                setError(errorResult.data.inputType, { type: "server", message: errorResult.data.message });

            } else {
                setError("root", { type: "server", message: "An unknown error occurred." }); //PLEASE DON'T FORGET FOR LATER PROJECTS THAT root CAN HAVE ADDITIONAL PROPERTIES ATTACHED TO IT FOR CUSTOM ERRORS IF YOU HAVE A SERVER ERROR UNRELATED TO THE USER INPUTS LIKE root.serverError

            }



        } catch (error) {
            setError("root", { type: "server", message: "Failed to connect to the server." });

        }
    }


    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });
    const isWideScreen: boolean = useMediaQuery({ minWidth: wideScreenMINWidth + 1 });

    const signInContainerClassNames: string = useMemo(() => {

        if (isThinScreen) {
            return`${styles.thinOuterContainer}`;
        } else if (isMediumScreen) {
            return `${styles.mediumOuterContainer}`;
        } else {
            return `${styles.wideOuterContainer}`;
        }

    }, [isThinScreen, isMediumScreen, isWideScreen]);

    return (
        <>
            <Outlet />

            <div className={`${signInContainerClassNames} ${styles.signinOuterContainer}`}>

                <div className={styles.backgroundVideoSection}>

                    <BackgroundVideoContainer>
                        <div className={styles.welcomeMessageContainer}>
                            <h1>Welcome to my Blog API Project</h1>
                            <p>Please log in here, or if you don't have an account register by clicking on Sign up here!</p>
                        </div>
                    </BackgroundVideoContainer>

                </div>


                <div className={styles.loginSection}>

                    <h2>{title}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {
                            errors.root && (
                                <p className={styles.errorMessage}>{errors.root.message}</p>
                            )
                        }
                        <div className={styles.inputGroup}>
                            {
                                errors.username && (
                                    <p className={styles.errorMessage}>{errors.username.message}</p>
                                )
                            }
                            <label htmlFor="username">Username</label>
                            <input
                                {...register("username")}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username..."
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            {
                                errors.password && (
                                    <p className={styles.errorMessage}>{errors.password.message}</p>
                                )
                            }
                            <label htmlFor="password">Password</label>
                            <input
                                {...register("password")}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password..."
                            />
                        </div>

                        <button className={styles.submitButton} type="submit">Submit</button>
                    </form>
                    {
                        submitUrl === "login" ?

                            <p className={styles.switchSignInParagraph}>
                                Don't have an account?
                                <Link to="/sign-in/register">Sign up here</Link>
                            </p>
                            :
                            <p className={styles.switchSignInParagraph}>
                                Already have an account?
                                <Link to="/sign-in/login">Log in here</Link>
                            </p>

                    }
                </div>



            </div>
        </>
    )
}

