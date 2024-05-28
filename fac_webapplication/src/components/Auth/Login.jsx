import { BrowserView, MobileView } from "react-device-detect";
import React from "react";
import { FiLock, FiUser } from "react-icons/fi";
import "./Login.scss";

const Login = () => {
  return (
    <div className="Auth">
      <BrowserView className="Auth_BrowserView">
        <div className="Auth_BrowserView_Region">
          <div className="Auth_BrowserView_Region_Input ">
            <div>
              <FiUser color="white" size={24} />
            </div>
            <input type="text" placeholder="Tên tài khoản"></input>
          </div>
          <div className="Auth_BrowserView_Region_Input">
            <div>
              <FiLock color="white"size={24} />
            </div>
            <input type="text" placeholder="Mật khẩu"></input>
          </div>
          <div className="Auth_BrowserView_Region_Save">
            <input type="checkbox"/>
            <div>Lưu đăng nhập</div>
          </div>
          <div className="Auth_BrowserView_Region_Button">
            <button type="submit">Đăng nhập</button>
          </div>
          <div className="Auth_BrowserView_Region_Stuff">
            <div>
                Đăng ký tài khoản
            </div>
            <div>
                Quên mật khẩu
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

export default Login;
