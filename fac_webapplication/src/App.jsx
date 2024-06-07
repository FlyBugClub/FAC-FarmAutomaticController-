import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Navigate,
  Routes,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassw from "./components/Auth/ForgotPassw";
import { Dashboard } from "./components/Dashboard/dashboard";
import NewPassw from "./components/Auth/NewPassw";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callAPi, host } from "./services/UserService";
import { AuthContext } from "./AuthContext";
  function App() {
  // const [user, setUser] = useState(false);
  // setUser(JSON.parse(localStorage.getItem("user")));
  // useEffect(() => {
  //   const checkApi = async () => {
  //     let res = await callAPi("post", `http://61.28.230.132:3004/auth/Login`, {
  //       username: "ndtt",
  //       password: "abc123",
  //     });

  //     console.log(res);
  //   };

  //   checkApi();
  // }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Context = useContext(AuthContext);
  useEffect(() => {
  setIsLoggedIn(Context.isLoggedIn);
   
  })
  return (
    
    <Router>
      <div className="App">
        { isLoggedIn ? 
        <header className="App-header">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassw />} />
          <Route path="/newpassw" element={<NewPassw />} />
          <Route path="/" element={<Dashboard/>} />
        </Routes>
      </header> :
        <Routes>
         
         <Route path="/" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassw />} />
          <Route path="/newpassw" element={<NewPassw />} />
          <Route path="/" element={<Navigate to="/signup" />} />
         </Routes>
         }
        
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
