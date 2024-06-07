import { createContext, useState } from "react";
import { Navigate } from "react-router-dom";

const  AuthContext = createContext();

function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const login = (check) => {
        const newIsLoggedIn = !isLoggedIn;
        setIsLoggedIn(newIsLoggedIn);
        if (check) {
            localStorage.setItem("user", JSON.stringify(true));
        } else {
            sessionStorage.setItem("user", JSON.stringify(true));
        }
    };
    const logout = () => {
        const storedSession = sessionStorage.getItem("user");
        const storedLocal = localStorage.getItem("user");
        if (storedSession || storedLocal) {
            sessionStorage.removeItem("user");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            Navigate("/login");
        }
    };
    const value = {
        isLoggedIn,
        login
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
export { AuthContext, AuthProvider }