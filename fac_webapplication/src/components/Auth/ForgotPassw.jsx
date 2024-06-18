import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { FiMail } from "react-icons/fi";
import "./Auth.scss";
//
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { callAPi } from "../../services/UserService";
//
import { checkEmail } from "../../validation";
import { CiBarcode } from "react-icons/ci";
import {HandleLoginContext} from "../Context/HandleLoginContext";
const ForgotPassw = () => {
  const loginContext = useContext(HandleLoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [checkOTP, setCheckOTP] = useState("");
  const validateEmail = (email) => {
    if (email.trim() === "") {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!checkEmail(email)) {
      toast.error("Vui lòng nhập email đúng định dạng");
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
      const checkApi = async () => {
        let res = await callAPi(
          "post",
          `${loginContext.apiURL}/auth/request-otp`,
          {
            email: email,
          }
        );
        setCheckOTP(res.data);
        console.log(res);
      };
      checkApi();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      const checkApi = async () => {
        let res = await callAPi(
          "post",
          `${loginContext.apiURL}/auth/request-otp`,
          {
            email: email,
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

          <form
            className="Auth_BrowserView_Region-Forgot"style={{height: "auto"}}
            onSubmit={handleSubmit}
          >
            <div className="Auth_BrowserView_Region-Forgot_Input ">
              <div>
                <FiMail color="white" size={24} />
              </div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleChangEmail}
              ></input>
            </div>

            <div className="Auth_BrowserView_Region-Forgot_Input ">
              <div>
                <CiBarcode  color="white" size={24} />
              </div>
              <input
                type="text"
                placeholder="OTP"
                value={OTP}
                onChange={handleChangOTP}
              ></input>
            </div>
            <div  onClick={handleSendOtp} className="Auth_BrowserView_Region-Forgot_Otp">
            <button>Gửi mã otp</button>
            </div>
           
            <div className="Auth_BrowserView_Region-Forgot_Button">
              <button type="submit">Tiếp theo</button>
            </div>
          </form>
        </div>
      </BrowserView>

      <MobileView className="Auth_MobileView">
        <div style={{width: "100%", height: "100%"}}>
          <div className="Auth_MobileView_Logo">
            <div className="Auth_MobileView_Logo_Image">
              <img src="/icons/Bug(Trắng).png" alt="" />
            </div>
            <div>
              <div className="div1">Tưới tiêu tự động</div>
              <div className="div2">Giải pháp hoàn hảo cho nhà nông</div>
            </div>
          </div>

          <form
            className="Auth_MobileView_Region"
            onSubmit={handleSubmit}
          >
            <div className="Auth_MobileView_Region_Input ">
              <div>
                <FiMail color="white" size={24} />
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
