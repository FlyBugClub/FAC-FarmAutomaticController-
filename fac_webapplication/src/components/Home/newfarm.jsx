import React from "react";
import { BrowserView, MobileView } from "react-device-detect";
import './home.scss'

const AddFarm = ({weatherState}) => {

    return (
        <div className="Fac_Addfarm">
            <BrowserView  className="Fac_Addfarm_Web" style={weatherState ? { marginLeft: "15px" } : { marginLeft: "0px" }}>
                <div className="Fac_Addfarm_Web_Addfarmcontainer">

                </div>
            </BrowserView>
            <MobileView>

            </MobileView>
        </div>
    )
}
export default AddFarm