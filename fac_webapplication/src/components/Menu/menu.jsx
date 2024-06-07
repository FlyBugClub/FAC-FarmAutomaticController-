import React, { useEffect, useState, useContext} from "react";
import { AuthContext } from "../../AuthContext";
import { FiGrid,FiBell ,FiSettings,FiUserMinus} from "react-icons/fi";
import { WiDayCloudy } from "react-icons/wi";

import { BrowserView, MobileView } from "react-device-detect"; 
import './menu.scss'
import { useNavigate } from "react-router-dom";
const Menu = ({ handleWeather,weatherState }) => {
    const navigate = useNavigate();
    const [menuState,setMenuState] = useState("dashboard")
    const [userState,setUserState] = useState("")

    const context = useContext(AuthContext);
    const handleLogout = () => {
        context.logout();
        navigate("/");
    }
    const handleMenu = (key) => {
        if (key == userState)
        {
            setUserState("");
        }
        else
        {
            setUserState(key);
        }
        if (key != "user")
        {
            setMenuState(key);
        }
        
        
    }
    return (
        <div className="Fac_Menu">
            <BrowserView className="Fac_Menu_Web">
                <div className="Fac_Menu_Web_Container">
                    <img  className="Fac_Menu_Web_Container_Logo" src="/icons/Bug(Trắng).png" alt="" />
                    <div className="Fac_Menu_Web_Container_Menu">
                        <div className="Fac_Menu_Web_Container_Menu_Elements" onClick={()=>handleWeather()} style={ weatherState ? {backgroundColor:"rgba(200, 200, 200, 0.3)",borderRadius:"50%"} : {}}>
                            <WiDayCloudy className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={35}/>

                        </div>
                        <div className="Fac_Menu_Web_Container_Menu_Elements" onClick={()=>(handleMenu("dashboard"),navigate("/home/dashboard"))} style={ menuState == "dashboard" ? {backgroundColor:"rgba(200, 200, 200, 0.3)",borderRadius:"50%"} : {}}>
                            <FiGrid className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={25} />

                        </div>
                        <div className="Fac_Menu_Web_Container_Menu_Elements" onClick={()=>handleMenu("Notification")} style={ menuState == "Notification" ? {backgroundColor:"rgba(200, 200, 200, 0.3)",borderRadius:"50%"} : {}}>
                            <FiSettings className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={25}/>

                        </div>
                        <div className="Fac_Menu_Web_Container_Menu_Elements" onClick={()=>handleMenu("Settings")} style={ menuState == "Settings" ? {backgroundColor:"rgba(200, 200, 200, 0.3)",borderRadius:"50%"} : {}}>
                            <FiBell className="Fac_Menu_Web_Container_Menu_Elements_Icon" size={25}/>

                        </div>

                    </div>
                    <div style={{position:"relative"}}>
                        <img className="Fac_Menu_Web_Container_Avartar" src="/icons/user.png" alt="" onClick={()=>handleMenu("user")}/>
                        {userState === "user" ?
                        <div className="Fac_Menu_Web_Container_Dropbox">
                            <div className="Fac_Menu_Web_Container_Dropbox_Header">
                                <img className="Fac_Menu_Web_Container_Dropbox_Header_Avatar"src="/icons/user.png" alt=""/>

                                <div className="Fac_Menu_Web_Container_Dropbox_Header_Info">
                                    User name
                                    <div style={{fontSize:"12px",fontWeight:"400"}}>cuong.dq12897@sinhvien.hoasen.edu.vn</div>
                                </div>
                                
                            </div>
                            <div className="Fac_Menu_Web_Container_Dropbox_Options">
                                <FiSettings style={{marginRight:"10px"}}/>
                                Account
                            </div>
                            <div onClick={handleLogout} className="Fac_Menu_Web_Container_Dropbox_Options">
                            <FiUserMinus  style={{marginRight:"10px"}}/>
                                Log out
                            </div>

                        </div> :
                        <></>
                        }
                        
                    </div>
                    
                </div>
            </BrowserView>

            <MobileView>
                <h1>This is rendered only on mobile</h1>
            </MobileView>
        </div>
    )
}
export default Menu