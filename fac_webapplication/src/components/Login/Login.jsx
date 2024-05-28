import {
  BrowserView,
  MobileView,
 
} from "react-device-detect";
import React from "react";

import "./Login.scss";

const Login = () => {
  return (
    <div className="Login">
      <BrowserView className="Login_BrowserView">
        <div className="Login_BrowserView_Region">
         123
        </div>
      </BrowserView>


      <MobileView>
        <h1>This is rendered only on mobile</h1>
      </MobileView>
    </div>
  );
};

export default Login;
