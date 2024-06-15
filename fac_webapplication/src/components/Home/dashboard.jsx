import React, { useEffect, useState, PureComponent, useContext } from "react";
import './home.scss'
import { BrowserView, MobileView } from "react-device-detect";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { MdCircle } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";

import { callAPi } from "../../services/UserService";
import { AuthContext } from "../../AuthContext";
import Loading from "./loading";
export const Dashboard = ({ weatherState, handleAddDevice }) => {
    const authContext = useContext(AuthContext)
    const navigate = useNavigate();
    const [farms, setFarms] = useState([]);
    const [user, setUser] = useState([])
    const [loadingState, setLoadingState] = useState(true)

    useEffect(() => {
        let json = sessionStorage.getItem('user_info');
        json = JSON.parse(json);
        setUser(json)
    }, [])

    useEffect(() => {
        if (user.id_user_ != undefined) {
            getDashboard()

        }
    }, [user])

    const getDashboard = async () => {
        let res = await callAPi(
            "get",
            `${authContext.apiURL}/data/getDashboard/${user.id_user_}`,
        );

        setLoadingState(false)
        setFarms(res.data)
    }

    return (
        <div className="Fac_Home">
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }} >
                <div className="Fac_Home_Web_Dashboardcontainer">
                    <div className="Fac_Home_Web_Dashboardcontainer_Header">
                        Farms
                        <button className="Fac_Home_Web_Dashboardcontainer_Header_Button" onClick={() => { handleAddDevice("farm"); navigate("/addfarm") }}>
                            <MdOutlineLibraryAdd size={28} style={{ marginRight: "10px" }} />  New farm
                        </button>
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
                                            <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item" key={item.id_esp_} onClick={() => navigate("/farm")}>
                                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Header">
                                                    {item.name_esp_}
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
                                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Description">
                                                    {item.description_}

                                                </div>
                                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Amount">
                                                    <div >ph: {item.number_of_sensor_}</div>
                                                    <div style={{ marginLeft: "10px" }}>sht: {item.number_of_sensor_}</div>
                                                    <div style={{ marginLeft: "10px" }}>bump: {item.number_of_equipment_}</div>
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