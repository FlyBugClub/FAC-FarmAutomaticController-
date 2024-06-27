import React, { useEffect, useState, useRef, useContext } from "react";
import './home.scss'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { BrowserView, MobileView } from "react-device-detect";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdCircle } from "react-icons/md";
import { callAPi } from "../../services/UserService";
import { AuthContext } from "../Context/AuthContext";
import dayjs from 'dayjs';
import { FiSettings, FiPlus, FiXCircle, FiEdit3 } from "react-icons/fi"
import { Client, Message } from 'paho-mqtt';
import Loading from "./loading";
import { TbDatabaseSearch } from "react-icons/tb";
import HourMinutePicker from "../Time/timepicker";

const initialTimeList = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

const Farm = ({ weatherState, handleAddDevice }) => {
    const { URL, authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const { id: paramId } = useParams();
    const [id, setId] = useState("");
    const [listEquipmentState, setListEquipmentState] = useState(false);
    const [listEquipment, setListEquipment] = useState([]);
    const [equipment, setEquipment] = useState("Equipment 1");
    const [listModeState, setListModeState] = useState(false);
    const [mode, setMode] = useState("Manual");
    const [timeTableState, setTimeTableState] = useState(false);
    const [timeState, setTimeState] = useState(false);
    const [timeList, setTimeList] = useState([]);

    const [modeState, setModeState] = useState(false);// state cho to   ogle
    const [bumperState, setBumperState] = useState(false);
    const sliderRef = useRef(null);
    const [value, setValue] = useState(50); // value cho slider
    const [loadingState, setLoadingState] = useState(true)
    const [farm, setFarm] = useState([]);
    const [data, setData] = useState([]);
    const [currentDate, setcurrentDate] = useState("___-___-___");
    const [client, setClient] = useState(null);
    const [connectStatus, setConnectStatus] = useState("Disconnected");


    const [time, setTime] = useState('');



    const handleTimeChange = (newTime) => {
        setTime(newTime);
        console.log(newTime)
    };

    useEffect(() => {
        const options = {
            clientId: "id_" + parseInt(Math.random() * 100000), // Tạo clientId ngẫu nhiên
            host: 'broker.emqx.io',
            port: 8083,
            path: '/mqtt',
        };
        const newClient = new Client(options.host, options.port, options.clientId);
        setClient(newClient);

        setId(paramId || '')
    }, [])

    useEffect(() => {
        if (client !== null && connectStatus != "Connected" && connectStatus != "Connecting") {
            setConnectStatus("Connecting");
            client.connect({

                onSuccess: () => {
                    console.log('Connected to MQTT broker');
                    client.subscribe('fac_iot');
                    setConnectStatus("Connected");
                },
                onFailure: (message) => {
                    console.log("Connect fail : " + message);
                    setConnectStatus("Disconected");
                },

            });
            client.onMessageArrived = (message) => {
                console.log(`Received message on topic ${message.destinationName}: ${message.payloadString}`);
            };
            client.onConnectionLost = (responseObject) => {
                console.log("connection lost : " + responseObject.errorCode);
                setConnectStatus("Disconected");
            }
        }
    }, [client, connectStatus])

    useEffect(() => {
        if (id !== '') {
            getFarm(id, 1)
        }
    }, [id])


    useEffect(() => {
        if (farm.length !== 0) {

            getLastStatus()
            if (farm[0]["Sensors"] != undefined) {
                currentDateFunc()
                setFarmData()
            }
            else {
                setcurrentDate("___-___-___")
                setData([])
            }
            setLoadingState(false)
            setTimeList(initialTimeList)
        }
    }, [farm])

    useEffect(() => {
        if (connectStatus == "Connected" && client.isConnected()) {
            sendMessage();
        }

    }, [mode, modeState, bumperState, value])

    const disconnectMqtt = () => {
        if (connectStatus == "Connected" && client.isConnected()) {
            client.disconnect();
            setConnectStatus("Disconnected");
        }
    }


    const sendMessage = () => {
        try {
            // var message = new Message("{'vake':'cuong'}");
            // message.destinationName = "fac_iot";
            // client.send(message);
            if (farm.length != 0) {
                setLastStatus();
            }
        }
        catch (e) {
            alert(e);
        }



    };

    const getFarm = async (id_esp, id_equipment) => {
        setLoadingState(true)
        let res = await callAPi(
            "get",
            `${URL}/data/getequipment/${id_esp}/${id_equipment}`,
        );

        if (res.status) {
            setFarm(res.data)
        }
        else setLoadingState(false)

    }

    const currentDateFunc = () => {

        if (farm[0]["Sensors"][0]["value"] != undefined) {

            const date = dayjs((farm[0]["Sensors"][0]["value"][0]["datetime"]).split('T')[0]).format('DD-MM-YYYY')
            setcurrentDate(date)
        }
        else {
            setcurrentDate("___-___-___")
        }


    }

    const setFarmData = async () => {
        if (farm[0]["Sensors"][0]["value"] != undefined) {
            let temp = []
            farm[0]["Sensors"][0]["value"].map((item, index) => {
                const date = (item.datetime).split('T')[0]
                const time = (item.datetime).split('T')[1]
                let value = {}
                value = {
                    id: index + 1,
                    date: dayjs(date).format('DD-MM-YYYY'),
                    time: time.slice(0, 5)
                }
                for (let i = 0; i < farm[0]["Sensors"].length; i++) {
                    if (farm[0]["Sensors"][i]["category"] == "sht") {
                        value = {
                            ...value,
                            sht_humid: farm[0]["Sensors"][i]["value"][index]["value_humid"],
                            sht_temp: farm[0]["Sensors"][i]["value"][index]["value_temp"],
                        }
                    }
                    else {
                        const type = farm[0]["Sensors"][i]["category"];
                        value = {
                            ...value,
                            [type]: farm[0]["Sensors"][i]["value"][index]["value_humid"]
                        }

                    }

                }

                temp = [
                    value
                    , ...temp]

                setData(temp)
            })
        }
        else {
            setData([])
        }
    }

    const getLastStatus = async () => {


        const laststatus = farm[0]["laststatus"]
        if (laststatus != undefined) {
            // set toogle state
            if (laststatus["btn_status"] == 0) {
                setModeState(false)
            }
            else setModeState(true)

            if (laststatus["last_status"] == 0 || laststatus["last_status"] == null) {
                setBumperState(false)
            }
            else setBumperState(true)
            if (laststatus["mode"] == 0) {
                setMode("Manual")
            }
            else if (laststatus["mode"] == 1) {
                setMode("Automatic")
            }
            else if (laststatus["mode"] == 2) {
                setMode("Timer")
            }
            setValue(laststatus["expect_sensor_value"])

        }
        else {
            setModeState(false);
            setMode("Manual");
            setBumperState(false)
            setValue(50)
        }


    }

    const setLastStatus = async () => {
        let body = [
            `${farm[0]["id"]}`, // id equipment
            `${modeState ? 1 : 0}`, // toogle state
            `${mode == "Manual" ? 0 : mode == "Automatic" ? 1 : 2}`, // mode state
            `${value}`, // expect sensor value
        ];
        let res = await callAPi("post", `${URL}/data/editlaststatus`, body)

        if (!res.status) {
            alert("seting last status fail")
        }
        else {
            console.log("ok")
        }
    }

    const handleEquipmentButton = async () => {
        setListEquipmentState(!listEquipmentState)
        let res = await callAPi(
            "get",
            `${URL}/data/getequipmentlist/${id}`,
        );
        if (res.status) {
            setListEquipment(res.data["equipment"])
        }
        else {
            alert("get ting fail")
        }
    }


    const handleChange = () => {
        setValue(sliderRef.current.value); // Lấy giá trị của slider
    };


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length && !timeTableState) {
            const data = payload[0].payload;
            return (

                <div className="custom-tooltip" style={{ backgroundColor: 'black', border: '1px solid #ccc', padding: '10px', borderRadius: "15px" }}>
                    <p className="label">{`Date: ${data.date}`}</p>
                    <p className="label">{`Humidity: ${data.sht_humid}%`}</p>
                    <p className="label">{`Temperature: ${data.sht_temp}°C`}</p>
                    <p className="label">{`pH: ${data.ph}`}</p>
                </div>
            );
        }

        return null;
    };

    const navigateToSetting = () => {
        authDispatch({
            type: "SET_CURRENT_DEVICE",
            payload: farm[0],
        });
        handleAddDevice("equipment")
        navigate(`/editfarm/${id}`)
    };

    return (
        <div className="Fac_Home_Web" >
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }} >
                {loadingState ?
                    <div className="Fac_Home_Web_Farmcontainer center">
                        <Loading />
                    </div>
                    : (farm.length != 0 ?
                        <div className="Fac_Home_Web_Farmcontainer">
                            <div className="Fac_Home_Web_Farmcontainer_Header">
                                <div className="Fac_Home_Web_Farmcontainer_Header_Left">

                                    <MdArrowBackIosNew size={28} style={{ marginRight: "10px", paddingTop: "7px", cursor: "pointer" }} onClick={() => { navigate("/dashboard"); disconnectMqtt() }} />
                                    <div style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        Farm name
                                    </div>

                                </div>
                                <div className="Fac_Home_Web_Farmcontainer_Header_Right">
                                    <button className="Fac_Home_Web_Farmcontainer_Header_Right_Button" onClick={() => { handleAddDevice("equipment"); disconnectMqtt(); navigate(`/addfarm/${id}`); }} >
                                        <TbDatabaseSearch size={20} className="Icon" />
                                        History
                                    </button>
                                    <button className="Fac_Home_Web_Farmcontainer_Header_Right_Button" onClick={() => { handleAddDevice("equipment"); disconnectMqtt(); navigateToSetting() }} >
                                        <FiSettings size={20} className="Icon" />
                                        Setting
                                    </button>
                                    <button className="Fac_Home_Web_Farmcontainer_Header_Right_Button" onClick={() => { handleAddDevice("equipment"); disconnectMqtt(); navigate(`/addfarm/${id}`); }} >
                                        <IoIosAddCircleOutline size={26} className="Icon" />
                                        Add device
                                    </button>
                                    <div className="Fac_Home_Web_Farmcontainer_Header_Right_Status">

                                        <MdCircle size={18} color="#8AFF02" style={{ marginRight: "5px", marginTop: "3px" }} />
                                        Connected
                                    </div>

                                </div>
                            </div>

                            <div className="Fac_Home_Web_Farmcontainer_Chart">
                                <div className="Fac_Home_Web_Farmcontainer_Chart_Left">

                                    {
                                        data.length != 0 ? <ResponsiveContainer width="100%" height="100%">
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

                                                <Tooltip
                                                    content={<CustomTooltip />}
                                                    cursor={false}
                                                    contentStyle={{ borderRadius: '0.1px' }}

                                                />


                                                <Area type="monotone"
                                                    dataKey="sht_humid"
                                                    stroke="#0061f2" // Màu xanh đậm cho đường line
                                                    strokeWidth={2} //
                                                    fill="#95C5FF"
                                                    dot={{ fill: 'blue', stroke: '#0061f2', strokeWidth: 0, r: 4 }} // Đặc và màu xanh đậm cho các điểm dữ liệu
                                                />
                                                <Area type="monotone"
                                                    dataKey="sht_temp"
                                                    stroke="#FF2828"
                                                    strokeWidth={2}
                                                    fill="#F75B5B"
                                                    dot={{ fill: 'red', stroke: '#FF2828', strokeWidth: 0, r: 4 }}
                                                />
                                                <Area type="monotone"
                                                    dataKey="ph"
                                                    stroke="#24761D"
                                                    strokeWidth={2}
                                                    fill="#ACFDA5"
                                                    dot={{ fill: 'green', stroke: '#33A829', strokeWidth: 0, r: 4 }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                            : <></>
                                    }



                                </div>
                                <div className="Fac_Home_Web_Farmcontainer_Chart_Right">



                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Header" onClick={() => handleEquipmentButton()}>
                                        {equipment}
                                    </div>
                                    {
                                        listEquipmentState ?
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Dropbox">
                                                {
                                                    listEquipment.map((item, index) => (
                                                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Dropbox_Item" key={item.id_equipment} onClick={() => { getFarm(id, item.id_equipment); setEquipment("Equipment " + (index + 1)); setListEquipmentState(false); setListModeState(false) }}>
                                                            Equipment {index + 1}
                                                        </div>
                                                    ))}
                                            </div>
                                            :
                                            <></>
                                    }

                                    <div style={{ width: "100%", height: "1px", borderTop: "2px solid white", marginTop: "10px" }}></div>
                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Date">
                                        Date : {currentDate}
                                    </div>
                                    <div style={{ marginTop: "10px", marginRight: "auto" }}>

                                        {farm[0]["Sensors"] != undefined ?
                                            (farm[0]["Sensors"]).map((item) => (
                                                item.category === "sht" ?
                                                    <div key={item.id}>
                                                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Content">
                                                            <MdCircle size={15} color="#0061f2" style={{ marginRight: "5px" }} />
                                                            Humidity
                                                        </div>
                                                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Content">
                                                            <MdCircle size={15} color="#FF2828" style={{ marginRight: "5px" }} />
                                                            Temperature
                                                        </div>
                                                    </div>

                                                    :
                                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Content" key={item.id}>
                                                        <MdCircle size={15} color="#33A829" style={{ marginRight: "5px" }} />
                                                        Ph
                                                    </div>

                                            )
                                            ) : <></>}
                                        {/* <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Content">
                                        <MdCircle size={15} color="#0061f2" style={{ marginRight: "5px" }} />
                                        Humidity
                                    </div>
                                    
                                    */}

                                    </div>



                                </div>
                            </div>
                            <div className="Fac_Home_Web_Farmcontainer_Controller">
                                <div className="Fac_Home_Web_Farmcontainer_Controller_Header">
                                    {farm[0].name}
                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode">
                                        Mode:
                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State" onClick={() => setListModeState(!listModeState)}>
                                            {mode}
                                        </div>
                                        {
                                            listModeState
                                                ?
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox">
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox_Item" onClick={() => { setMode("Manual"); setListModeState(false) }}>
                                                        Manual
                                                    </div>
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox_Item" onClick={() => { setMode("Automatic"); setListModeState(false) }}>
                                                        Automatic
                                                    </div>
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Header_Mode_State_Dropbox_Item" onClick={() => { setMode("Timer"); setListModeState(false) }}>
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
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control">
                                                <label className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch">
                                                    <input className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch_Input" type="checkbox" checked={modeState} onChange={() => { setModeState(!modeState) }} />
                                                    <span className="slider round"></span>
                                                </label>

                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer">
                                                    Bump:
                                                    {bumperState ?
                                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer_State">
                                                            ON
                                                            <MdCircle size={15} color="#8AFF02" style={{ marginLeft: "10px" }} />
                                                        </div>
                                                        :
                                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer_State">
                                                            OFF
                                                            <MdCircle size={15} color="#FE0707" style={{ marginLeft: "10px" }} />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        : mode == "Automatic" ?
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body">
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control">
                                                    <label className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch">
                                                        <input className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch_Input" type="checkbox" checked={modeState} onChange={() => { setModeState(!modeState) }} />
                                                        <span className="slider round"></span>
                                                    </label>

                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer">
                                                        Bump:
                                                        {bumperState ?
                                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer_State">
                                                                ON
                                                                <MdCircle size={15} color="#8AFF02" style={{ marginLeft: "10px" }} />

                                                            </div>
                                                            :
                                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer_State">
                                                                OFF
                                                                <MdCircle size={15} color="#FE0707" style={{ marginLeft: "10px" }} />

                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Slidecontainer">
                                                    <input
                                                        type="range"
                                                        min="60"
                                                        max="100"
                                                        value={value}
                                                        onChange={handleChange}
                                                        ref={sliderRef} // Sử dụng ref ở đây
                                                        className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Slidecontainer_Slider"
                                                    />
                                                    <div style={{ marginLeft: "10px", fontSize: "20px" }}>{value}</div>
                                                </div>
                                            </div>
                                            :
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body">
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control">
                                                    <label className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch">
                                                        <input className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch_Input" type="checkbox" checked={modeState} onChange={() => { setModeState(!modeState) }} />
                                                        <span className="slider round"></span>
                                                    </label>

                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer">
                                                        Bump:
                                                        {bumperState ?
                                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer_State">
                                                                ON
                                                                <MdCircle size={15} color="#8AFF02" style={{ marginLeft: "10px" }} />

                                                            </div>
                                                            :
                                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer_State">
                                                                OFF
                                                                <MdCircle size={15} color="#FE0707" style={{ marginLeft: "10px" }} />

                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Timecontainer" onClick={() => { setTimeTableState(!timeTableState) }}>
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Timecontainer_Times">
                                                        12:08
                                                    </div>
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Timecontainer_Times">
                                                        12:08
                                                    </div>
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Timecontainer_Times">
                                                        12:08
                                                    </div>
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Timecontainer_Times">
                                                        12:08
                                                    </div>
                                                    <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Timecontainer_Times">
                                                        12:08
                                                    </div>


                                                </div>

                                            </div>
                                }

                            </div>
                            {timeTableState ?
                                <div className="Fac_Home_Web_Farmcontainer_Settime" style={timeState ? { width: "220px" } : { width: "350px" }}>
                                    <div className="Fac_Home_Web_Farmcontainer_Settime_Title">
                                        <div className="Fac_Home_Web_Farmcontainer_Settime_Title_Offset">
                                            Offset:
                                            <input className="Fac_Home_Web_Farmcontainer_Settime_Title_Offset_Input" maxLength="2" type="text" />
                                        </div>

                                        <div className="Fac_Home_Web_Farmcontainer_Settime_Title_Icon">
                                            <FiPlus size={30} />
                                        </div>
                                    </div>
                                    <div className="Fac_Home_Web_Farmcontainer_Settime_Body">
                                        <div className="Fac_Home_Web_Farmcontainer_Settime_Body_Left" style={timeState ? {} : { borderRight: "2px solid white" }}>
                                            <div className="Fac_Home_Web_Farmcontainer_Settime_Body_Left_Title">
                                                Time:
                                                <FiPlus className="Icon" onClick={() => { setTimeState(!timeState) }} size={28} />
                                            </div>
                                            <div className="Fac_Home_Web_Farmcontainer_Settime_Body_Left_Times">
                                                {timeList.map((item,index) => (
                                                    
                                                    <div className="Fac_Home_Web_Farmcontainer_Settime_Body_Left_Times_Item" key={index}>
                                                            {item}
                                                        <div className="Fac_Home_Web_Farmcontainer_Settime_Body_Left_Times_Item_Edit">
                                                            <FiEdit3 className="Icon" />
                                                            <FiXCircle className="Icon" />
                                                        </div>
                                                    </div>
                                                ))}
                                                 
                                            </div>
                                        </div>
                                        {!timeState ? <div className="Fac_Home_Web_Farmcontainer_Settime_Body_Right">
                                            <HourMinutePicker onTimeChange={handleTimeChange} />
                                            <button className="Fac_Home_Web_Farmcontainer_Settime_Body_Right_Button">Add</button>
                                        </div> : <></>}

                                    </div>
                                </div>
                                : <></>}

                        </div> :
                        <div className="Fac_Home_Web_Farmcontainer">
                            <div className="Fac_Home_Web_Farmcontainer_Header">
                                <div className="Fac_Home_Web_Farmcontainer_Header_Left">

                                    <MdArrowBackIosNew size={28} style={{ marginRight: "10px", paddingTop: "7px", cursor: "pointer" }} onClick={() => { navigate("/dashboard"); disconnectMqtt() }} />
                                    <div style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        Farm name
                                    </div>

                                </div>
                                <div className="Fac_Home_Web_Farmcontainer_Header_Right">
                                    <button className="Fac_Home_Web_Farmcontainer_Header_Right_Button" onClick={() => { handleAddDevice("equipment"); disconnectMqtt(); navigate(`/addfarm/${id}`); }} >
                                        <TbDatabaseSearch size={20} className="Icon" />
                                        History
                                    </button>
                                    <button className="Fac_Home_Web_Farmcontainer_Header_Right_Button" onClick={() => { handleAddDevice("equipment"); disconnectMqtt(); navigateToSetting() }} >
                                        <FiSettings size={20} className="Icon" />
                                        Setting
                                    </button>
                                    <button className="Fac_Home_Web_Farmcontainer_Header_Right_Button" onClick={() => { handleAddDevice("equipment"); disconnectMqtt(); navigate(`/addfarm/${id}`); }} >
                                        <IoIosAddCircleOutline size={26} className="Icon" />
                                        Add device
                                    </button>
                                    <div className="Fac_Home_Web_Farmcontainer_Header_Right_Status">

                                        <MdCircle size={18} color="#8AFF02" style={{ marginRight: "5px", marginTop: "3px" }} />
                                        Connected
                                    </div>

                                </div>
                            </div>
                            <div className="Fac_Home_Web_Farmcontainer_Nofarm">No farm to display!</div>
                        </div>)



                }
            </BrowserView>
            <MobileView>

            </MobileView>
        </div>
    )
}

export default Farm