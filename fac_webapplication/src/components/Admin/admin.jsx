import React,{useEffect, useState} from "react";
import "./admin.scss"
import { BrowserView, MobileView } from "react-device-detect";
import { BsQrCode } from "react-icons/bs";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { PiPokerChipLight } from "react-icons/pi";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import"./qrcode.jsx"
import Qrcode from "./qrcode.jsx";


const Adminpage = () => {
    const [deviceMenuState,setDeviceMenuState] = useState(false)
    const [menuState,setMenuState] = useState(1)
   
    const handleMenuState = (state)=>{
        console.log("Menu State",state);
        setMenuState(state);
    }
    const handleDeviceMenuState=()=>{
        setDeviceMenuState(!deviceMenuState  );
    }
   

    const handleFacWebAdminView = ()=>{
        console.log("Menu State",menuState);
        switch(menuState){
            case 1:
                console.log("Create Qr Code");
                return <Qrcode/>
            case 2:
                console.log("Esp");
                return <Qrcode/>
            case 3:
                console.log("Equipment");
                return <Qrcode/>
            default:
                return ;
        }
    }


   


    return (
        <div className="Fac_Admin">
            <BrowserView className="Fac_Admin_Web">
                <div className="Fac_Admin_Web_Menu">
                    <div className="Fac_Admin_Web_Menu_Items" onClick={()=>{handleMenuState(1)}}>
                        <BsQrCode className="Icon"/>
                        Create Qr Code
                    </div>
                    <div className="Fac_Admin_Web_Menu_Items" onClick={()=>{handleDeviceMenuState()}}>
                        {deviceMenuState ? 
                            (
                                <FiChevronDown size={24} className="Icon" />
                            )
                            :
                            (
                                <FiChevronRight size={24} className="Icon"/>
                            )
                        }
                        Device
                    </div>
                    <div style={deviceMenuState?{height:"0px", margin:"0px",padding:"0px"}:{}}>
                        {deviceMenuState ? (
                            <div>
                                <div className="Fac_Admin_Web_Menu_Items Device" onClick={()=>{handleMenuState(2)}}     >
                                    <HiOutlineCpuChip style={{marginLeft:"20px"}}  size={24} className="Icon"/>
                                    Esp
                                </div>
                                <div className="Fac_Admin_Web_Menu_Items Device" onClick={()=>{handleMenuState(3)}} >
                                    <PiPokerChipLight style={{marginLeft:"20px"}} size={24} className="Icon"/>
                                    Equipment
                                </div>
                            </div>
                            ) : (<div></div>)}
                    </div>
                </div>
                {handleFacWebAdminView()}   
               

            </BrowserView>
            <MobileView>
            </MobileView>
        </div>
        
    )
}

export default Adminpage