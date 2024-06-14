import React, { useEffect, useState, PureComponent, useContext } from "react";
import './home.scss'
import { BrowserView, MobileView } from "react-device-detect";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { MdCircle } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { callAPi } from "../../services/UserService";

export const Dashboard = ({ weatherState,handleAddDevice }) => {
    const navigate = useNavigate();
    const [farms, setFarms] = useState([]);
    const authContext = useContext(AuthContext);
    
    const getDashboard = async () => {
        // console.log(authContext.user_info)
        // let res = await callAPi(
        //   "get",
        //   `${authContext.apiURL}/data/getDashboard/${authContext.user_info.id_user}`,
        // );
        // console.log(res.data)
        // setFarms(res.data)
    }
    const handlethisbuttonclick = () => {
        console.log(authContext.user_info)
       
    }
    

    return (
        <div className="Fac_Home">
            <button onClick={handlethisbuttonclick}>click this button</button>
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }} >
                <div className="Fac_Home_Web_Dashboardcontainer">
                    <div className="Fac_Home_Web_Dashboardcontainer_Header">
                        Farms
                        <button className="Fac_Home_Web_Dashboardcontainer_Header_Button" onClick={() => {handleAddDevice("farm");navigate("/addfarm")}}>
                            <MdOutlineLibraryAdd size={28} style={{ marginRight: "10px" }} />  New farm
                        </button>
                    </div>
                    <div className="Fac_Home_Web_Dashboardcontainer_Farms">
                        {farms.map((item) => (
                            <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item" key={item.id} onClick={() => navigate("/farm")}>
                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Header">
                                    {item.name}
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
                                    {item.description}

                                </div>
                                <div className="Fac_Home_Web_Dashboardcontainer_Farms_Item_Amount">
                                    <div >ph: {item.ph}</div>
                                    <div style={{ marginLeft: "10px" }}>sht: {item.sht}</div>
                                    <div style={{ marginLeft: "10px" }}>bump: {item.bump}</div>
                                </div>
                            </div>


                        ))}
                    </div>


                </div>
            </BrowserView>
            <MobileView>

            </MobileView>

        </div>
    )
}