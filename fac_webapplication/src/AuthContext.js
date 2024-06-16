import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();
const apiURL = "http://10.101.172.53:8080";
function AuthProvider({ children }) {

  const [user, setUser] = useState([])
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
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);   
      
    }
    setLoading(false);
  };
  
  const value = {
    apiURL,
    isLoggedIn,
    user,
    login,
    checkToken,
    logout,
  };
  useEffect(() => {
    checkToken();
    if(isLoggedIn === true)
    {
      console.log('da chay den day')
      let json = sessionStorage.getItem('user_info');
      json = JSON.parse(json);
      setUser(json)
    }
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
