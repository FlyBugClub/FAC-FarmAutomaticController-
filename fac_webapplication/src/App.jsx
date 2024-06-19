import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Navigate,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassw from "./components/Auth/ForgotPassw";
import { Dashboard } from "./components/Home/dashboard";
import NewPassw from "./components/Auth/NewPassw";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callAPi, host } from "./services/UserService";
import Menu from "./components/Menu/menu";
import Weather from "./components/Weather/weather";
import Farm from "./components/Home/farm";
import Addfarm from "./components/Home/newfarm";
import User from "./components/Home/user";
//
import { AuthContext } from "./components/Context/AuthContext";
function App() {
  const navigate = useNavigate();
  const [weatherState, setWeatherState] = useState(true);
  const [addDeviceState, setAddDeviceState] = useState("");
  const { URL, login, user, authDispatch } = useContext(AuthContext);
  const handleWeather = () => {
    setWeatherState(!weatherState);
  };
  const handleAddDevice = (key) => {
    setAddDeviceState(key);
  };
  const [token, setToken] = useState(null);
  useEffect(() => {
    let token = null;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      console.log("Token từ localStorage:", token);
      setToken(token);
      authDispatch({
        type: "SET_LOGIN",
        payload: { status: true  },
      });
    }
    if (!token && sessionStorage.getItem("token")) {
      token = JSON.parse(sessionStorage.getItem("token"));
      console.log("Token từ sessionStorage:", token);
      setToken(token);
      authDispatch({
        type: "SET_LOGIN",
        payload: { status: true },
      });
    }
    if (!token) {
      console.log("Không tìm thấy token trong localStorage và sessionStorage")
      authDispatch({
        type: "SET_LOGIN",
        payload: { status: false },
      });
    }
  }, []);
  const getUserByToken = async () => {
    let res = await callAPi("get", `${URL}/data/verify-jwt/`, {
      
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {login.status ? (
          <div style={{ position: "fixed", width: "100%", height: "100%" }}>
            <img
              src="/images/b3.jpg"
              alt=""
              style={{
                position: "fixed",
                zIndex: "-1",
                width: "100%",
                height: "100%",
                filter: "brightness(0.9)",
              }}
            />
            <Menu handleWeather={handleWeather} weatherState={weatherState} />
            <div
              style={{
                display: "flex",
                width: "100%",
                height: `calc(100vh - 50px)`,
                padding: "15px",
                boxSizing: "border-box",
                position: "fixed",
                zIndex: "-1",
              }}
            >
              <Weather weatherState={weatherState} />
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard
                      weatherState={weatherState}
                      handleAddDevice={handleAddDevice}
                    />
                  }
                />
                <Route
                  path="/farm"
                  element={
                    <Farm
                      weatherState={weatherState}
                      handleAddDevice={handleAddDevice}
                    />
                  }
                />
                <Route
                  path="/addfarm"
                  element={
                    <Addfarm
                      weatherState={weatherState}
                      addDeviceState={addDeviceState}
                    />
                  }
                />
                <Route
                  path="/usersetting"
                  element={<User weatherState={weatherState} />}
                />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassw />} />
            <Route path="/newpassw" element={<NewPassw />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </header>
      <ToastContainer />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
