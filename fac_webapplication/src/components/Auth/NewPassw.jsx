import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";
//
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callAPi } from "../../services/UserService";
//
const NewPassw = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const navigate = useNavigate();
  const handleOpenEye = () => {
    setShowPassword(!showPassword)
  }
  const handleOpenEye1 = () => {
    setShowPassword1(!showPassword1)
  }

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChangNewPass = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    
  }
  const handleChangConfirmPass = (e) => {
    const newPass = e.target.value;
    setConfirmPassword(newPass);
    
  }
  const validatePassword = (password) => {
    if (password.trim() === "") {
      toast.error("Vui lòng nhập mật khẩu mới");
      return false;
    }
    return true;
  }
  
  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword.trim() === "") {
      toast.error("Vui lòng xác nhận lại mật khẩu");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không giống nhau");
      return false;
    }
    return true;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(newPassword, confirmPassword);
    if (isPasswordValid && isConfirmPasswordValid) {
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
        <form
         className="Auth_BrowserView_Region-NewPass"
         onSubmit={handleSubmit}
         >
          <div className="Auth_BrowserView_Region-NewPass_Input ">
            <div>
              <FiLock color="white" size={24} />
            </div>
            <input
             type={showPassword1 ? "text" : "password"} 
             placeholder="Mật khẩu mới"
             onChange={handleChangNewPass}
             ></input>
            <div onClick={handleOpenEye1}> 
            { showPassword1 ? <FiEye color="white"  /> : <FiEyeOff color="white"  />}
            </div>
          
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Input">
            <div>
              <FiLock color="white"size={24} />
            </div>
            <input
             type={showPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              onChange={handleChangConfirmPass}
              ></input>
            <div onClick={handleOpenEye}> 
            { showPassword ? <FiEye color="white"  /> : <FiEyeOff color="white"  />}
            </div>
            </div>
          <div className="Auth_BrowserView_Region-NewPass_Save">
            <input type="checkbox"/>
            <div>Lưu đăng nhập</div>
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Button">
            <button type="submit">Xác nhận</button>
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Stuff">
            <div onClick={() => {navigate("/login")}}>
                Đăng nhập
            </div>
            <div onClick={() => {navigate("/forgotpassword")}}>
                Quên mật khẩu
            </div>
          </div>
        </form>
        </div>
      </BrowserView>

      <MobileView>
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
        <div className="Auth_BrowserView_Region-NewPass">
          <div className="Auth_BrowserView_Region-NewPass_Input ">
            <div>
              <FiLock color="white" size={24} />
            </div>
            <input type={showPassword1 ? "text" : "password"} placeholder="Mật khẩu mới"></input>
            <div onClick={handleOpenEye1}> 
            { showPassword1 ? <FiEye color="white"  /> : <FiEyeOff color="white"  />}
            </div>
          
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Input">
            <div>
              <FiLock color="white"size={24} />
            </div>
            <input type={showPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu"></input>
            <div onClick={handleOpenEye}> 
            { showPassword ? <FiEye color="white"  /> : <FiEyeOff color="white"  />}
            </div>
            </div>
          <div className="Auth_BrowserView_Region-NewPass_Save">
            <input type="checkbox"/>
            <div>Lưu đăng nhập</div>
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Button">
            <button type="submit" onClick={handleSubmit}>Xác nhận</button>
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Stuff">
            <div onClick={() => {navigate("/login")}}>
                Đăng nhập
            </div>
            <div onClick={() => {navigate("/forgotpassword")}}>
                Quên mật khẩu
            </div>
          </div>
        </div>
        </div>
      </MobileView>
    </div>
  );
};

export default NewPassw;
