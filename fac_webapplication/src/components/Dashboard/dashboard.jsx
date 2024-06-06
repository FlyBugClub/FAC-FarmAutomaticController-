import React, { useEffect, useState, PureComponent } from "react";
import './dashboard.scss'
import Menu from '../Menu/menu'
import Weather from "../Weather/weather";
import { BrowserView, MobileView } from "react-device-detect";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { MdCircle } from "react-icons/md";


import Farms from "../Farms/Farms";
import Farmcontroller from "../Farmcontroller/farmcontroller";
export const Dashboard = ({ weatherState }) => {
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

        }
    ]
    return (
        <div className="Fac_dashboard">
            <BrowserView className="Fac_dashboard_Web" style={weatherState ? { marginLeft: "20px" } : { marginLeft: "10px" }} >
                <div className="Fac_dashboard_Web_Container">
                    <div className="Fac_dashboard_Web_Container_Header">
                        Farms
                        <button className="Fac_dashboard_Web_Container_Header_Button">

                            <MdOutlineLibraryAdd size={28} style={{ marginRight: "10px" }} />  New farm
                        </button>
                    </div>
                    {farms.map((item) => (
                        <div className="Fac_dashboard_Web_Container_Farms">
                            <div className="Fac_dashboard_Web_Container_Farms_Header">
                                {item.name}
                                {item.state ? <div className="Fac_dashboard_Web_Container_Farms_Header_State">
                                    <MdCircle size={20} color="#8AFF02" style={{ marginTop: "1px", marginRight: "5px" }} />
                                    Connected
                                </div> :
                                    <div className="Fac_dashboard_Web_Container_Farms_Header_State" style={{width:"160px"}}>
                                        <MdCircle size={20} color="#FE0707" style={{ marginTop: "1px", marginRight: "5px" }} />
                                        Disconnected
                                    </div>
                                }

                            </div>
                            <div className="Fac_dashboard_Web_Container_Farms_Description">
                                {item.description}

                            </div>
                            <div className="Fac_dashboard_Web_Container_Farms_Amount">
                                <div >ph: {item.ph}</div>
                                <div style={{ marginLeft: "10px" }}>sht: {item.sht}</div>
                                <div style={{ marginLeft: "10px" }}>bump: {item.bump}</div>
                            </div>
                        </div>


                    ))}

                </div>
            </BrowserView>
            <MobileView>

            </MobileView>

        </div>
    )
}