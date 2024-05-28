import { BrowserView, MobileView } from "react-device-detect";
import React from "react";
import { FiEye, FiLock, FiUser } from "react-icons/fi";
import "./Auth.scss";

const NewPassw = () => {
  return (
    <div className="Auth">
      <BrowserView className="Auth_BrowserView">
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
            <button type="submit">Xác nhận</button>
          </div>
          <div className="Auth_BrowserView_Region-NewPass_Stuff">
            <div>
                Đăng nhập
            </div>
            <div>
                Quên mật khẩu
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
