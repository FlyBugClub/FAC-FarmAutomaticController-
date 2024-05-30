import { BrowserView, MobileView } from "react-device-detect";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import "./Auth.scss";

const Login = () => {

  const navigate = useNavigate();
  const [open, setOpen ] = useState(false);
  const handleOpenEye = () => {
    setOpen(!open)
  }
  const [open1, setOpen1 ] = useState(false);
  const handleOpenEye1 = () => {
    setOpen1(!open1)
  }
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
            <input type={open ? "text" : "password"} placeholder="Mật khẩu"></input>
            <div onClick={() => handleOpenEye()}>
            {open ? <FiEye color="white" /> : <FiEyeOff color="white" />}
            </div>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
            <div>
              <FiLock color="white"size={24} />
            </div>
            <input type={open1 ? "text" : "password"} placeholder="Xác nhận mật khẩu"></input>
            <div onClick={() => handleOpenEye1()}>
              {open1 ? <FiEye color="white" /> : <FiEyeOff color="white" />}</div>
            </div>
          <div className="Auth_BrowserView_Region-Signup_Save">
            <input type="checkbox"/>
            <div>Lưu đăng nhập</div>
          </div>
          <div className="Auth_BrowserView_Region-Signup_Button">
            <button type="submit" onClick={() => navigate('/login')}>Đăng ký</button>
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
