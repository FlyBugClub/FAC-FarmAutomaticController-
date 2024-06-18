import { BrowserView, MobileView } from "react-device-detect";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";
//
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { callAPi, fetchOneUser } from "../../services/UserService";
import { AuthContext } from "../Context/AuthContext";
const Login = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { URL, login, user, authDispatch } = useContext(AuthContext);
  const handleOpenEye = () => {
    setOpen(!open);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const validateUsername = (username) => {
    if (username.trim() === "") {
      toast.error("Tên đăng nhập không được để trống");
      return false;
    }
    return true;
  };
  const validatePassword = (password) => {
    if (password.trim() === "") {
      toast.error("Mật khẩu không được để trống");
      return false;
    }
    return true;
  };
  const handleChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };
  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };
  const [checkSavePassword, setCheckSavePassword] = useState(false);
  const handleCheckboxClick = (e) => {
    const checkBox = e.target.checked;
    setCheckSavePassword(checkBox);
  };
  const handleEditUser = async () => {
    // const checkApi = async () => {
    //   let body = [
    //     "1", // id
    //     "new.email@example.com", // gmail
    //     "1234", //pass
    //     "123456789", //phone
    //     "Premium", //member
    //   ];
    //   let res = await callAPi(
    //     "post",
    //     `${state.URL}/auth/editUser`,
    //     body
    //   );
    //   console.log(res);
    //   if (res.data) {
    //     console.log(res.data);
    //     alert("sua thanh cong");
    //   } else {
    //     alert("sua khong thanh cong");
    //   }
    // };
    // checkApi();
    console.log(login.status);
    console.log(user.id_user_)
  };
  const sendToken = (check) => {
    if (check) {
      localStorage.setItem("token", JSON.stringify(true));
    } else {
      sessionStorage.setItem("token", JSON.stringify(true));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    if (isUsernameValid && isPasswordValid) {
      const checkApi = async () => {
        let body = {
          username: username,
          password: password,
        };
        let res = await callAPi("post", `${URL}/auth/checkValidUser`, body);
        // console.log(res.data[0].status_);
        console.log(res.data[0]);
        if (res.data[0].status_ === 200) {
          if (checkSavePassword) {
            sendToken(checkSavePassword);
            authDispatch({
              type: "SET_LOGIN",
              payload: { status: true, isSave: checkSavePassword },
            });
            authDispatch({
              type: "SET_USER",
              payload: res.data[0],
            })
            // loginContext.login(checkSavePassword);
            console.log(login);
          } else {
            sendToken(checkSavePassword);
            authDispatch({
              type: "SET_USER",
              payload: res.data[0],
            }) 
            authDispatch({
              type: "SET_LOGIN",
              payload: { status: true, isSave: checkSavePassword },
            });
            console.log(login);
          }
        } else {
          alert("Khong tim thay nguoi dung");
        }
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

          <form
            className="Auth_BrowserView_Region-Login"
            onSubmit={handleSubmit}
          >
            <div className="Auth_BrowserView_Region-Login_Input">
              <div>
                <FiUser color="white" size={24} />
              </div>
              <input
                id="username"
                type="text"
                placeholder="Tên tài khoản"
                value={username}
                onChange={handleChangeUsername}
              />
            </div>
            <div className="Auth_BrowserView_Region-Login_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input
                id="password"
                type={open ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={handleChangePassword}
              />
              <div onClick={handleOpenEye}>
                {open ? <FiEye color="white" /> : <FiEyeOff color="white" />}
              </div>
            </div>
            <div className="Auth_BrowserView_Region-Login_Save">
              <input type="checkbox" onClick={handleCheckboxClick} />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_BrowserView_Region-Login_Button">
              <button type="submit">Đăng nhập</button>
            </div>
            <div className="Auth_BrowserView_Region-Login_Stuff">
              <div onClick={() => navigate("/signup")}>Đăng ký tài khoản</div>
              <div onClick={() => navigate("/forgotpassword")}>
                Quên mật khẩu
              </div>
              <div onClick={handleEditUser}>edit</div>
            </div>
          </form>
        </div>
      </BrowserView>

      <MobileView className="Auth_MobileView">
        <div style={{ width: "100%", height: "100%" }}>
          <div className="Auth_MobileView_Logo">
            <div className="Auth_MobileView_Logo_Image">
              <img src="/icons/Bug(Trắng).png" alt="" />
            </div>
            <div>
              <div className="div1">Tưới tiêu tự động</div>
              <div className="div2">Giải pháp hoàn hảo cho nhà nông</div>
            </div>
          </div>

          <form className="Auth_MobileView_Region" onSubmit={handleSubmit}>
            <div className="Auth_MobileView_Region_Input">
              <div>
                <FiUser color="white" size={24} />
              </div>
              <input
                id="username"
                type="text"
                placeholder="Tên tài khoản"
                value={username}
                onChange={handleChangeUsername}
              />
            </div>
            <div className="Auth_MobileView_Region_Input">
              <div>
                <FiLock color="white" size={24} />
              </div>
              <input
                id="password"
                type={open ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={handleChangePassword}
              />
              <div onClick={handleOpenEye}>
                {open ? <FiEye color="white" /> : <FiEyeOff color="white" />}
              </div>
            </div>
            <div className="Auth_MobileView_Region_Save">
              <input type="checkbox" onClick={handleCheckboxClick} />
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_MobileView_Region_Button">
              <button type="submit">Đăng nhập</button>
            </div>
            <div className="Auth_MobileView_Region_Stuff">
              <div onClick={() => navigate("/signup")}>Đăng ký tài khoản</div>
              <div onClick={() => navigate("/forgotpassword")}>
                Quên mật khẩu
              </div>
            </div>
          </form>
        </div>
      </MobileView>
    </div>
  );
};

export default Login;
