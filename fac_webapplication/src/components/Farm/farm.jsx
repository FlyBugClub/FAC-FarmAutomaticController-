import React, { useEffect, useState, PureComponent } from "react";
import './farm.scss'

import { BrowserView, MobileView } from "react-device-detect";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdCircle } from "react-icons/md";

const Farm = ({weatherState}) => {
    const navigate = useNavigate();
   
    return (
        <div className="Fac_Farm">
            <BrowserView className="Fac_Farm_Web" style={weatherState ? { marginLeft: "15px" } : { marginLeft: "0px" }} >
                <div className="Fac_Farm_Web_Container">
                    <div className="Fac_Farm_Web_Container_Left">
                        <div  className="Fac_Farm_Web_Container_Left_Title">
                            <MdArrowBackIosNew size={28} style={{ marginRight: "10px",paddingTop:"7px" ,cursor:"pointer"}} onClick={() => navigate(-1)}/>
                            Farm name
                        </div>
                        <div className="Fac_Farm_Web_Container_Left_Status">
                           
                                <MdCircle size={18} color="#8AFF02" style={{ marginRight: "5px" ,marginTop:"3px"}} />
                                Connected
                            
                        </div>
                        
                    </div>
                    <div className="Fac_Farm_Web_Container_Right">
                    
                           
                           <button className="Fac_Farm_Web_Container_Right_Button" >
                            <IoIosAddCircleOutline size={30} style={{ marginRight: "15px" }} />  
                            Add device
                        </button>
                       
                 

                    </div>
                </div>

            </BrowserView>
            <MobileView>

            </MobileView>

        </div>
    )
}

export default Farm