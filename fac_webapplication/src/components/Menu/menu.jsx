import React, { useEffect, useState, PureComponent } from "react";
import { FiGrid,FiBell ,FiSettings} from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { WiDayCloudy } from "react-icons/wi";

import { BrowserView, MobileView } from "react-device-detect"; 
import './menu.scss'
const Menu = () => {

    return (
        <div className="Fac_Menu">
            {/* <div className="Fac_Menu_User">
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
                
            </div> */}
            <BrowserView className="Fac_Menu_Web">
                <div className="Fac_Menu_Web_Container">
                    <img  className="Fac_Menu_Web_Container_Logo" src="/icons/Bug(Trắng).png" alt="" />
                    <div className="Fac_Menu_Web_Container_Menu">
                        <div className="Fac_Menu_Web_Container_Menu_Elements">
                            <FiGrid className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={30} />

                        </div>
                        <div className="Fac_Menu_Web_Container_Menu_Elements">
                        <WiDayCloudy className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={40}/>

                        </div>
                        <div className="Fac_Menu_Web_Container_Menu_Elements">
                        <FiBell className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={30}/>

                        </div>
                        <div className="Fac_Menu_Web_Container_Menu_Elements">
                        <FiSettings className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={30}/>

                        </div>

                    </div>
                    
                        <img className="Fac_Menu_Web_Container_Avartar" src="./images/user.png" alt=""/>
                    
                </div>
            </BrowserView>

            <MobileView>
                <h1>This is rendered only on mobile</h1>
            </MobileView>
        </div>
    )
}
export default Menu