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
import { Client,Message } from 'paho-mqtt';
import Loading from "./loading";
const Farm = ({ weatherState, handleAddDevice }) => {
    const { URL, authDispatch } = useContext(AuthContext);

    const navigate = useNavigate();

    const { id: paramId } = useParams(); // Sử dụng useParams để lấy tham số id từ URL nếu cần
    const [id, setId] = useState(""); // Khởi tạo id từ paramId hoặc giá trị mặc định
    const [listEquipmentState, setListEquipmentState] = useState(false);
    const [listEquipment, setListEquipment] = useState([]);
    const [equipment, setEquipment] = useState("Equipment 1");
    const [listModeState, setListModeState] = useState(false);
    const [mode, setMode] = useState("Manual");
    const [modeState, setModeState] = useState(false);
    const sliderRef = useRef(null); // Tạo một ref cho slider
    const [value, setValue] = useState(50);
    const [loadingState, setLoadingState] = useState(true)
    const [farm, setFarm] = useState([]);
    const [data, setData] = useState([]);
    const [currentDate, setcurrentDate] = useState("___-___-___");
    const [client, setClient] = useState(null);
    const [connectStatus, setConnectStatus] = useState("Disconnected");


    // const mqttConnect = (host, id) => {
    //     setConnectStatus('Connecting');
    //     const mqttClient = mqtt.connect(host, { id });
    //     setClient(mqttClient);
    // };

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
        

        // if (client) {
        //     client.on('connect', () => {
        //         setConnectStatus('Connected');
        //         client.subscribe('your/topic/here'); // Subscribe to a topic after connecting
        //     });

        //     client.on('error', (err) => {
        //         console.error('Connection error: ', err);
        //         client.end();
        //         setConnectStatus('Error');
        //     });

        //     client.on('reconnect', () => {
        //         setConnectStatus('Reconnecting');
        //     });

        //     client.on('message', (topic, message) => {
        //         const payload = { topic, message: message.toString() };
        //         console.log(payload);
        //     });

        //     client.on('close', () => {
        //         setConnectStatus('Disconnected');
        //     });

        //     return () => {
        //         client.end(); // Cleanup the connection when the component unmounts
        //     };
        // }
    }, [])
    useEffect(() => {
        if (client !== null && connectStatus != "Connected" && connectStatus != "Connecting") {
            setConnectStatus("Connecting");
            client.connect( {
                
                onSuccess: () => {
                    console.log('Connected to MQTT broker');
                    client.subscribe('fac_iot');
                    setConnectStatus("Connected");
                },
                onFailure: (message) => {
                    console.log("Connect fail : "+message);
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
    }, [client,connectStatus])

    useEffect(() => {
        if (id !== '') {
            getFarm(id, 1)
        }
    }, [id])

    useEffect(() => {
        if (farm.length !== 0) {
            setLoadingState(false)
            if (farm[0]["Sensors"] != undefined) {
                currentDateFunc()
                setFarmData()
            }
            else {
                setcurrentDate("___-___-___")
                setData([])
            }
        }
    }, [farm])

    const disconnectMqtt = () => {
        if (connectStatus == "Connected" && client.isConnected()) {
            client.disconnect();
            setConnectStatus("Disconnected");
        }
    }


    const sendMessage = () => {

        console.log(client.isConnected());

        if (client.isConnected()) {
            console.log("send message");
            var message = new Message("{'vake':'cuong'}");
        message.destinationName = "fac_iot";
        client.send(message);
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
        else {
            alert("get ting fail")
        }
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
        if (active && payload && payload.length) {
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

    return (
        <div className="Fac_Home_Web" >
            <BrowserView className="Fac_Home_Web" style={weatherState ? { paddingLeft: "15px" } : { paddingLeft: "0px" }} >
                {farm.length == 0 ? <></>
                    :
                    <div className="Fac_Home_Web_Farmcontainer">
                        <div className="Fac_Home_Web_Farmcontainer_Chart">
                            <div className="Fac_Home_Web_Farmcontainer_Chart_Left">
                                <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Left_Title">
                                        <MdArrowBackIosNew size={28} style={{ marginRight: "10px", paddingTop: "7px", cursor: "pointer" }} onClick={() => {navigate("/dashboard");disconnectMqtt()}} />
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
                                                <Tooltip content={<CustomTooltip />} cursor={false} contentStyle={{ borderRadius: '0.1px' }} />

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

                            </div>
                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right">


                                <button className="Fac_Home_Web_Farmcontainer_Chart_Right_Button" onClick={() => { handleAddDevice("equipment"); navigate("/addfarm") }} >
                                    <IoIosAddCircleOutline size={30} style={{ marginRight: "15px" }} />
                                    Add device
                                </button>
                                <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation">
                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Header" onClick={() => handleEquipmentButton()}>

                                        {equipment}

                                    </div>
                                    {
                                        listEquipmentState ?
                                            <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox">
                                                {
                                                    listEquipment.map((item, index) => (
                                                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Dropbox_Item" key={item.id_equipment} onClick={() => { getFarm(id, item.id_equipment); setEquipment("Equipment " + (index + 1)); setListEquipmentState(false); setListModeState(false) }}>
                                                            Equipment {index + 1}
                                                        </div>
                                                    ))}

                                            </div>
                                            :
                                            <></>
                                    }

                                    <div style={{ width: "100%", height: "1px", borderTop: "2px solid white", marginTop: "10px" }}></div>
                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Date">
                                        Date : {currentDate}
                                    </div>
                                    <div style={{ marginTop: "10px", marginRight: "auto" }}>

                                        {farm[0]["Sensors"] != undefined ?
                                            (farm[0]["Sensors"]).map((item) => (
                                                item.category === "sht" ?
                                                    <div key={item.id}>
                                                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Content">
                                                            <MdCircle size={15} color="#0061f2" style={{ marginRight: "5px" }} />
                                                            {item.name}
                                                        </div>
                                                        <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Content">
                                                            <MdCircle size={15} color="#FF2828" style={{ marginRight: "5px" }} />
                                                            {item.name}
                                                        </div>
                                                    </div>

                                                    :
                                                    <div className="Fac_Home_Web_Farmcontainer_Chart_Right_Annotation_Content" key={item.id}>
                                                        <MdCircle size={15} color="#33A829" style={{ marginRight: "5px" }} />
                                                        {item.name}
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
                        </div>
                        <div className="Fac_Home_Web_Farmcontainer_Controller">
                            <div className="Fac_Home_Web_Farmcontainer_Controller_Header">
                                {farm[0].id}
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
                                        <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control">
                                            <label className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch">
                                                <input className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch_Input" type="checkbox" checked={modeState} onChange={() => { setModeState(!modeState);sendMessage() }} />
                                                <span className="slider round"></span>
                                            </label>

                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer">
                                                State:
                                                {modeState ?
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
                                                    <input className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch_Input" type="checkbox" checked={modeState} onChange={() => { setModeState(!modeState);sendMessage() }} />
                                                    <span className="slider round"></span>
                                                </label>

                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer">
                                                    State:
                                                    {modeState ?
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
                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch">
                                                    <input className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_switch_Input" type="checkbox" checked={modeState} onChange={() => setModeState(!modeState)} />
                                                    <span className="slider round"></span>
                                                </div>

                                                <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Statecontainer">
                                                    State:
                                                    {modeState ?
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
                                            <div className="Fac_Home_Web_Farmcontainer_Controller_Body_Control_Timecontainer">
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
                    </div>

                }

            </BrowserView>
            <MobileView>

            </MobileView>
        </div>
    )
}

export default Farm