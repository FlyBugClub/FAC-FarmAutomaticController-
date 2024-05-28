import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from 'react-router-dom';
import React from "react";
import { FiEye, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";

const NewPassw = () => {
  const navigate = useNavigate();

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
        <div className="Auth_BrowserView_Region-NewPass">
          <div className="Auth_BrowserView_Region-NewPass_Input ">
            <div>
              <FiLock color="white" size={24} />
            </div>
            <input type="text" placeholder="Mật khẩu mới"></input>
          
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Input">
            <div>
              <FiLock color="white"size={24} />
            </div>
            <input type="text" placeholder="Xác nhận mật khẩu"></input>
            <div><FiEye  color="white"/></div>
            </div>
          <div className="Auth_BrowserView_Region-NewPass_Save">
            <input type="checkbox"/>
            <div>Lưu đăng nhập</div>
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Button">
            <button type="submit" onClick={() => navigate("/login")}>Xác nhận</button>
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
      </BrowserView>

      <MobileView>
        <h1>This is rendered only on mobile</h1>
      </MobileView>
    </div>
  );
};

export default NewPassw;
