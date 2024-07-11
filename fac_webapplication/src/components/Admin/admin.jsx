import React,{useEffect, useState} from "react";
import "./admin.scss"
import { BrowserView, MobileView } from "react-device-detect";
import { BsQrCode } from "react-icons/bs";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { PiPokerChipLight } from "react-icons/pi";

const Adminpage = () => {

    const [adminState, setAdminState] = useState("cuong")

    const handleQrCode = () => {
        setAdminState("Khoi")
    }

    // useEffect(() => {
    //     console.log("hehe")
    // },[adminState,])

    return (
        <div className="Fac_Admin">
            <BrowserView className="Fac_Admin_Web">
                <div className="Fac_Admin_Web_Menu">
                    <div className="Fac_Admin_Web_Menu_Items" onClick={() => handleQrCode()}>
                        <BsQrCode className="Icon" />
                        Create Qr Code
                    </div>
                    <div className="Fac_Admin_Web_Menu_Items">
                        <HiOutlineCpuChip size={24} className="Icon"/>
                        Esp
                    </div>
                    <div className="Fac_Admin_Web_Menu_Items">
                        <PiPokerChipLight size={24} className="Icon"/>
                        Equipment
                    </div>
                </div>
                <div className="Fac_Admin_Web_Manager">
                    {adminState === "cuong" && <div>cuong</div>}

                </div>

            </BrowserView>
            <MobileView>
            </MobileView>
        </div>
        
    )
}

export default Adminpage