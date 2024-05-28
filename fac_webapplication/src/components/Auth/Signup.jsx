import { BrowserView, MobileView } from "react-device-detect";
import React from "react";
import { FiEye, FiLock, FiMail, FiUser } from "react-icons/fi";
import "./Auth.scss";

const Login = () => {
  return (
    <div className="Auth">
      <BrowserView className="Auth_BrowserView">
        <div className="Auth_BrowserView_Region-Signup">
          <div className="Auth_BrowserView_Region-Signup_Input ">
            <div>
              <FiUser color="white" size={24} />
            </div>
            <input type="text" placeholder="Tên tài khoản"></input>
          
          </div>
          <div className="Auth_BrowserView_Region-Signup_Input">
            <div>
              <FiMail  color="white"size={24} />
            </div>
            <input type="text" placeholder="Email"></input>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
            <div>
              <FiLock color="white"size={24} />
            </div>
            <input type="text" placeholder="Mật khẩu"></input>
            <div><FiEye  color="white"/></div>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
            <div>
              <FiLock color="white"size={24} />
            </div>
            <input type="text" placeholder="Xác nhận mật khẩu"></input>
            <div><FiEye  color="white"/></div>
            </div>
          <div className="Auth_BrowserView_Region-Signup_Save">
            <input type="checkbox"/>
            <div>Lưu đăng nhập</div>
          </div>
          <div className="Auth_BrowserView_Region-Signup_Button">
            <button type="submit">Đăng ký</button>
          </div>
          
        </div>
      </BrowserView>

      <MobileView>
        <h1>This is rendered only on mobile</h1>
      </MobileView>
    </div>
  );
};

export default Login;
