import { BrowserView, MobileView } from "react-device-detect";
import React from "react";
import { FiMail} from "react-icons/fi";
import "./Auth.scss";

const ForgotPassw = () => {
  return (
    <div className="Auth">
      <BrowserView className="Auth_BrowserView">
        <div>
      <div className="Auth_BrowserView_Logo">
            <div className="Auth_BrowserView_Logo_Image">
              <img src="/icons/Bug(Trắng).png" alt="" />
            </div>
            <div>
              <div className="div1">Tưới tiêu tự động</div>
              <div className="div2">Giải pháp hoàn hảo cho nhà nông</div>
            </div>
          </div>
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
        </div>
      </BrowserView>

      <MobileView>
        <h1>This is rendered only on mobile</h1>
      </MobileView>
    </div>
  );
};

export default ForgotPassw;
