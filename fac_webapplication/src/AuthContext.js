import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();
const apiURL = "http://172.31.8.230:3001";
function AuthProvider({ children }) {

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const login = (check) => {
    setIsLoggedIn(true);
    if (check) {
      localStorage.setItem("token", JSON.stringify(true));

    } else {
      sessionStorage.setItem("token", JSON.stringify(true));
     
    }
  };
  const logout = () => {
    setIsLoggedIn(false);
    const storedSession = sessionStorage.getItem("token");
    const storedLocal = localStorage.getItem("token");
    if (storedSession || storedLocal) {
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
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
    apiURL,
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
