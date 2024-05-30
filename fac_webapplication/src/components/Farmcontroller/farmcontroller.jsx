import React, { useEffect, useState, PureComponent } from "react";
import './farmcontroller.scss'
import { FiPlusCircle, FiChevronLeft,FiMoreHorizontal } from "react-icons/fi";
import { FiGrid, FiUserMinus, FiSettings } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Farmcontroller = () => {
    const data = [
        {
            name: "Farm 1",
            id: 1,
            description: "hehehe",
            status: true,
            ph: 1,
            sht: 1,
            bump: 1
        },


    ]
    const data_chart = [
        {
            name: 'Page A',
            uv: 8000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    return (
        <div className="Fac_farmcontroller">
            <div className="Fac_farmcontroller_Title">
                <FiChevronLeft className="Fac_farmcontroller_Title_Back" size={40} />
                <div className="Fac_farmcontroller_Title_Text">
                    Farms Name
                </div>
                <FiSettings className="Fac_farmcontroller_Title_Icon" size={28} />

                <button className="Fac_farmcontroller_Title_Button">
                    <FiPlusCircle style={{ marginRight: "6px" }} />
                    Add Device
                </button>
            </div>
            <div className="Fac_farmcontroller_Main">
                <div className="Fac_farmcontroller_Main_Chartcontainer">
                    <ResponsiveContainer className="Fac_farmcontroller_Main_Chartcontainer_Chart" width="100%" height="100%">
                        <AreaChart
                            data={data_chart}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis axisLine={{ stroke: '#fff', strokeWidth: 3 }} tickLine={false}  tick={{ fontSize: 16, fill: '#ffff' }} dataKey="name" />
                            <YAxis tick={{ fontSize: 16, fill: '#ffff' }} axisLine={{ stroke: '#fff', strokeWidth: 3 }}tickLine={false}/>
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.8}/>
                            <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8}/>
                            <Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.8}/>
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="Fac_farmcontroller_Main_Chartcontainer_Annotation">

                    </div>
                </div>
                <div className="Fac_farmcontroller_Main_Devicecontainer">
                        <div className="Fac_farmcontroller_Main_Devicecontainer_Device">
                            <div className="Fac_farmcontroller_Main_Devicecontainer_Device_Title">
                                    Device Name

                                
                                <FiMoreHorizontal style={{cursor:"pointer"}} size={30}/>
                            </div>

                        </div>
                </div>

            </div>

        </div>
    )
}
export default Farmcontroller