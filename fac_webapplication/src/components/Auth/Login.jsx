import { BrowserView, MobileView } from "react-device-detect";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";
//
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { callAPi } from "../../services/UserService";
import { AuthContext } from "../Context/AuthContext";
const Login = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { URL, authDispatch } = useContext(AuthContext);
  const handleOpenEye = () => {
    setOpen(!open);
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const validateUsername = (username) => {
    if (username.trim() === "") {
      setUsernameErr("Tên đăng nhập không được để trống");
      return false;
    }
    return true;
  };
  const validatePassword = (password) => {
    if (password.trim() === "") {
      setPasswordErr("Mật khẩu không được để trống");
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
  // const handleEditUser = async () => {
  //   // const checkApi = async () => {
  //   //   let body = [
  //   //     "1", // id
  //   //     "new.email@example.com", // gmail
  //   //     "1234", //pass
  //   //     "123456789", //phone
  //   //     "Premium", //member
  //   //   ];
  //   //   let res = await callAPi(
  //   //     "post",
  //   //     `${state.URL}/auth/editUser`,
  //   //     body
  //   //   );
  //   //   console.log(res);
  //   //   if (res.data) {
  //   //     console.log(res.data);
  //   //     alert("sua thanh cong");
  //   //   } else {
  //   //     alert("sua khong thanh cong");
  //   //   }
  //   // };
  //   // checkApi();
  //   console.log(login.status);
  //   console.log(user.id_user_);
  // };
  const sendToken = (check, token) => {
    if (check) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    if (isUsernameValid && isPasswordValid) {
      setUsernameErr("");
      setPasswordErr("");
      const checkApi = async () => {
        let body = {
          username: username,
          password: password,
        };
        let res = await callAPi("post", `${URL}/auth/checkValidUser`, body);
        // console.log(res.data[0].status_);
        console.log(res.data[0]);
        // console.log(res);
        // console.log(res.asscessToken)
        let token = res.asscessToken;
        if (res.data[0].status_ === 200) {
          console.log("dang nhap thanh cong");
          sendToken(checkSavePassword, token);
          authDispatch({
            type: "SET_LOGIN",
            payload: { status: true },
          });
          authDispatch({
            type: "SET_USER",
            payload: res.data[0],
          });
        } else {
          console.log("Tên đăng nhập hoặc mật khẩu không tồn tại");
          toast.error("Tên đăng nhập hoặc mật khẩu không tồn tại");
        }
      };
      checkApi();
    } else {
      console.log("Khong tim thay nguoi dung");
    }
  };

  return (
    <div className="Auth">
      <BrowserView className="Auth_BrowserView">
      <div>
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
        </div>

        <div className="Auth_BrowserView_Container">
          <div className="Auth_BrowserView_Container_Form">
            <div className="Auth_BrowserView_Container_Form_Header">
              <div>Đăng nhập</div>
            </div>
            <div className="Auth_BrowserView_Container_Form_Body">
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div
                  className={`Auth_BrowserView_Container_Form_Body_Item_Content ${
                    usernameErr ? "Error" : ""
                  }`}
                >
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Input">
                    <input
                      id="username"
                      type="text"
                      placeholder="Tên tài khoản"
                      value={username}
                      onChange={handleChangeUsername}
                    />
                  </div>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Icon">
                    <FiUser color={usernameErr ? "red" : "white"} size={24} />
                  </div>
                </div>
                <div className="Auth_BrowserView_Container_Form_Body_Item_Validate">
                  {usernameErr}
                </div>
              </div>
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div
                  className={`Auth_BrowserView_Container_Form_Body_Item_Content ${
                    passwordErr ? "Error" : ""
                  }`}
                >
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Input">
                    <input
                      id="password"
                      type={open ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={handleChangePassword}
                    />
                  </div>
                  <div
                    onClick={() => setOpen(!open)}
                    className="Auth_BrowserView_Container_Form_Body_Item_Content_IconEye"
                  >
                    {open ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </div>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Icon">
                    <FiLock color={usernameErr ? "red" : "white"} size={24} />
                  </div>
                </div>
                <div className="Auth_BrowserView_Container_Form_Body_Item_Validate">
                  {passwordErr}
                </div>
              </div>
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div className="Auth_BrowserView_Container_Form_Body_Item_Choice">
                  <div>
                    <input type="checkbox" />
                    <div>Nhớ mật khẩu</div>
                  </div>
                  <div onClick={() => navigate("/forgotpassword")}>
                    Quên mật khẩu?
                  </div>
                </div>
              </div>
            </div>
            <div className="Auth_BrowserView_Container_Form_Footer">
              <button onClick={handleSubmit}>Đăng nhập</button>
              <div className="Auth_BrowserView_Container_Form_Footer_Choice">
                <div onClick={() => navigate("/signup")}>
                  Bạn chưa có tài khoản?
                </div>
                <div onClick={() => navigate("/signup")}>Đăng ký</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </BrowserView>

      <MobileView className="Auth_MobileView">
        <div style={{ width: "100%", height: "100%" }}>
          <div className="Auth_MobileView_BGTop">
            <div className="Auth_MobileView_BGTop_Bg">
              {/* <img src="/images/Rectangle01.png" alt="" /> */}
              <svg
                class="wave"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
              >
                <path
                  fill="#fff"
                  fill-opacity="1"
                  d="M0,64L40,69.3C80,75,160,85,240,101.3C320,117,400,139,480,133.3C560,128,640,96,720,96C800,96,880,128,960,133.3C1040,139,1120,117,1200,106.7C1280,96,1360,96,1400,96L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="Auth_MobileView_Title">
            <h1>Welcom Back</h1>
            <p>Login to your accout</p>
          </div>
          <form className="Auth_MobileView_Region" onSubmit={handleSubmit}>
            <div className="Auth_MobileView_Region_LoginArea">
              <div className="Auth_MobileView_Region_LoginArea_Input">
                <div>
                  <FiUser color="#2D642C" size={24} />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Tên tài khoản"
                  value={username}
                  onChange={handleChangeUsername}
                />
              </div>
              <div className="Auth_MobileView_Region_LoginArea_Input">
                <div>
                  <FiLock color="#2D642C" size={24} />
                </div>
                <input
                  id="password"
                  type={open ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={handleChangePassword}
                />
                <div
                  className="Auth_MobileView_Region_Input_Eye"
                  onClick={handleOpenEye}
                >
                  {open ? (
                    <FiEye color="#2D642C" size={20} />
                  ) : (
                    <FiEyeOff color="#2D642C" size={20} />
                  )}
                </div>
              </div>
              <div className="Auth_MobileView_Region_LoginArea_FeatureArea">
                <div className="Auth_MobileView_Region_LoginArea_FeatureArea_Save">
                  <input type="checkbox" onClick={handleCheckboxClick} />
                  <div>Lưu đăng nhập</div>
                </div>
                <div
                  className="Auth_MobileView_Region_LoginArea_FeatureArea_ForgetPassword"
                  onClick={() => navigate("/forgotpassword")}
                >
                  Quên mật khẩu?
                </div>
              </div>
            </div>

            <div className="Auth_MobileView_Region_ButtonArea">
              <div className="Auth_MobileView_Region_ButtonArea_Button">
                <button type="submit">Đăng nhập</button>
              </div>
              <div className="Auth_MobileView_Region_ButtonArea_Stuff">
                <p className="Auth_MobileView_Region_ButtonArea_Stuff_Text">
                  Bạn đã có tài khoản?
                </p>
                <div
                  className="Auth_MobileView_Region_ButtonArea_Stuff_BtnSignUp"
                  onClick={() => navigate("/signup")}
                >
                  Đăng ký
                </div>
              </div>
            </div>
          </form>
        </div>
      </MobileView>
    </div>
  );
};

export default Login;
