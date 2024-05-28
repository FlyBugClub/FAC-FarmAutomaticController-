import React, { useEffect, useState, PureComponent } from "react";
import './dashboard.scss'
import Menu from '../Menu/menu'
import Weather from "../Weather/weather";
export const Dashboard = () => {

    return (
        <div className="Fac_dashboard">
            <img src="./images/background.jpg" alt="" style={{position:"fixed",width: "100%", height: "100%"}}/>

            <div className="Fac_dashboard_container">
                
                <div className="Fac_dashboard_container_Left">
                    <Menu/>
                </div>
                <div className="Fac_dashboard_container_Right">
                    <Weather/>
                    {/* <div className="Fac_dashboard_container_Right_Dashboard">

                    </div> */}
                </div>

            </div>

        </div>
    )
}