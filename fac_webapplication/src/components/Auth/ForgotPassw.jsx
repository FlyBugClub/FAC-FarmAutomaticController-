import { BrowserView, MobileView } from "react-device-detect";
import React from "react";
import { FiMail} from "react-icons/fi";
import "./Auth.scss";

const ForgotPassw = () => {
  return (
    <div className="Auth">
      <BrowserView className="Auth_BrowserView">
        <div className="Auth_BrowserView_Region-Forgot">
          <div className="Auth_BrowserView_Region-Forgot_Input ">
            <div>
              <FiMail  color="white" size={24} />
            </div>
            <input type="text" placeholder="Email"></input>
          </div>
          <div className="Auth_BrowserView_Region-Forgot_Button">
            <button type="submit">Gửi</button>
          </div>
        </div>
      </BrowserView>

      <MobileView>
        <h1>This is rendered only on mobile</h1>
      </MobileView>
    </div>
  );
};

export default ForgotPassw;
