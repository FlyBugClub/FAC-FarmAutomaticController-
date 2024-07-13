import React,{useEffect, useState} from "react";
import "./admin.scss"
import { BrowserView, MobileView } from "react-device-detect";
import { BsQrCode } from "react-icons/bs";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { PiPokerChipLight } from "react-icons/pi";
import { FiChevronRight } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";


const Adminpage = () => {
    const [deviceMenuState,setDeviceMenuState] = useState(false)

    const handleDeviceMenuState=()=>{
        setDeviceMenuState(!deviceMenuState  );
    }

    return (
        <div className="Fac_Admin">
            <BrowserView className="Fac_Admin_Web">
                <div className="Fac_Admin_Web_Menu">
                    <div className="Fac_Admin_Web_Menu_Items" >
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
                                <div className="Fac_Admin_Web_Menu_Items" style={{marginTop:"0px"}}     >
                                    <HiOutlineCpuChip style={{marginLeft:"20px"}}  size={24} className="Icon"/>
                                    Esp
                                </div>
                                <div className="Fac_Admin_Web_Menu_Items" style={{marginTop:"0px"}} >
                                    <PiPokerChipLight style={{marginLeft:"20px"}} size={24} className="Icon"/>
                                    Equipment
                                </div>
                            </div>
                            ) : (<div></div>)}
                    </div>
                </div>
                <div className="Fac_Admin_Web_Manager">
                    
                </div>
               

            </BrowserView>
            <MobileView>
            </MobileView>
        </div>
        
    )
}

export default Adminpage