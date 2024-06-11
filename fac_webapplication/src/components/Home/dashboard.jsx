import React, { useEffect, useState, PureComponent } from "react";
import './home.scss'
import { BrowserView, MobileView } from "react-device-detect";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { MdCircle } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";

export const Dashboard = ({ weatherState }) => {
    const navigate = useNavigate();
    const farms = [
        {
            id: 1,
            name: "Farm của Cường",
            state: true,
            description: "Farm trồng nấm bào ngư xám",
            ph: 1,
            sht: 1,
            bump: 1

        },
        {
            id: 2,
            name: "Farm của Cường 2",
            state: false,
            description: "Farm trồng nấm bào ngư",
            ph: 0,
            sht: 1,
            bump: 1

        },
        {
            id: 3,
            name: "Farm của Cường 3",
            state: false,
            description: "Farm trồng nấm bào ngư",
            ph: 0,
            sht: 0,
            bump: 0

        }
        ,
        {
            id: 4,
            name: "Farm của Cường 3",
            state: false,
            description: "Farm trồng nấm bào ngư",
            ph: 0,
            sht: 0,
            bump: 0

        }
    ]
    return (
        <div className="Fac_Home">
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }} >
                <div className="Fac_Home_Web_Dashboardcontainer">
                    <div className="Fac_Home_Web_Dashboardcontainer_Header">
                        Farms
                        <button className="Fac_Home_Web_Dashboardcontainer_Header_Button" onClick={() => navigate("/addfarm")}>
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