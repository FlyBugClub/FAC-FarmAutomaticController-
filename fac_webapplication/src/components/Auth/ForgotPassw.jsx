import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import "./Auth.scss";
//
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//
import { callAPi } from "../../services/UserService";
//
import { checkEmail } from "../../validation";
const ForgotPassw = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
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

          <form
            className="Auth_BrowserView_Region-Forgot"
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
            <div className="Auth_BrowserView_Region-Forgot_Button">
              <button type="submit">Gửi</button>
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

export default ForgotPassw;
