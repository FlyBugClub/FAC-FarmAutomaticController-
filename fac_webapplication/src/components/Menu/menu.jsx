import React, { useEffect, useState, PureComponent } from "react";
import { FiGrid,FiUserMinus ,FiSettings} from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";

import './menu.scss'
const Menu = () => {

    return (
        <div className="Fac_Menu">
            <div className="Fac_Menu_User">
                <img className="Fac_Menu_User_Avartar" src="./images/user.png" alt=""/>
                <div className="Fac_Menu_User_Name" >User name</div>
            </div>
            <div className="Fac_Menu_Options">
                <div className="Fac_Menu_Options_Elements">
                <FiGrid size={22}/>
                    <div style={{marginLeft:"10px"}}>Dashboard</div>
                </div>
                <div className="Fac_Menu_Options_Elements">
                <IoNotifications size={22}/>
                    <div style={{marginLeft:"10px"}}>Notification</div>
                </div>
                <div className="Fac_Menu_Options_Elements">
                <FiSettings size={22}/>
                    <div style={{marginLeft:"10px"}}>Setting</div>
                </div>
                <div className="Fac_Menu_Options_Elements">
                <FiUserMinus size={22}/>
                    <div style={{marginLeft:"10px"}}>Logout</div>
                </div>
            </div>

        </div>
    )
}
export default Menu