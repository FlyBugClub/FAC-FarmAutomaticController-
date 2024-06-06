import React,{useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Navigate, Routes } from 'react-router-dom';
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassw from "./components/Auth/ForgotPassw";
import { Dashboard } from "./components/Dashboard/dashboard";
import NewPassw from "./components/Auth/NewPassw";
import Menu from './components/Menu/menu';
import Farmcontroller from './components/Farmcontroller/farmcontroller';
import Weather from './components/Weather/weather';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { callAPi, host } from './services/UserService';
function App() {

  const [weatherState, setWeatherState] = useState(true);
  const handleWeather = () => {
    setWeatherState(!weatherState);
  }
  return (
    
    <Router>
      <div className="App" style={{position:"fixed",width: "100%", height: "100%"}}>
        <img src="./images/bg3.jpg" alt="" style={{position:"fixed",zIndex: "-1",width: "100%", height: "100%",filter: "brightness(0.9)"}}/>

        <Menu handleWeather={handleWeather} weatherState={weatherState}/>
        <div style={{display:"flex",width: "100%", height: "100%"}}>
          <Weather weatherState={weatherState}/>
          <Dashboard weatherState={weatherState}/>
        </div>
        
        {/* <header className="App-header">
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassw />} />
            <Route path="/newpassw" element={<NewPassw />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </header> */}
        
        
      </div>
      <ToastContainer />
    </Router>
      

  );
}

export default App;
