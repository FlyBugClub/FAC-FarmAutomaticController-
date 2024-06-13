import React, { useState, useRef, useEffect } from "react";
import './home.scss'
import { BrowserView, MobileView } from "react-device-detect";
import { MdArrowBackIosNew } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { BsQrCode } from "react-icons/bs";
import { PiPlusBold } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { hover } from "@testing-library/user-event/dist/hover";

const AddFarm = ({ weatherState,addDeviceState }) => {
    const farm = ["farm1","farm2","farm3","farm1","farm2","farm3"]
    const [qrcodeState, setQrcodeState] = useState(false)
    const [authQrState, setAuthQrState] = useState(false)
    const [farmSeleted, setFarmSelected] = useState(farm[0])
    const [farmSeletedState, setFarmSelectedState] = useState(false)
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    
    const handleButtonClick = () => {
        // fileInputRef.current.click(); // Kích hoạt hộp thoại chọn file
        setQrcodeState(true)
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // setAuthQrState(!authQrState)

    };
    return (
        <div className="Fac_Home">
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }}>
                <div className="Fac_Home_Web_Addfarmcontainer">
                    <div className="Fac_Home_Web_Addfarmcontainer_Title">
                        <MdArrowBackIosNew size={28} style={{ marginRight: "10px", paddingTop: "7px", cursor: "pointer" }} onClick={() => navigate(-1)} />
                        <div style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            Add farm
                        </div>
                    </div>
                    {
                        (qrcodeState && addDeviceState == "farm") ?
                            <div className="Fac_Home_Web_Addfarmcontainer_Body" style={{justifyContent:"space-between"}}>
                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Left">
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items">
                                        Name: 
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" maxLength="30"></textarea>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items" style={{marginTop:"15px"}} maxLength="30">
                                        Address:
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"></textarea>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items"  style={{marginTop:"15px"}} maxLength="150">
                                        Description: 
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" style={{height:"100px",textAlign:"left"}}></textarea>
                                    </div>
                                </div>
                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Right">
                                    
                                        <img className="Fac_Home_Web_Addfarmcontainer_Body_Right_Map" src="/images/map.png" alt="" />
                                    
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons">
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => setQrcodeState(false)} style={{marginRight:"20px"}}>
                                            <BsQrCode size={20} style={{marginRight:"10px"}}/>
                                            Add QR code again
                                        </button>
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => navigate('/dashboard')}>
                                            <AiOutlinePlusCircle size={20} style={{marginRight:"10px"}}/>
                                            Add farm
                                        </button>
                                    </div>
                                </div>
                            </div>
                            : (qrcodeState && addDeviceState == "equipment") ? 
                            <div className="Fac_Home_Web_Addfarmcontainer_Body" style={{justifyContent:"space-between"}}>
                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Left">
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items">
                                        Bump name: 
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" maxLength="30"></textarea>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items" style={{marginTop:"15px"}} maxLength="30">
                                        SHT name:
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"></textarea>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items"  style={{marginTop:"15px"}} maxLength="30">
                                        Ph name: 
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"></textarea>
                                    </div>
                                </div>
                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Right">
                                    
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection">
                                        Farm selection:
                                        <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection_Input " onClick={() => setFarmSelectedState(!farmSeletedState)} style={{cursor:"pointer"}}>
                                            {farmSeleted}
                                        </div>
                                        {
                                            farmSeletedState ?
                                            <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection_Dropbox">
                                                {
                                                    farm.map((item, index) => {
                                                        return (
                                                            <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection_Dropbox_Items" key={index} onClick={() => {setFarmSelected(item);setFarmSelectedState(false)}}>
                                                                {item}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            :<></>
                                        }
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons">
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => setQrcodeState(false)} style={{marginRight:"20px"}}>
                                            <BsQrCode size={20} style={{marginRight:"10px"}}/>
                                            Add QR code again
                                        </button>
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => navigate('/farm')}>
                                            <AiOutlinePlusCircle size={20} style={{marginRight:"10px"}}/>
                                            Add equipment
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="Fac_Home_Web_Addfarmcontainer_Body" style={{justifyContent:"center",flexDirection:"column"}}>
                                <button className="Fac_Home_Web_Addfarmcontainer_Body_Qrbutton"  style={authQrState ? { outline: " 2px solid rgba(255, 0, 0, 0.9)" } : { outline: " 2px solid rgba(255, 255, 255, 0.9)" }} onClick={() => handleButtonClick()}>
                                    <BsQrCode size={26} style={{ marginRight: "10px" }} />
                                    Add Qr code file
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                {authQrState ?
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_State">
                                        <PiPlusBold size={29} color="#FF0000" style={{ marginRight: "5px", marginTop: "3px", rotate: "45deg" }} /> Invalid Qr code

                                    </div> :

                                    <></>
                                }


                            </div>
                    }

                </div>
            </BrowserView>
            <MobileView>

            </MobileView>
        </div>
    )
}
export default AddFarm