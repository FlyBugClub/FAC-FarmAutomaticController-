import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import "./Auth.scss";
//
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callAPi } from "../../services/UserService";
//
import { useLocation } from "react-router-dom";
//
import { AuthContext } from "../Context/AuthContext";
const NewPassw = () => {
  const { URL} = useContext(AuthContext);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [errorPass1, setErrorPass1] = useState("");
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const navigate = useNavigate();
  const handleOpenEye = () => {
    setShowPassword(!showPassword);

  };
  const handleOpenEye1 = () => {
    setShowPassword1(!showPassword1);
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChangNewPass = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
  };
  const handleChangConfirmPass = (e) => {
    const newPass = e.target.value;
    setConfirmPassword(newPass);
  };
  const validatePassword = (password) => {
    if (password.trim() === "") {
      setErrorPass("Vui lòng nhập mật khẩu mới");
      return false;
    }
    else{
      setErrorPass("");
      return true;
    }
   
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword.trim() === "") {
      setErrorPass1("Vui lòng xác nhận lại mật khẩu");
      return false;
    } else if (password !== confirmPassword) {
      setErrorPass1("Mật khẩu không giống nhau");
      return false;
    }else
    {
      setErrorPass1("");
      return true;
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(
      newPassword,
      confirmPassword
    );
    if (isPasswordValid && isConfirmPasswordValid) {
      setErrorPass("");
      setErrorPass1("");
      const checkApi = async () => {
        let body = [
          `${email}`, // email
          `${newPassword}`, // new password
        ];
        let res = await callAPi("post", `${URL}/auth/change-password`,body)

        // console.log(res);
        if (res.status) {
          toast.success(res.message);
          navigate("/login");
        }
      };
      checkApi();
    }
  };

  return (
    <div className="Auth">
      <BrowserView className="Auth_BrowserView">
        <div className="Auth_BrowserView_Container">
          <div className="Auth_BrowserView_Container_Form">
            <div className="Auth_BrowserView_Container_Form_Header">
              <div>Reset Password</div>
            </div>
            <div className="Auth_BrowserView_Container_Form_Body">
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div className={`Auth_BrowserView_Container_Form_Body_Item_Content ${errorPass ? "Error" : ""}`}>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Input">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu mới"
                        onChange={handleChangNewPass}
                    />
                  </div>
                  <div onClick={handleOpenEye}
                       className="Auth_BrowserView_Container_Form_Body_Item_Content_IconEye">
                    {showPassword ? <FiEyeOff size={20}/> :
                        <FiEye size={20}/>}
                  </div>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Icon">
                    <FiLock color={errorPass ? "red" : "white"} size={24}/>
                  </div>
                </div>
                <div className="Auth_BrowserView_Container_Form_Body_Item_Validate">
                  {errorPass}
                </div>
              </div>
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div className={`Auth_BrowserView_Container_Form_Body_Item_Content ${errorPass1 ? "Error" : ""}`}>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Input">
                    <input
                        type={showPassword1 ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        onChange={handleChangConfirmPass}
                    />
                  </div>
                  <div onClick={handleOpenEye1}
                       className="Auth_BrowserView_Container_Form_Body_Item_Content_IconEye">
                    {showPassword1 ? <FiEyeOff size={20}/> :
                        <FiEye size={20}/>}
                  </div>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Icon">
                    <FiLock color={errorPass1 ? "red" : "white"} size={24}/>
                  </div>
                </div>
                <div className="Auth_BrowserView_Container_Form_Body_Item_Validate">
                  {errorPass1}
                </div>
              </div>
            </div>
            <div className="Auth_BrowserView_Container_Form_Footer">
            <button onClick={() => handleSubmit()}>
                Xác nhận
              </button>
              <div className="Auth_BrowserView_Container_Form_Footer_Choice">
                <div onClick={()=>navigate("/login")}>Quay lại trang đăng nhập.</div>
              </div>
            </div>
          </div>
        </div>
      </BrowserView>

      <MobileView className="Auth_MobileView">
        <div style={{width: "100%", height: "100%"}}>
          <div className="Auth_MobileView_Logo">
            <div className="Auth_MobileView_Logo_Image">
              <img src="/icons/Bug(Trắng).png" alt=""/>
            </div>
            <div>
              <div className="div1">Tưới tiêu tự động</div>
              <div className="div2">Giải pháp hoàn hảo cho nhà nông</div>
            </div>
          </div>
          <form className="Auth_MobileView_Region" onSubmit={handleSubmit}>
            <div className="Auth_MobileView_Region_Input ">
              <div>
                <FiLock color="white" size={24}/>
              </div>
              <input
                  type={showPassword1 ? "text" : "password"}
                  placeholder="Mật khẩu mới"
                  onChange={handleChangNewPass}
              ></input>
              <div onClick={handleOpenEye1}>
                {showPassword1 ? (
                    <FiEye color="white"/>
                ) : (
                    <FiEyeOff color="white"/>
                )}
              </div>
            </div>
            <div className="Auth_MobileView_Region_Input">
              <div>
                <FiLock color="white" size={24}/>
              </div>
              <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  onChange={handleChangConfirmPass}
              ></input>
              <div onClick={handleOpenEye}>
                {showPassword ? (
                    <FiEye color="white"/>
                ) : (
                    <FiEyeOff color="white"/>
                )}
              </div>
            </div>
            <div className="Auth_MobileView_Region_Save">
              <input type="checkbox"/>
              <div>Lưu đăng nhập</div>
            </div>
            <div className="Auth_MobileView_Region_Button">
              <button type="submit">Xác nhận</button>
            </div>
            <div className="Auth_MobileView_Region_Stuff">
              <div
                  onClick={() => {
                    navigate("/login");
                  }}
              >
                Đăng nhập
              </div>
              <div
                  onClick={() => {
                    navigate("/forgotpassword");
                  }}
              >
                Quên mật khẩu
              </div>
            </div>
          </form>
        </div>
      </MobileView>
    </div>
  );
};

export default NewPassw;
