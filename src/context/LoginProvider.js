/* eslint-disable react/prop-types */
import React, { useState, createContext, useContext } from "react";


const LoginContext = createContext();


export function LoginProvider ({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </LoginContext.Provider>
    )
}


export function useLogin() {
    const context = useContext(LoginContext);
    return context;
}
