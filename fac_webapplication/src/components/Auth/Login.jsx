import { BrowserView, MobileView } from "react-device-detect";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";

const Login = () => {
  const [open, setOpen ] = useState(false);
  const navigate = useNavigate();
  const handleOpenEye = () => {
    setOpen(!open)
  }

  const [check, setCheck ] = useState(true);
  const checkLogin = () => {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    if (username.value.trim() === "" || password.value.trim() === "") {
    console.log("Vui long nhap day du thong tin");
    setCheck(false);
      
    }else{
      console.log(username.value);
      console.log(password.value);
      setCheck(true);
    }
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

          <div className="Auth_BrowserView_Region-Login">
            <div className="Auth_BrowserView_Region-Login_Input ">
              <div>
                <FiUser color="white" size={24} />
              </div>
              <input id="username" type="text" placeholder="Tên tài khoản"></input>
            </div>
            <div className="Auth_BrowserView_Region-Login_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input id="password" type={open ? "text" : "password"} placeholder="Mật khẩu"></input>
              <div onClick={() => handleOpenEye()}>
                {open ? <FiEye color="white" /> : <FiEyeOff color="white" />}
              </div>
            </div>
            {
              check ? <div></div> : <div className="Auth_BrowserView_Region-Login_Error">Vui long nhap day du thong tin</div>
              
            }
            <div className="Auth_BrowserView_Region-Login_Save">
              <input type="checkbox" />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_BrowserView_Region-Login_Button">
              <button type="submit" onClick={() => checkLogin()} >Đăng nhập</button>
            </div>
            <div className="Auth_BrowserView_Region-Login_Stuff">
              <div onClick={() => navigate("/signup")}>Đăng ký tài khoản</div>
              <div onClick={() => navigate("/forgotpassword")}>Quên mật khẩu</div>
            </div>
          </div>
        </div>
      </BrowserView>

      <MobileView  className="Auth_MobileView">
      <div >
          <div className="Auth_MobileView_Logo">
            <div className="Auth_MobileView_Logo_Image">
              <img src="/icons/Bug(Trắng).png" alt="" />
            </div>
            <div>
              <div className="div1">Tưới tiêu tự động</div>
              <div className="div2">Giải pháp hoàn hảo cho nhà nông</div>
            </div>
          </div>

          <div className="Auth_MobileView_Region-Login">
            <div className="Auth_MobileView_Region-Login_Input ">
              <div>
                <FiUser color="white" size={24} />
              </div>
              <input id="username" type="text" placeholder="Tên tài khoản"></input>
            </div>
            <div className="Auth_MobileView_Region-Login_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input id="password" type={open ? "text" : "password"} placeholder="Mật khẩu"></input>
              <div onClick={() => handleOpenEye()}>
                {open ? <FiEye color="white" /> : <FiEyeOff color="white" />}
              </div>
            </div>
            <div className="Auth_MobileView_Region-Login_Save">
              <input type="checkbox" />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_MobileView_Region-Login_Button">
              <button type="submit" onClick={() => checkLogin()}>Đăng nhập</button>
            </div>
            <div className="Auth_MobileView_Region-Login_Stuff">
              <div onClick={() => navigate("/signup")}>Đăng ký tài khoản</div>
              <div onClick={() => navigate("/forgotpassword")}>Quên mật khẩu</div>
            </div>
          </div>
        </div>
      </MobileView>
    </div>
  );
};

export default Login;
