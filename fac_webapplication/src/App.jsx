import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Navigate, Routes } from 'react-router-dom';
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassw from "./components/Auth/ForgotPassw";
import { Dashboard } from "./components/Dashboard/dashboard";
import NewPassw from "./components/Auth/NewPassw";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassw />} />
            <Route path="/newpassw" element={<NewPassw />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </header>
      </div>
      <ToastContainer />
    </Router>
      

  );
}

export default App;
