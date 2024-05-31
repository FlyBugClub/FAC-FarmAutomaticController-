import { BrowserView, MobileView } from "react-device-detect";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";
import { motion } from "framer-motion";
import { loginUserName, loginPassword } from "../../validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpenEye = () => {
    setOpen(!open);
  };

  const notify = () => toast.success("Thông báo thành công!");
  const [userNameError, setUserNameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [emptyName, setEmptyName] = useState(null);
  const [emptyPass, setEmptyPass] = useState(null);
  const [login, setLogin] = useState(null);

  const data = {
    username1: "admin",
    password: "admin",
  };
  const checkLogin = () => {
    setCount(count + 1);
    const data = {
      username1: "admin",
      password: "admin",
    };
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    if (username.value.trim() === "") {
      console.log("Username is empty");
      setEmptyName(true);
    } else {
      setEmptyName(false);
    }

    if (password.value.trim() === "") {
      console.log("Password is empty");
      setEmptyPass(true);
    } else {
      setEmptyPass(false);
    }

    if (!loginUserName(username.value, data.username1)) {
      console.log("username false");
      setUserNameError(true);
    } else {
      setUserNameError(false);
    }

    if (!loginPassword(password.value, data.password)) {
      console.log("password false");
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    setLogin(true);
  };
  const [count, setCount] = useState(0);
  useEffect(() => {
    
  },[])
  useEffect(() => {
    if (count === 0){
      setEmptyPass(null);
      setEmptyName(null);
      setPasswordError(null);
      setUserNameError(null);
    }else{
      if (emptyName) {
        toast.error("Tên đăng nhập không được để trống");
      }
      if (emptyPass) {
        toast.error("Mật khẩu không được để trống");
      }
      if (!emptyName && userNameError) {
        toast.error("Tên đăng nhập không hợp lệ");
      }
  
      if (!passwordError && userNameError && !emptyName && !emptyPass) {
        toast.success("Tên đăng nhập hoặc mật khẩu không đúng");
      }
      if (passwordError && !userNameError && !emptyName && !emptyPass) {
        toast.success("Tên đăng nhập hoặc mật khẩu không đúng");
      }
      if (!passwordError && !userNameError && !emptyName && !emptyPass) {
        toast.success("Đăng nhập thành công");
      }
      console.log(count);
    }

  }, [count]);

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
              <input
                id="username"
                type="text"
                placeholder="Tên tài khoản"
              ></input>
            </div>
            <div className="Auth_BrowserView_Region-Login_Input">
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
            <div className="Auth_BrowserView_Region-Login_Save">
              <input type="checkbox" />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_BrowserView_Region-Login_Button">
              <button type="submit" onClick={() => checkLogin()}>
                {login ? "Đăng nhận" : "Sai tài khoản hoặc mật khẩu"}
              </button>
            </div>
            <div className="Auth_BrowserView_Region-Login_Stuff">
              <div onClick={() => navigate("/signup")}>Đăng ký tài khoản</div>
              <div onClick={() => navigate("/forgotpassword")}>
                Quên mật khẩu
              </div>
            </div>
          </div>
        </div>
      </BrowserView>

      <MobileView className="Auth_MobileView">
        <div>
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
              <input
                id="username"
                type="text"
                placeholder="Tên tài khoản"
              ></input>
            </div>
            <div className="Auth_MobileView_Region-Login_Input">
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
            <div className="Auth_MobileView_Region-Login_Save">
              <input type="checkbox" />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_MobileView_Region-Login_Button">
              <button type="submit" onClick={() => checkLogin()}>
                Đăng nhập
              </button>
            </div>
            <div className="Auth_MobileView_Region-Login_Stuff">
              <div onClick={() => navigate("/signup")}>Đăng ký tài khoản</div>
              <div onClick={() => navigate("/forgotpassword")}>
                Quên mật khẩu
              </div>
            </div>
          </div>
        </div>
      </MobileView>
    </div>
  );
};

export default Login;
