import React, { useEffect, useState, PureComponent } from "react";
import './dashboard.scss'
import Menu from '../Menu/menu'
import Weather from "../Weather/weather";

import Farms from "../Farms/Farms";
import Farmcontroller from "../Farmcontroller/farmcontroller";
export const Dashboard = () => {

    
    return (
        <div className="Fac_dashboard">
            <img src="./images/bg3.jpg" alt="" style={{position:"fixed",width: "100%", height: "100%",filter: "brightness(0.9)"}}/>

            <div className="Fac_dashboard_container">
                
                <div className="Fac_dashboard_container_Left">
                    <Menu/>
                </div>
                <div className="Fac_dashboard_container_Right">
                    
                        <Weather/>
                        {/* <Farms/> */}
                        <Farmcontroller/>
                    
                </div>

            </div>

        </div>
    )
}