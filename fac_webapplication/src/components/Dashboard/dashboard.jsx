import React, { useEffect, useState, PureComponent } from "react";
import './dashboard.scss'
import Menu from '../Menu/menu'
import Weather from "../Weather/weather";
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
        <div className="Fac_dashboard">
            <BrowserView className="Fac_dashboard_Web" style={weatherState ? { marginLeft: "15px" } : { marginLeft: "0px" }} >
                <div className="Fac_dashboard_Web_Container">
                    <div className="Fac_dashboard_Web_Container_Header">
                        Farms
                        <button className="Fac_dashboard_Web_Container_Header_Button">
                            <MdOutlineLibraryAdd size={28} style={{ marginRight: "10px" }} />  New farm
                        </button>
                    </div>
                    <div className="Fac_dashboard_Web_Container_Farms">
                        {farms.map((item) => (
                            <div className="Fac_dashboard_Web_Container_Farms_Item" key={item.id} onClick={() => navigate("/farm")}>
                                <div className="Fac_dashboard_Web_Container_Farms_Item_Header">
                                    {item.name}
                                    {item.state ? <div className="Fac_dashboard_Web_Container_Farms_Item_Header_State">
                                        <MdCircle size={20} color="#8AFF02" style={{ marginTop: "1px", marginRight: "5px" }} />
                                        Connected
                                    </div> :
                                        <div className="Fac_dashboard_Web_Container_Farms_Item_Header_State" style={{ width: "160px" }}>
                                            <MdCircle size={20} color="#FE0707" style={{ marginTop: "1px", marginRight: "5px" }} />
                                            Disconnected
                                        </div>
                                    }

                                </div>
                                <div className="Fac_dashboard_Web_Container_Farms_Item_Description">
                                    {item.description}

                                </div>
                                <div className="Fac_dashboard_Web_Container_Farms_Item_Amount">
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