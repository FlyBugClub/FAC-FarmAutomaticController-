import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import {FiMail} from "react-icons/fi";
import "./Auth.scss";
//
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { callAPi } from "../../services/UserService";
//
import { checkEmail, checkOTP } from "../../validation";
import { CiBarcode } from "react-icons/ci";
//
import { AuthContext } from "../Context/AuthContext";
const ForgotPassw = () => {
  const { URL, login, user, authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [errorEmail, setErrorEmail] = useState("")
  const [errorOtp, setErrorOtp] = useState("")

  const validateEmail = (email) => {
    if (email.trim() === "") {
      setErrorEmail("Vui lòng nhập email");
      return false;
    }
    if (!checkEmail(email)) {
      setErrorEmail("Vui lòng nhập email đúng định dạng");
      return false;
    }
    return true;
  };
  const validateOtp = (otp) => {
    if (otp.trim() === "") {
      setErrorOtp("Vui lòng nhập OTP")
      return false;
    }
    if (!checkOTP(otp)) {
      setErrorOtp("Vui lòng nhập OTP có 6 số")
      return false;
    }
    return true;
  };
  const handleChangEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };
  const handleChangOTP = (e) => {
    const newOTP = e.target.value;
    setOTP(newOTP);
  };
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    if (isEmailValid) {
      setErrorEmail("")
      const checkApi = async () => {
        let res = await callAPi("post", `${URL}/auth/request-otp`, {
          email: email,
        });
        if (res.status) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      };
      checkApi();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isOTPValid = validateOtp(otp);
    if (isEmailValid && isOTPValid) {
      setErrorOtp("")
      setErrorEmail("")
      console.log(email);
      console.log(otp);
      const checkApi = async () => {
        let res = await callAPi("post", `${URL}/auth/verify-otp`, {
          email: email,
          otp: otp,
        });

        console.log(res);
        if (res.status) {
          navigate("/newpassw", { state: { email: email } });
        } else {
          toast.error(res.message);
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
              <div>Confirm Email</div>
            </div>
            <div className="Auth_BrowserView_Container_Form_Body">
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div className={`Auth_BrowserView_Container_Form_Body_Item_Content ${errorEmail ? 'Error' : ''}`}>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Input">
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={handleChangEmail}
                    />
                  </div>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Icon">
                    <FiMail color={errorEmail ? 'red' : 'white'} size={24}/>
                  </div>
                </div>
                <div className="Auth_BrowserView_Container_Form_Body_Item_Validate">
                  {errorEmail}
                </div>
              </div>
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div className={`Auth_BrowserView_Container_Form_Body_Item_Content ${errorOtp ? 'Error' : ''}`}>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Input">
                    <input
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={handleChangOTP}
                    />
                  </div>
                  <div className="Auth_BrowserView_Container_Form_Body_Item_Content_Icon">
                    <CiBarcode color={errorOtp ? 'red' : 'white'} size={24}/>
                  </div>
                </div>
                <div className="Auth_BrowserView_Container_Form_Body_Item_Validate">{errorOtp}</div>
              </div>
              <div className="Auth_BrowserView_Container_Form_Body_Item">
                <div onClick={handleSendOtp} className="Auth_BrowserView_Container_Form_Body_Item_OTP">
                  Send OTP
                </div>
              </div>
            </div>
            <div className="Auth_BrowserView_Container_Form_Footer">
              <button onClick={(e) => handleSubmit(e)}>
                Xác nhận
              </button>
              <div className="Auth_BrowserView_Container_Form_Footer_Choice">
                <div onClick={() => navigate('/login')}>Quay lại trang đăng nhập.</div>
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
                <FiMail color="white" size={24}/>
              </div>
              <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={handleChangEmail}
              ></input>
            </div>
            <div className="Auth_MobileView_Region_Button">
              <button type="submit">Gửi</button>
            </div>
          </form>
        </div>
      </MobileView>
    </div>
  );
};

export default ForgotPassw;
