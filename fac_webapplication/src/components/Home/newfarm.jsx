import React, { useState, useRef, useEffect, useContext } from "react";
import './home.scss'
import { BrowserView, MobileView } from "react-device-detect";
import { MdArrowBackIosNew } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { BsQrCode } from "react-icons/bs";
import { PiPlusBold } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { hover } from "@testing-library/user-event/dist/hover";

import { AuthContext } from "../Context/AuthContext";
import QrScanner from 'qr-scanner';
import { callAPi } from "../../services/UserService";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { stringify } from "ajv";

const AddFarm = ({ weatherState, addDeviceState }) => {
    const { id: paramId } = useParams();
    const [qrcodeState, setQrcodeState] = useState(false)
    const [authQrState, setAuthQrState] = useState(false)
    const [farmSeletedState, setFarmSelectedState] = useState(false)
    const [qrData, setQrData] = useState([])
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const autoCompleteRef = useRef(null);
    const fileInputRef = useRef(null);
    const nameEquipmentRef = useRef(null);
    const nameFarmRef = useRef(null);
    const DesciptionRef = useRef(null);
    const { URL, farmsct } = useContext(AuthContext);

    
    const googleMapsApiKey = "AIzaSyBF_aYE1ude5Qh1-SEoX1yMVAKz7Z46r7o";
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey,
        libraries: ["places"]
    });
    const [selectedLocation, setSelectedLocation] = useState({
        lat: 10.8231,
        lng: 106.6297,
    });
    
    let autoComplete;
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
        mapRef.current.setZoom(30);
    }, []);

    const [farmSeleted, setFarmSelected] = useState("");

    useEffect(() => {
        if (farmsct.length !== 0) {
            setFarmSelected(farmsct[0]["name"]);
        }
    }, [farmsct]);

    const handleScriptLoad = (updateQuery, autoCompleteRef) => {
        autoComplete = new window.google.maps.places.Autocomplete(
            autoCompleteRef.current,
            {
                componentRestrictions: { country: "VN" },
            }
        );
        autoComplete.addListener("place_changed", () => {
            handlePlaceSelect(updateQuery);
        });

    };

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps...";

    const handlePlaceSelect = async (updateQuery) => {
        const addressObject = await autoComplete.getPlace();

        const query = addressObject.formatted_address;
        updateQuery(query);

        const latLng = {
            lat: addressObject?.geometry?.location?.lat(),
            lng: addressObject?.geometry?.location?.lng(),
        };
        setSelectedLocation(latLng);
    };

    const Focus = () => {
        handleScriptLoad(setQuery, autoCompleteRef)

    }

    const handleScan = (data) => {
        if (data != undefined) {
            const splitResult = data.split(',');
            if (splitResult[0] == "fac") {
                if (splitResult[1] == addDeviceState) {
                    setQrData(splitResult)
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

    const handleAddEquipmentClick = async () => {
        if (nameEquipmentRef.current.value != "") {
            let device = [];
            for (let i = 2; i < qrData.length; i++) {
                if (i == 2) {
                    device.push({
                        "id": qrData[i],
                        "name": nameEquipmentRef.current.value,
                        "type": "Equipment"
                    })
                }
                else {
                    device.push({
                        "id": qrData[i],
                        "name": "",
                        "id_equipment": qrData[2],
                        "type": "Sensor"
                    })
                }
            }
            let body = {
                "id_esp": paramId,
                "device": device
            };

            let res = await callAPi("post", `${URL}/data/insertdevice`, body)

            if (!res.status) {
                toast.error("add equipment fail");
            }
            else navigate(-1)
        }
        else toast.error("please enter name equipment");

    }

    const handleAddFarmClick = async () => {
        if (DesciptionRef.current.value != "" && nameFarmRef.current.value != "" && autoCompleteRef.current.value != "") {
            let body = [
            qrData[2],
             paramId,
            nameFarmRef.current.value,
            DesciptionRef.current.value,
            selectedLocation.lat,
            selectedLocation.lng,
            autoCompleteRef.current.value
            ];
            let res = await callAPi("post", `${URL}/data/insertfarm`, body)

            if (!res.status) {
                toast.error("add equipment fail");
            }
            else navigate(-1)
        }
        else toast.error("please enter infomation");
    }


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
                                        <input className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" ref={nameFarmRef} maxLength="30" ></input>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items" style={{ marginTop: "15px" }} maxLength="30">
                                        Address:
                                        <input className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"
                                            maxLength="30"
                                            placeholder="Search Places ..."
                                            ref={autoCompleteRef}
                                            onFocus={() => Focus()}
                                        ></input>
                                    </div>
                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items" style={{ marginTop: "15px" }}>
                                        Description:
                                        <textarea
                                         maxLength="150"
                                            className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input"
                                            ref={DesciptionRef}
                                            style={{ height: "100px", textAlign: "left" }}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="Fac_Home_Web_Addfarmcontainer_Body_Right">

                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Map" >
                                        <GoogleMap
                                            mapContainerStyle={{
                                                height: "320px",
                                            }}
                                            center={selectedLocation}
                                            zoom={13}
                                            onLoad={onMapLoad}

                                        >
                                            <MarkerF
                                                position={selectedLocation}
                                                icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
                                            />
                                        </GoogleMap>
                                    </div>

                                    <div className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons">
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => setQrcodeState(false)} style={{ marginRight: "20px" }}>
                                            <BsQrCode size={20} style={{ marginRight: "10px" }} />
                                            Add QR code again
                                        </button>
                                        <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => handleAddFarmClick()}>
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
                                            <textarea className="Fac_Home_Web_Addfarmcontainer_Body_Left_Items_Input" maxLength="30" ref={nameEquipmentRef} ></textarea>
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
                                            <button className="Fac_Home_Web_Addfarmcontainer_Body_Right_Buttons_Items" onClick={() => handleAddEquipmentClick()}>
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