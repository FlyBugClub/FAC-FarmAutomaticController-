import React, { useEffect, useState, useRef, useContext } from "react";
import './home.scss'
import { BrowserView, MobileView } from "react-device-detect";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { MdCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {FiSettings} from "react-icons/fi";

import { callAPi } from "../../services/UserService";
import Loading from "./loading";
import { AuthContext } from "../Context/AuthContext";

export const Dashboard = ({ weatherState, handleAddDevice,setLocation }) => {
    const { URL, login, user, farmsct, authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [farms, setFarms] = useState([]);
    const [totalfarms, setTotalFarms] = useState([]);
    const [loadingState, setLoadingState] = useState(true)

    useEffect(() => {
        if (login.status === true) { getDashboard() }
    }, [login.status])

    const getDashboard = async () => {
        let res = await callAPi(
            "get",
            `${URL}/data/getDashboard/${user.id_user_}`,
        );
        setLoadingState(false)
        setTotalFarms(res.data)
        setFarms(res.data)
    }

    const navigateToFarm = (id_esp) => {
        let farms_temp = [];
        totalfarms.map((item) => {
            const info = {
                id_esp: item.id_esp_,
                name: item.name_esp_,
                
            };
            farms_temp = [...farms_temp, info]; 
        });
        getWeather(id_esp);
        authDispatch({
            type: "SET_FARM",
            payload: farms_temp,
        });
        navigate(`/farm/${id_esp}`);
    };

    const getWeather = async (id_esp) => {
        const location = farms.find((farm) => farm.id_esp_ == id_esp)
        console.log(location.longtitude_)
        setLocation({lat: location.latitude_,lng: location.longtitude_})
    }
    const navigateToSetting = (event,id) => {
        event.stopPropagation();
        const farmsetting = farms.find((farm) => farm.id_esp_ == id)
        authDispatch({
            type: "SET_CURRENT_FARM",
            payload: farmsetting,
        })
        handleAddDevice("farm")
        navigate(`/editfarm/${id}`)
      };

    const handleChange = (event) => {
        if(farms == undefined) return
        const newValue = event.target.value;
        let farm_search = []
        totalfarms.map((item) => {
            if ((item.name_esp_).toLowerCase().includes(newValue.toLowerCase()) || (item.description_).toLowerCase().includes(newValue.toLowerCase())) {
                farm_search = [...farm_search, item]
            };
        })
        setFarms(farm_search)
    }

    return (
        <div className="Fac_Home">
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }} >
                <div className="Fac_Home_Web_Dashboardcontainer">
                    <div className="Fac_Home_Web_Dashboardcontainer_Header">
                        Farms
                        <div className="center">
                            <input className="Fac_Home_Web_Dashboardcontainer_Header_Input" 
                            type="text" 
                            onChange={(e) => {handleChange(e)}}
                            placeholder="Search...">
                            </input>
                            <button className="Fac_Home_Web_Dashboardcontainer_Header_Button" onClick={() => { handleAddDevice("farm"); navigate(`/addfarm/${user.id_user_}`) }}>
                                <MdOutlineLibraryAdd size={28} style={{ marginRight: "10px" }} />  New farm
                            </button>
                        </div>
                        
                    </div>
                    {
                        loadingState ?
                            <div className="Fac_Home_Web_Dashboardcontainer_Farms" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Loading />
                            </div> :
                            {
                                ...farms.length == 0 ?
                                    <div className="Fac_Home_Web_Dashboardcontainer_Farms" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <h1>You haven't added farm yet</h1>
                                    </div>
                                    :
                                    <div className="Fac_Home_Web_Dashboardcontainer_Farms">
                                        {farms.map((item) => (
                                            <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item" key={item.id_esp_} onClick={() => navigateToFarm(item.id_esp_)}>
                                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Header">
                                                    
                                                    {item.name_esp_}
                                                    
                                                    <div className="center">
                                                        <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Header_Edit" onClick={(e) => navigateToSetting(e,item.id_esp_)}>
                                                        Setting
                                                            <FiSettings className="Icon" size={20}   />
                                                        </div>
                                                    {item.state ? <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Header_State">
                                                        <MdCircle size={20} color="#8AFF02" style={{ marginTop: "1px", marginRight: "5px" }} />
                                                        Connected
                                                    </div> :
                                                        <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Header_State" style={{ width: "160px" }}>
                                                            <MdCircle size={20} color="#FE0707" style={{ marginTop: "1px", marginRight: "5px" }} />
                                                            Disconnected
                                                        </div>
                                                    }
                                                    </div>
                                                </div>
                                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Description">
                                                    {item.description_}
                                                </div>
                                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Amount">
                                                    <div >sensors: {item.number_of_sensor_}</div>
                                                    <div style={{ marginLeft: "10px" }}>equipments: {item.number_of_equipment_}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                            }
                    }
                </div>
            </BrowserView>
            <MobileView>

            </MobileView>

        </div>
    )
}