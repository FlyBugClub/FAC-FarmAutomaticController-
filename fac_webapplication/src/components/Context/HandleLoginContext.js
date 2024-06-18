import { createContext, useEffect, useState } from "react";

const HandleLoginContext = createContext();
// const apiURL = "http://10.101.172.53:8080";// run on server
// const apiURL = "http://103.130.211.141:8080"; //http://103.130.211.141:8080/ run on local
const apiURL = "http://172.31.8.230:3001"; // run on dat
function HandleLoginContextProvider({ children }) {
  const [user, setUser] = useState([]);
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
      localStorage.getItem("token") || sessionStorage.getItem("token");
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
    if (isLoggedIn === true) {
      console.log("da chay den day");
      let json = sessionStorage.getItem("user_info");
      json = JSON.parse(json);
      setUser(json);
    }
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <HandleLoginContext.Provider value={value}>
      {!loading && children}
    </HandleLoginContext.Provider>
  );
}
export { HandleLoginContext, HandleLoginContextProvider };
