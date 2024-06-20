import React, { useEffect, useState, useRef } from "react";
import { BrowserView, MobileView } from "react-device-detect";

import './weather.scss'
const Weather = ({ weatherState }) => {

    const weatherdata = [{
        id: 1,
        img: "/icons/cloudy.png",
        time: "9:00 AM",
        temperature: "32"
    },
    {
        id: 2,
        img: "/icons/snowing.png",
        time: "14:00 PM",
        temperature: "28"
    },
    {
        id: 3,
        img: "/icons/sun.png",
        time: "22:00 PM",
        temperature: "36"
    }
    ]
    return (
        <div className="Fac_Weather" style={weatherState ? {width: '13rem', animation: 'SlideMenuLeft 0.2s ease-in-out' }: {display:"none", }}>
            <BrowserView className="Fac_Weather_Web">
                        <div className="Fac_Weather_Web_Container" >
                            {weatherdata.map((item) => (
                                <div className="Fac_Weather_Web_Container_Elements" key={item.id}>
                                    <img className="Fac_Weather_Web_Container_Elements_Icon" src={item.img} alt="" ></img>
                                    <div >{item.time}</div>
                                    <div style={{ fontSize: "19px" }}>{item.temperature}°</div>
                                </div>
                            ))}
                        </div>
                        
                
            </BrowserView>


            <MobileView>
                <h1>This is rendered only on mobile</h1>
            </MobileView>



        </div>
    )
}

export default Weather