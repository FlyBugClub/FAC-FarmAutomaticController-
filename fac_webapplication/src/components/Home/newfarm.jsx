import React, { useState, useRef, useEffect, useContext } from "react";
import './home.scss'
import { BrowserView, MobileView } from "react-device-detect";
import { MdArrowBackIosNew } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { BsQrCode } from "react-icons/bs";
import { PiPlusBold } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { hover } from "@testing-library/user-event/dist/hover";
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import SearchLocationInput from "./locationsearch"
import { AuthContext } from "../Context/AuthContext";
import QrScanner from 'qr-scanner';
import MapComponent from "./map";
const AddFarm = ({ weatherState, addDeviceState }) => {
    // const farm = ["farm1","farm2","farm3","farm1","farm2","farm3"]
    const [qrcodeState, setQrcodeState] = useState(false)
    const [authQrState, setAuthQrState] = useState(false)
    const [farmSeleted, setFarmSelected] = useState("")
    const [farmSeletedState, setFarmSelectedState] = useState(false)
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { URL, farmsct } = useContext(AuthContext);

    const [place, setLocation] = useState("");
    const [selectedLocation, setSelectedLocation] = useState({
        lat: 10.8231,
        lng: 106.6297,
    });

    useEffect(() => {
        if (farmsct != undefined) {
            setFarmSelected(farmsct[0]["name"])
        }
    }, [farmsct]);
    const handleScan = (data) => {
        if (data != undefined) {
            const splitResult = data.split(',');
            if (splitResult[0] == "fac") {
                if (splitResult[1] == addDeviceState) { 
                     setQrcodeState(true) 
                }
                else alert("this qr code for add equipment")

            }
            else alert("invalid qr code")
        }
    };

    const handleButtonClick = () => {
        
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const result = await QrScanner.scanImage(file);
            handleScan(result)
        } catch (error) {
            console.error('Error scanning QR code:', error);
        }
    };
    const handleFocus = () => {
        if (place != "") {
            const { geometry } = place;
            const latLng = {
                lat: geometry.location.lat(),
                lng: geometry.location.lng()
            };
            setSelectedLocation(latLng);
        }
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
                            <div className="Fac_Home_Web_Addfarmcontainer_Body" style={{ justifyContent: "space-between" }}>
                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Left">
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items">
                                        Name:
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" maxLength="30"></textarea>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items" style={{ marginTop: "15px" }} maxLength="30">
                                        Address:
                                        <textarea
                                            className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"
                                            onChange={(e) => setLocation(e.target.value)}
                                            value={place}>

                                        </textarea>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items" style={{ marginTop: "15px" }} maxLength="150">
                                        Description:
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" style={{ height: "100px", textAlign: "left" }} onFocus={handleFocus}></textarea>
                                    </div>
                                </div>
                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Right">

                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Map" >
                                        <MapComponent selectedLocation={selectedLocation} />
                                    </div>

                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons">
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => setQrcodeState(false)} style={{ marginRight: "20px" }}>
                                            <BsQrCode size={20} style={{ marginRight: "10px" }} />
                                            Add QR code again
                                        </button>
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => navigate('/dashboard')}>
                                            <AiOutlinePlusCircle size={20} style={{ marginRight: "10px" }} />
                                            Add farm
                                        </button>
                                    </div>
                                </div>
                            </div>
                            : (qrcodeState && addDeviceState == "equipment") ?
                                <div className="Fac_Home_Web_Addfarmcontainer_Body" style={{ justifyContent: "space-between" }}>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left">
                                        <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items">
                                            Bump name:
                                            <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" maxLength="30"></textarea>
                                        </div>
                                        {/* <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items" style={{marginTop:"15px"}} maxLength="30">
                                        SHT name:
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"></textarea>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items"  style={{marginTop:"15px"}} maxLength="30">
                                        Ph name: 
                                        <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"></textarea>
                                    </div> */}
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right">

                                        <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection">
                                            Farm selection:
                                            <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection_Input " onClick={() => setFarmSelectedState(!farmSeletedState)} style={{ cursor: "pointer" }}>
                                                {farmSeleted}
                                            </div>
                                            {
                                                farmSeletedState ?
                                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection_Dropbox">

                                                        {farmsct != undefined && farmsct.map((item, index) => {
                                                            return (
                                                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Farmselection_Dropbox_Items" key={item.id_esp} onClick={() => { setFarmSelected(item.name); setFarmSelectedState(false) }}>
                                                                    {item.name}
                                                                </div>
                                                            )
                                                        })
                                                        }
                                                    </div>
                                                    : <></>
                                            }
                                        </div>
                                        <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons">
                                            <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => setQrcodeState(false)} style={{ marginRight: "20px" }}>
                                                <BsQrCode size={20} style={{ marginRight: "10px" }} />
                                                Add QR code again
                                            </button>
                                            <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => navigate('/farm')}>
                                                <AiOutlinePlusCircle size={20} style={{ marginRight: "10px" }} />
                                                Add equipment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="Fac_Home_Web_Addfarmcontainer_Body" style={{ justifyContent: "center", flexDirection: "column" }}>
                                    <button className="Fac_Home_Web_Addfarmcontainer_Body_Qrbutton" style={authQrState ? { outline: " 2px solid rgba(255, 0, 0, 0.9)" } : { outline: " 2px solid rgba(255, 255, 255, 0.9)" }} onClick={() => handleButtonClick()}>
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