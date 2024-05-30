import React, { useEffect, useState, PureComponent } from "react";
import { FiGrid, FiUserMinus, FiSettings } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import './farm.scss'
const Farms = () => {
    const data = [{
        name: "Farm 1",
        id : 1,
        description: "hehehe",
        status: true,
        ph: 1,
        sht: 1,
        bump: 1
    },
    {
        name: "Farm 1",
        id : 2,
        description: "hehehe",
        status: false,
        ph: 1,
        sht: 1,
        bump: 1
    },
    {
        name: "Farm 1",
        id : 3,
        description: "hehehe",
        status: true,
        ph: 1,
        sht: 1,
        bump: 1
    },
    {
        name: "Farm 1",
        id : 4,
        description: "heheheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeasssssssssssssssssssssssssssseeeeeeeeeeeeádasdsadsadasssssssssssssssssádadsadasdasdasdasdasdasdasda",
        status: true,
        ph: 1,
        sht: 1,
        bump: 1
    },



    ]

    return (
        <div className="Fac_Farms">
            <div className="Fac_Farms_Title">
                <div className="Fac_Farms_Title_Text">
                    Farms
                </div>
                <button className="Fac_Farms_Title_Button">
                    <FiPlusCircle style={{ marginRight: "6px" }} />
                    Add Farm
                </button>
            </div>
            <div className="Fac_Farms_Container">
                {
                    data.map((item, index) => {
                        return (
                            <div key={item.id} className="Fac_Farms_Container_Element">
                                <div className="Fac_Farms_Container_Element_Header">
                                    {item.name}
                                    <div className="Fac_Farms_Container_Element_Header_Status">
                                        {item.status ?
                                            <div className="Fac_Farms_Container_Element_Header_Status_Online">
                                                Connected
                                            </div> :
                                            <div className="Fac_Farms_Container_Element_Header_Status_Offline">
                                                Disconnected
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="Fac_Farms_Container_Element_Description">
                                    {item.description}

                                </div>
                                <div className="Fac_Farms_Container_Element_Equipmentamount" style={{ color: "black" }}>
                                    sht: {item.sht} | ph: {item.ph} | bump: {item.bump}
                                </div>


                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
export default Farms