import { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const login = (check) => {
    setIsLoggedIn(true);
    if (check) {
      localStorage.setItem("user", JSON.stringify(true));
    } else {
      sessionStorage.setItem("user", JSON.stringify(true));
    }
  };
  const logout = () => {
    setIsLoggedIn(false);
    const storedSession = sessionStorage.getItem("user");
    const storedLocal = localStorage.getItem("user");
    if (storedSession || storedLocal) {
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  };
  const checkToken = () => {
    const token =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  };
  const value = {
    isLoggedIn,
    login,
    checkToken,
    logout,
  };
  useEffect(() => {
    checkToken();
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
