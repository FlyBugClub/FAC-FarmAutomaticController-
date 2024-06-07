import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Navigate, Routes } from 'react-router-dom';
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassw from "./components/Auth/ForgotPassw";
import { Dashboard } from "./components/Dashboard/dashboard";
import NewPassw from "./components/Auth/NewPassw";
import Menu from './components/Menu/menu';
import Weather from './components/Weather/weather';
import Farm from './components/Farm/farm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [weatherState, setWeatherState] = useState(true);
  const [loginState,setLoginState] = useState(false);

  useEffect(() => {
    console.log(loginState)
  }, [loginState])
  const handleLogin = () => {
    setLoginState(!loginState);
  }

  const handleWeather = () => {
    setWeatherState(!weatherState);
  }
  return (

    <Router>
      <div className="App" >
        <header className="App-header">
          {
            loginState ?
                <div style={{ position: "fixed", width: "100%", height: "100%" }}>
                  <img src="/images/b3.jpg" alt="" style={{ position: "fixed", zIndex: "-1", width: "100%", height: "100%", filter: "brightness(0.9)" }} />
                  <Menu handleWeather={handleWeather} weatherState={weatherState} />
                  <div style={{ display: "flex", width: "100%", height: `calc(100vh - 50px)`, padding: "15px", boxSizing: "border-box" }}>
                    <Weather weatherState={weatherState} />
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard  weatherState={weatherState}/>} />
                      <Route path="/farm" element={<Farm  weatherState={weatherState}/>} />

                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/login" element={<Navigate to="/dashboard" />} />
                    </Routes>
                    
                  </div>
                </div>
           
            :
            <Routes>

            <Route path="/login" element={<Login handleLogin={handleLogin}/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassw />} />
            <Route path="/newpassw" element={<NewPassw />} />
            
            {/* <Route
              path="/home/dashboard"
              element={
              }
            />
              <Route
              path="/home/farm"
              element={
                <div style={{ position: "fixed", width: "100%", height: "100%" }}>
                  <img src="/images/b3.jpg" alt="" style={{ position: "fixed", zIndex: "-1", width: "100%", height: "100%", filter: "brightness(0.9)" }} />
                  <Menu handleWeather={handleWeather} weatherState={weatherState} />
                  <div style={{ display: "flex", width: "100%", height: `calc(100vh - 50px)`, padding: "15px", boxSizing: "border-box" }}>
                    <Weather weatherState={weatherState} />
                    
                  </div>
                </div>
              }
            /> */}

            {/* <Route path="/home/*" element={<Navigate to="/home/dashboard" />} /> */}
            {/* <Route path="/home" element={<Navigate to="/home/dashboard" />} /> */}

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
          }
          
        </header>

      </div>
      <ToastContainer />
    </Router>


  );
}

export default App;
