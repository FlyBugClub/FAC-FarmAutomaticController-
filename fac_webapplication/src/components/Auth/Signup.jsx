import { BrowserView, MobileView } from "react-device-detect";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import "./Auth.scss";
//
import { signUpPassword, checkUserName, checkEmail } from "../../validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callAPi, host } from '../../services/UserService';

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
  const [username , setUsername] = useState('');
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [rePassword , setRePassword] = useState('');


  const handleChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  }
  const validateUsername = (username) => {
    if (username.trim() === "") {
      toast.error("Vui lòng nhập tên đăng nhập");
      return false;
    }
    return true;
  }
 const handleChangeEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  }
  const validateEmail = (email) => {
    if (email.trim() === "") {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!checkEmail(email)) {
      toast.error("Vui lòng nhập đúng định dạng email");
      return false;
    }
    return true;
  }
  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  }
  const validatePassword = (password) => {
    if (password.trim() === "") {
      toast.error("Vui lòng nhập mật khẩu");
      return false;
    }
    return true;
  }
  const handleChangeRePassword = (e) => {
    const newRePassword = e.target.value;
    setRePassword(newRePassword);
  }
  const validateRePassword = (password, rePassword) => {
    if (rePassword.trim() === "") {
      toast.error("Vui lòng xác nhận mật khẩu");
      return false;
    }
    if (password !== rePassword) {
      toast.error("Vui lòng xác nhận đúng mật khẩu");
      return false;
    }
    return true;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isRePasswordValid = validateRePassword(password, rePassword);
    if (isUsernameValid && isEmailValid && isPasswordValid && isRePasswordValid) {
      const checkApi = async () => {
        let res = await callAPi(
          "post",
          `http://61.28.230.132:3004/auth/Login`,
          {
            username: "ndtt",
            password: "abc123",
          }
        );

        console.log(res);
      };
      checkApi();
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
          <form className="Auth_BrowserView_Region-Signup"
            onSubmit={handleSubmit}>
            <div className="Auth_BrowserView_Region-Signup_Input ">
              <div>
                <FiUser color="white" size={24} />
              </div>
              <input
                id="username"
                type="text"
                placeholder="Tên tài khoản"
                onChange={handleChangeUsername}
              ></input>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
              <div>
                <FiMail color="white" size={24} />
              </div>
              <input id="email"
               type="text"
                placeholder="Email"
                onChange={handleChangeEmail}
                ></input>
            </div>
            <div className="Auth_BrowserView_Region-Signup_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input
                id="password"
                type={open ? "text" : "password"}
                placeholder="Mật khẩu"
                onChange={handleChangePassword}
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
                onChange={handleChangeRePassword}
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
                
                 /*onClick={() => navigate('/login')} */
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </BrowserView>

      <MobileView>
        <h1>This is rendered only on mobile</h1>
      </MobileView>
    </div>
  );
};

export default Signup;
