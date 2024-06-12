import React, { useEffect, useState, useRef } from "react";
import './home.scss'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { BrowserView, MobileView } from "react-device-detect";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdCircle } from "react-icons/md";

const Farm = ({ weatherState }) => {
    const navigate = useNavigate();
    const [listEquipmentState, setListEquipmentState] = useState(false);
    const [equipment, setEquipment] = useState("Equipment 1");
    const [listModeState, setListModeState] = useState(false);
    const [mode, setMode] = useState("Manual");
    const [modeState, setModeState] = useState(false);
    const sliderRef = useRef(null); // Tạo một ref cho slider
    const [value, setValue] = useState(50);

    useEffect(() => {
        setListModeState(false)
        setListEquipmentState(false)
    }, [mode, equipment])
    const data = [
        {
            id: 1,
            date: '2023-12-07',
            time: '12:30',
            sht_humid: 87,
            sht_temp: 30,
            ph: 7,
        },
        {
            id: 2,
            date: '2023-12-07',
            time: '15:30',
            sht_humid: 84,
            sht_temp: 29,
            ph: 7,
        },
        {
            id: 3,
            date: '2023-12-07',
            time: '16:30',
            sht_humid: 87,
            sht_temp: 30,
            ph: 7,
        },
        {
            id: 4,
            date: '2023-12-07',
            time: '17:30',
            sht_humid: 84,
            sht_temp: 29,
            ph: 7,
        },
        {
            id: 5,
            date: '2023-12-07',
            time: '18:30',
            sht_humid: 87,
            sht_temp: 30,
            ph: 7,
        },
        {
            id: 6,
            date: '2023-12-07',
            time: '19:30',
            sht_humid: 84,
            sht_temp: 29,
            ph: 7,
        },
        {
            id: 7,
            date: '2023-12-07',
            time: '20:30',
            sht_humid: 84,
            sht_temp: 29,
            ph: 7,
        },
        {
            id: 8,
            date: '2023-12-07',
            time: '21:30',
            sht_humid: 87,
            sht_temp: 30,
            ph: 7,
        },
        {
            id: 9,
            date: '2023-12-07',
            time: '22:30',
            sht_humid: 84,
            sht_temp: 29,
            ph: 7,
        }
    ];

    const handleChange = () => {
        setValue(sliderRef.current.value); // Lấy giá trị của slider
    };

    return (
        <div className="Fac_Home_Web" >
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }} >
                <div className="Fac_Home_Web_Farmcontainer">
                    <div className="Fac_Home_Web_Farmcontainer_Chart">
                        <div className="Fac_Home_Web_Farmcontainer_Chart_Left">
                            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                                <div className="Fac_Home_Web_Farmcontainer_Chart_Left_Title">
                                    <MdArrowBackIosNew size={28} style={{ marginRight: "10px", paddingTop: "7px", cursor: "pointer" }} onClick={() => navigate(-1)} />
                                    <div style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        Farm name
                                    </div>

                                </div>
                                <div className="Fac_Home_Web_Farmcontainer_Chart_Left_Status">

                                    <MdCircle size={18} color="#8AFF02" style={{ marginRight: "5px", marginTop: "3px" }} />
                                    Connected
                                </div>

                            </div>
                            <div className="Fac_Home_Web_Farmcontainer_Chart_Left_Chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart

                                        data={data}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            dataKey="time"
                                            tick={{ fontSize: 18, fill: '#fff' }} // Configures font size and color
                                            stroke="#fff" // Configures stroke color
                                            tickLine={false} // Configures tick line color
                                            axisLine={{ stroke: '#fff', strokeWidth: 3 }} // Configures axis line color
                                        />
                                        <YAxis
                                            tick={{ fontSize: 18, fill: '#fff' }} // Configures font size and color
                                            stroke="#fff" // Configures stroke color
                                            tickLine={false} // Configures tick line color
                                            axisLine={{ stroke: '#fff', strokeWidth: 2 }}
                                        />
                                        <Tooltip cursor={false} contentStyle={{ borderRadius: '0.1px' }} />

                                        <Area type="monotone"
                                            dataKey="sht_humid"
                                            stroke="#0061f2" // Màu xanh đậm cho đường line
                                            strokeWidth={2} //
                                            fill="#95C5FF"
                                            dot={{ fill: 'blue', stroke: '#0061f2', strokeWidth: 0, r: 4 }} // Đặc và màu xanh đậm cho các điểm dữ liệu
                                        />
                                        <Area type="monotone"
                                            dataKey="sht_temp"
                                            stroke="#FF2828" // Màu xanh đậm cho đường line
                                            strokeWidth={2} //
                                            fill="#F75B5B"
                                            dot={{ fill: 'red', stroke: '#FF2828', strokeWidth: 0, r: 4 }} // Đặc và màu xanh đậm cho các điểm dữ liệu
                                        />
                                        <Area type="monotone"
                                            dataKey="ph"
                                            stroke="#24761D" // Màu xanh đậm cho đường line
                                            strokeWidth={2} //
                                            fill="#ACFDA5"
                                            dot={{ fill: 'green', stroke: '#33A829', strokeWidth: 0, r: 4 }} // Đặc và màu xanh đậm cho các điểm dữ liệu
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                        </div>
                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right">


                            <button className="Fac_Home_Web_Farmcontainer_Chart_Right_Button" >
                                <IoIosAddCircleOutline size={30} style={{ marginRight: "15px" }} />
                                Add device
                            </button>
                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation" >
                                <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Header" onClick={() => setListEquipmentState(!listEquipmentState)}>
                                    {equipment}

                                </div>
                                {
                                    listEquipmentState ?
                                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox">
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox_Item" onClick={() => setEquipment("Equipment 1")}>
                                                Equipment 1
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox_Item" onClick={() => setEquipment("Equipment 2")}>
                                                Equipment 2
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox_Item" >
                                                Equipment 3
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox_Item" >
                                                Equipment 4
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox_Item" >
                                                Equipment 5
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox_Item" >
                                                Equipment 6
                                            </div>
                                        </div>
                                        :
                                        <></>
                                }

                                <div style={{ width: "100%", height: "1px", borderTop: "2px solid white", marginTop: "10px" }}></div>
                                <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Date">
                                    Date : 6/10/2024
                                </div>
                                <div style={{ marginTop: "10px", paddingRight: "15px" }}>
                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Content">
                                        <MdCircle size={15} color="#0061f2" style={{ marginRight: "5px" }} />
                                        Humidity
                                    </div>
                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Content">
                                        <MdCircle size={15} color="#FF2828" style={{ marginRight: "5px" }} />
                                        Temperature
                                    </div>
                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Content">
                                        <MdCircle size={15} color="#33A829" style={{ marginRight: "5px" }} />
                                        PH
                                    </div>
                                </div>

                            </div>



                        </div>
                    </div>

                    <div className="Fac_Home_Web_Farmcontainer_Controller">
                        <div className="Fac_Home_Web_Farmcontainer_Controller_Header">
                            Bump name
                            <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode">
                                Mode:
                                <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State" onClick={() => setListModeState(!listModeState)}>
                                    {mode}
                                </div>
                                {
                                    listModeState
                                        ?
                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox">
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox_Item" onClick={() => setMode("Manual")}>
                                                Manual
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox_Item" onClick={() => setMode("Automatic")}>
                                                Automatic
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox_Item" onClick={() => setMode("Timer")}>
                                                Timer
                                            </div>

                                        </div>
                                        :
                                        <></>
                                }

                            </div>



                        </div>
                        {
                            mode == "Manual" ?
                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "30px" }}>
                                        <label className="Fac_Home_Web_Farmcontainer_Controller_Body_switch">
                                            <input className="Fac_Home_Web_Farmcontainer_Controller_Body_switch_Input" type="checkbox" checked={modeState} onChange={() => setModeState(!modeState)} />
                                            <span className="slider round"></span>
                                        </label>

                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer">
                                            State:
                                            {modeState ?
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer_State">
                                                    ON
                                                    <MdCircle size={15} color="#8AFF02" style={{ marginLeft: "10px" }} />
                                                </div>
                                                :
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer_State">
                                                    OFF
                                                    <MdCircle size={15} color="#FE0707" style={{ marginLeft: "10px" }} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                : mode == "Automatic" ?
                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body">
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px" }}>
                                            <label className="Fac_Home_Web_Farmcontainer_Controller_Body_switch">
                                                <input className="Fac_Home_Web_Farmcontainer_Controller_Body_switch_Input" type="checkbox" checked={modeState} onChange={() => setModeState(!modeState)} />
                                                <span className="slider round"></span>
                                            </label>

                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer">
                                                State:
                                                {modeState ?
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer_State">
                                                        ON
                                                        <MdCircle size={15} color="#8AFF02" style={{ marginLeft: "10px" }} />

                                                    </div>
                                                    :
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer_State">
                                                        OFF
                                                        <MdCircle size={15} color="#FE0707" style={{ marginLeft: "10px" }} />

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Slidecontainer">
                                            <input
                                                type="range"
                                                min="60"
                                                max="100"
                                                value={value}
                                                onChange={handleChange}
                                                ref={sliderRef} // Sử dụng ref ở đây
                                                className="Fac_Home_Web_Farmcontainer_Controller_Body_Slidecontainer_Slider"
                                            />
                                            <div style={{ marginLeft: "10px", fontSize: "20px" }}>{value}</div>
                                        </div>
                                    </div>
                                    :
                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body">
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
                                            <label className="Fac_Home_Web_Farmcontainer_Controller_Body_switch">
                                                <input className="Fac_Home_Web_Farmcontainer_Controller_Body_switch_Input" type="checkbox" checked={modeState} onChange={() => setModeState(!modeState)} />
                                                <span className="slider round"></span>
                                            </label>

                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer">
                                                State:
                                                {modeState ?
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer_State">
                                                        ON
                                                        <MdCircle size={15} color="#8AFF02" style={{ marginLeft: "10px" }} />

                                                    </div>
                                                    :
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Statecontainer_State">
                                                        OFF
                                                        <MdCircle size={15} color="#FE0707" style={{ marginLeft: "10px" }} />

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Timecontainer">
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Timecontainer_Times">
                                                12:08
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Timecontainer_Times">
                                                12:08
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Timecontainer_Times">
                                                12:08
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Timecontainer_Times">
                                                12:08
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Timecontainer_Times">
                                                12:08
                                            </div>
                                        </div>
                                    </div>
                        }

                    </div>




                </div>

            </BrowserView>
            <MobileView>

            </MobileView>

        </div>
    )
}

export default Farm