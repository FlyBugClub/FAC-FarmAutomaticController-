import {
  BrowserView,
  MobileView,
 
} from "react-device-detect";
import React from "react";

import "./Login.scss";

const Login = () => {
  return (
    <div>
      <BrowserView>
        <div className="Login">
          <img src="images/CanhDong.jpg" alt="" style={{ width: "100%" }} />
          <div className="Login"></div>
        </div>
      </BrowserView>
      <MobileView>
        <h1>This is rendered only on mobile</h1>
      </MobileView>
    </div>
  );
};

export default Login;
