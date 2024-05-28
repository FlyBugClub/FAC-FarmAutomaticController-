import React, { useEffect, useState, PureComponent } from "react";
import './dashboard.scss'
import Menu from '../Menu/menu'
import Weather from "../Weather/weather";
import { FiPlusCircle } from "react-icons/fi";

export const Dashboard = () => {

    const data = [{
        name: "Farm 1",
        description : "hehehe",
        status : true,
        ph: 1,
        sht: 1,
        bump: 1
    },
    {
        name: "Farm 1",
        description : "hehehe",
        status : true,
        ph: 1,
        sht: 1,
        bump: 1
    },
    {
        name: "Farm 1",
        description : "hehehe",
        status : true,
        ph: 1,
        sht: 1,
        bump: 1
    },
    {
        name: "Farm 1",
        description : "heheheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeasssssssssssssssssssssssssssseeeeeeeeeeeeádasdsadsadasssssssssssssssssádadsadasdasdasdasdasdasdasda",
        status : true,
        ph: 1,
        sht: 1,
        bump: 1
    },



]

    return (
        <div className="Fac_dashboard">
            <img src="./images/bg3.jpg" alt="" style={{position:"fixed",width: "100%", height: "100%",filter: "brightness(0.9)"}}/>

            <div className="Fac_dashboard_container">
                
                <div className="Fac_dashboard_container_Left">
                    <Menu/>
                </div>
                <div className="Fac_dashboard_container_Right">
                    <div>
                        <Weather/>
                    </div>
                    
                    <div className="Fac_dashboard_container_Right_Dashboard">

                        <div className="Fac_dashboard_container_Right_Dashboard_Title">
                            <div className="Fac_dashboard_container_Right_Dashboard_Title_Text">
                                Farms
                            </div>
                            <button className="Fac_dashboard_container_Right_Dashboard_Title_Button">
                            <FiPlusCircle style={{marginRight:"6px"}}/>
                                Add Farm
                            </button>
                        </div>
                        <div className="Fac_dashboard_container_Right_Dashboard_Farm">
                            {
                                data.map((item, index) => {
                                    return (
                                        <div className="Fac_dashboard_container_Right_Dashboard_Farm_Element">
                                            <div className="Fac_dashboard_container_Right_Dashboard_Farm_Element_Header">
                                                {item.name}
                                                <div className="Fac_dashboard_container_Right_Dashboard_Farm_Element_Header_Status">
                                                    {item.status ? "Online" : "Offline"}
                                                </div>
                                            </div>
                                            <div className="Fac_dashboard_container_Right_Dashboard_Farm_Element_Description">
                                                {/* {item.description} */}
                                                eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
                                            </div>
                                            <div className="Fac_dashboard_container_Right_Dashboard_Farm_Element_Equipmentamount" style={{color: "black"}}>
                                                sht: {item.sht} | ph: {item.ph} | bump: {item.bump}
                                            </div>
                                            
                                            
                                        </div>
                                    )
                                })
                            }
                        </div>
                        
                    </div>
                </div>

            </div>

        </div>
    )
}