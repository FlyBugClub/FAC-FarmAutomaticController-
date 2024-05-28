import { BrowserView, MobileView } from "react-device-detect";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { FiEye, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";

const Login = () => {
  const navigate = useNavigate();
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

          <div className="Auth_BrowserView_Region-Login">
            <div className="Auth_BrowserView_Region-Login_Input ">
              <div>
                <FiUser color="white" size={24} />
              </div>
              <input type="text" placeholder="Tên tài khoản"></input>
            </div>
            <div className="Auth_BrowserView_Region-Login_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input type="text" placeholder="Mật khẩu"></input>
              <div>
                <FiEye color="white" />
              </div>
            </div>
            <div className="Auth_BrowserView_Region-Login_Save">
              <input type="checkbox" />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_BrowserView_Region-Login_Button">
              <button type="submit" >Đăng nhập</button>
            </div>
            <div className="Auth_BrowserView_Region-Login_Stuff">
              <div onClick={() => navigate("/signup")}>Đăng ký tài khoản</div>
              <div onClick={() => navigate("/forgotpassword")}>Quên mật khẩu</div>
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
