import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();
const apiURL = "http://172.31.8.230:3001";
function AuthProvider({ children }) {
  const [user_info, setUserInfo] = useState({
    id_user: "",
    gmail: "",
    name: "",
    phone_no: "",
    membership: "",
  });

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const login = (check) => {
    setIsLoggedIn(true);
    if (check) {
      localStorage.setItem("user", JSON.stringify(true));
      localStorage.setItem("user_id", "1");
    } else {
      sessionStorage.setItem("user", JSON.stringify(true));
      sessionStorage.setItem("user_id", "1");
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
      const user = localStorage.getItem("user_id");

      
    }
    setLoading(false);
  };
  
  const value = {
    apiURL,
    isLoggedIn,
    user_info,
    setUserInfo,
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
