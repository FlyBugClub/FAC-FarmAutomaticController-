import { BrowserView, MobileView } from "react-device-detect";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import "./Auth.scss";
//
import { signUpPassword, checkUserName, checkEmail } from "../../validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpenEye = () => {
    setOpen(!open);
  };
  const [open1, setOpen1] = useState(false);
  const handleOpenEye1 = () => {
    setOpen1(!open1);
  };
  //
  const [userNameError, setUserNameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [emptyName, setEmptyName] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [emptyEmail, setEmptyEmail] = useState(null);
  const [emptyPass, setEmptyPass] = useState(null);
  const [emptyConfPass, setEmptyConfPass] = useState(null);
  const [checkPass, setCheckPass] = useState(null);
  const [signup, setSignup] = useState(null);

  const checkSignup = () => {
    const userName = document.getElementById("username");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const email = document.getElementById("email");

    if (userName.value.trim() === "") {
      setEmptyName(true);
      } else {
        setEmptyName(false);
    }

    if (password.value.trim() === "") {
      setEmptyPass(true);
    } else {
      setEmptyPass(false);
    }

    if (confirmPassword.value.trim() === "") {
      setEmptyConfPass(true);
    } else {
      setEmptyConfPass(false);
    }

    if (email.value.trim() === "") {
      setEmptyEmail(true);
    } else {
      setEmptyEmail(false);
    }

    if (!emptyName && checkUserName(userName.value)) {
      setUserNameError(false);
    } else {
      setUserNameError(true);
    }

    if (!emptyEmail && checkEmail(email.value)) {
      setEmailError(false);
    } else {
      setUserNameError(true);
    }

    if (!emptyPass && !emptyConfPass && signUpPassword(password.value, confirmPassword.value)) {
      setCheckPass(true);
    } else {
      setCheckPass(false);
    }

    if (!userNameError && !emailError && checkPass) {
      setSignup(true);
    } else {
      setSignup(false);
    }

  
  };
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
              <input
                id="username"
                type="text"
                placeholder="Tên tài khoản"
              ></input>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
              <div>
                <FiMail color="white" size={24} />
              </div>
              <input id="email" type="text" placeholder="Email"></input>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input
                id="password"
                type={open ? "text" : "password"}
                placeholder="Mật khẩu"
              ></input>
              <div onClick={() => handleOpenEye()}>
                {open ? <FiEye color="white" /> : <FiEyeOff color="white" />}
              </div>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input
                id="confirm_password"
                type={open1 ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
              ></input>
              <div onClick={() => handleOpenEye1()}>
                {open1 ? <FiEye color="white" /> : <FiEyeOff color="white" />}
              </div>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Save">
              <input type="checkbox" />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Button">
              <button
                type="submit"
                onClick={() =>
                  checkSignup()
                } /*onClick={() => navigate('/login')} */
              >
                Đăng ký
              </button>
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

export default Signup;
