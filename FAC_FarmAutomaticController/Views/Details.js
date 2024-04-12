import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { LineChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import i18next, { languageResources } from "../services/i18next";
import MyContext from "../DataContext.js";
import apiUrl from "../apiURL.js";
import * as Notifications from "expo-notifications";
import { thresholdFreedmanDiaconis } from "d3";
import AsyncStorage from "@react-native-async-storage/async-storage";
import init from "react_native_mqtt";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});
// const options = {
//   host: 'broker.emqx.io',
//   port: 8083,
//   path: '/mqtt',
//   id: 'id_' + parseInt(Math.random()*100000)
// };
const options = {
  host: "d77ae1842ab3462d947a50556d8d9ed7.s1.eu.hivemq.cloud",
  port: 8884,
  path: "/mqtts",
  id: "id_" + parseInt(Math.random() * 100000),
};
client = new Paho.MQTT.Client(
  "wss://d77ae1842ab3462d947a50556d8d9ed7.s1.eu.hivemq.cloud:8884/mqtt",
  "i"
);
let isFunctionRunning = false;
var flag = false;
var flag_mqtt = true;
// Cấu hình cho biểu đồ
const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#fff",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(2, 62, 138, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: true, // optional
  decimalPlaces: 0, // Số lượng chữ số thập phân
  fromZero: true,
};

const screenWidth = Dimensions.get("window").width;

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status_mqtt: "disconnected",
      statusManual: false,
      statusAuto: false,
      isEnabled: false,
      message_humid: "0.0",
      showArcRanges: false,
      msg : "gg",
      datachart:{
        labels: [""],
        datasets: [
          {
            data: [0],
          },
        ],
        legend: ["Loading"], // optional
      },
      switchStates: [],
      slidebar: [],
      sliderValue: [],
      name_bc: [],
      timelist: [],
      buttonTime: [],
      buttonaddtime: [],
      TimerList: [],
      switchAll: [false, false, false],
      index_time: 0,
      topic: "tr6r/cuong",
      modalVisible: [],
      settingTimeModal: false,
      subscribedTopic: "tr6r/cuong",
      //DateTime
      dateTime: new Date(),
      showPicker: false,

      //Picker
      selecedCat: "Independence",
      selectedLanguage: "",
      category: [
        {
          itemName: "All",
        },

        {
          itemName: "Independence",
        },
      ],
    };
    // this.setDate = this.setDate.bind(this);
    // this.setShowPicker = this.setShowPicker.bind(this);
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
  }

  static contextType = MyContext;
  HistoryPage = () => {
    // console.log("HistoryPage");

    this.props.navigation.navigate("History"); // 'History' là tên của màn hình History trong định tuyến của bạn
  };

  AdvanceSettingDevicePage = () => {
    console.log("Advance Setting Device Page");
    this.props.navigation.navigate("AdvanceSettingDevice"); // 'History' là tên của màn hình History trong định tuyến của bạn
  };

  DateTimePage = () => {
    console.log("DateTime Page");
    flag = true;
    this.props.navigation.navigate("DateTime"); // 'History' là tên của màn hình History trong định tuyến của bạn
  };

  sendMessage = () => {
    const { sliderValue, switchStates } = this.state;
    const { dataArray } = this.context;
    // console.log(switchStates)
    var Data = {};

    // Data["id_esp"] = dataArray[1]["id_esp"];
    for (let i = 0; i < dataArray[1]["bc"]["sl"]; i++)
    {
      var equipment  = {};
      equipment["humid_expect"] = sliderValue[i]
      
      if (switchStates[i][0] === true)
      {
        equipment["status"] = 1
        equipment["automode"] = 0
      }
      else if (switchStates[i][1] === true)
      {
        equipment["status"] = 0
        equipment["automode"] = 1
      }
      else if (switchStates[i][2] === true)
      {
        equipment["status"] = 0
        equipment["automode"] = 2
      }
      else if (switchStates[i][0] === false && switchStates[i][0] === false && switchStates[i][0] === false)
      {
        equipment["status"] = 0
        equipment["automode"] = 0
      }
      Data["equipment"+i.toString()] = equipment;

      if (switchStates[i][0] === true) {
        equipment["status"] = 1;
        equipment["automode"] = 0;
      } else if (switchStates[i][1] === true) {
        equipment["status"] = 0;
        equipment["automode"] = 1;
      } else if (switchStates[i][2] === true) {
        equipment["status"] = 0;
        equipment["automode"] = 2;
      } else if (
        switchStates[i][0] === false &&
        switchStates[i][0] === false &&
        switchStates[i][0] === false
      ) {
        equipment["status"] = 0;
        equipment["automode"] = 0;
      }
      Data["equipment" + i.toString()] = equipment;
    }
    // console.log(Data)
    if (this.state.status_mqtt === "connected") {
      // console.log(JSON.stringify(Data))
      const jsonString = JSON.stringify(Data);
      var message = new Paho.MQTT.Message(jsonString);
      message.destinationName = this.state.subscribedTopic;
      client.send(message);
      // console.log("oks")
    }
  };

  componentDidMount() {
    flag = false;
    this.getvalueequipment(); 
    this.connect()
     // Gọi hàm push vào mảng khi component được mount
     this.intervalId = setInterval(() => {
      // Thực hiện các hành động bạn muốn lặp lại sau mỗi 3 giây ở đây
      // Ví dụ: Gọi hàm kiểm tra trạng thái

      this.getvalue();
  }, 3000);
  }

  async schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "fucking wow shit! 📬",
        body: "Con me may :)))",
        data: { data: "goes here" },
      },
      trigger: { seconds: 5 },
    });
    console.log("hello email");
  }

  // connect = () => {
  //   if (this.state.status_mqtt !== "isFetching")
  //   {
  //     this.setState(
  //       { status_mqtt: 'isFetching' },
  //       () => {
  //         client.connect({
  //           onSuccess: this.onConnect,
  //           useSSL: false,
  //           timeout: 3,
  //           onFailure: this.onFailure
  //         });
  //       }
  //     );
  //   }
  // }

  onConnect = () => {
    console.log("onConnect");
    this.subscribeTopic();
    flag = true;
    this.setState({ status_mqtt: "connected" });
  };

  connect = () => {
    if (this.state.status_mqtt !== "connected") {
      this.setState({ status_mqtt: "isFetching" }, () => {
        client.connect({
          userName: "cuong",
          password: "11111111",
          useSSL: false,
          onSuccess: this.onConnect,
          timeout: 3,
          onFailure: this.onFailure,
        });
      });
    }
  };

  onFailure = (err) => {
    console.log("Connect failed!");
    console.log(err);
    flag = true;
    this.setState({ status_mqtt: "fail" }, () => {
      this.connect();
    });

    // this.setState({ status: '', subscribedTopic: '' });
  };

  subscribeTopic = () => {
    client.subscribe(this.state.topic, { qos: 0 });
    console.log("ok");
  };

  onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0 && responseObject !== null) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    flag = true;
    flag_mqtt = true;
    // console.log("lalalala")
    this.setState({ status_mqtt: "disconnected" }, () => {
      console.log("reconnect");
      this.onConnect();
    });
  };

  toogle1in3 = (setIndex, buttonIndex) => {
    const { sliderValue } = this.state;
    this.setState(
      (prevState) => {
        const updatedButtonSets = prevState.switchStates.map((set, i) => {
          if (i === setIndex) {
            return set.map((btn, j) => (j === buttonIndex ? !btn : false));
          } else {
            return set;
          }
        });

        flag = true;
        return { switchStates: updatedButtonSets };
      },
      () => {
        // Hàm callback này sẽ được gọi sau khi state đã được cập nhật.
        this.sendMessage();
      }
    );
  };

  toogleall = (index) => {
    this.setState((prevState) => {
      const updatedButtons = prevState.switchAll.map((_, i) =>
        i === index ? true : false
      );
      return { switchAll: updatedButtons };
    });
  };

  handleSliderChange = (index, value) => {
    flag = true;
    this.setState((prevState) => {
      const newValues = [...prevState.sliderValue];
      newValues[index] = parseInt(value);
      return { sliderValue: newValues };
    });
  };

  handleSliderComplete = (index, value) => {
    // Khi người dùng kết thúc việc điều chỉnh slider, bạn có thể lấy giá trị ở đây
    flag = true;
    this.setState(
      (prevState) => {
        const newValues = [...prevState.sliderValue];
        newValues[index] = parseInt(value);
        return { sliderValue: newValues };
      },
      () => {
        // Hàm callback này sẽ được gọi sau khi state đã được cập nhật.
        this.sendMessage();
      }
    );
  };

  setbarvalue = (index) => {
    this.setState((prevState) => {
      const updatedButtons = prevState.switchAll.map((_, i) =>
        i === index ? true : false
      );
      return { switchAll: updatedButtons };
    });
  };

  //Set Modal View
  setModalVisible = (index) => {
    flag = true;
    // Tạo một bản sao của mảng switchStates để tránh thay đổi trực tiếp vào state
    const updatedSwitchStates = [...this.state.modalVisible];

    // Đảo ngược giá trị của phần tử tại chỉ số index
    updatedSwitchStates[index] = !updatedSwitchStates[index];

    // Cập nhật state với mảng đã được thay đổi
    this.setState({ modalVisible: updatedSwitchStates });
  };

  RemoveTime = async (index, indextime) => {
    const { timelist } = this.state;
    const { dataArray } = this.context;

    flag = true;
    // Tạo một bản sao của mảng switchStates để tránh thay đổi trực tiếp vào state
    // console.log(timelist[index][indextime])
    const url = apiUrl + "equipment";
    let result = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_equipment: dataArray[1]["bc"][index]["id_bc"],
        times_offset: 5,
        times: timelist[index][indextime],
      }),
    });
    result = await result.json();
    if (result) {
      if (result == "Delete success") {
        console.log("ok");
        timelist[index].splice(1, indextime);
        this.getvalueequipment();
      } else {
        console.log("not ok");
        this.getvalueequipment();
      }
    }
  };

  setSettingTimeModalVisible = (visible) => {
    flag = true;
    this.setState({ settingTimeModal: visible });
  };

  //DateTime
  toggleDatePicker = (index) => {
    flag = true;
    // console.log(index)
    // console.log(value)
    this.setState({ index_time: index });
    this.setState((prevState) => ({ showPicker: !prevState.showPicker }));
  };

  onChange = async (event) => {
    const { index_time } = this.state;
    const { dataArray } = this.context;

    if (event.type === "set") {
      if (Platform.OS === "android") {
        const selectedTime = new Date(event["nativeEvent"]["timestamp"]);

        console.log(dataArray[1]["bc"][index_time]["id_bc"]);
        const formattedTime = `${selectedTime.getHours()}:${selectedTime.getMinutes()}:${selectedTime.getSeconds()}.000`;
        const url = apiUrl + "schedules";
        let result = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_equipment: dataArray[1]["bc"][index_time]["id_bc"],
            times_offset: 5,
            times: formattedTime,
          }),
        });
        result = await result.json();
        if (result) {
          flag = true;
          if (result == "add time success") {
            console.info("add time success");

            this.getvalueequipment();
            this.setState((prevState) => ({
              showPicker: !prevState.showPicker,
            }));
          } else if (result == "this time is already add") {
            console.warn("this time is already add");
            this.setState((prevState) => ({
              showPicker: !prevState.showPicker,
            }));
          } else {
            console.warn("cuong");
            this.setState({ msg: "some thing is wrong" });
          }
        }
      }
    } else {
      this.setState((prevState) => ({ showPicker: !prevState.showPicker }));
    }
  };

  getvalue = async () => {
    if (!isFunctionRunning) {
      isFunctionRunning = true;
    const { dataArray } = this.context;
    const { datachart } = this.state;  
    const url = apiUrl + `getsensorvalue/${dataArray[1]["id_esp"]}`;
    var newlegend = [];
    var newlabels = [];
    var id_check = [];
    var newdatasets = [];
    // console.log(url);
    // console.log(dataArray[1])
    const response = await fetch(url);
    if (!response.ok ) {
      this.setState({ msg: "error" });
      return;
    }
    const json = await response.json()
    // console.log(json[0])
   
    // console.log(json[0])
    for (let i = 0;i<dataArray[1]["bc"]["sl"];i++)
    {
      if (json[0]["combo"+i.toString()]["DHT"].hasOwnProperty("id"))
      {
        id_check.push(json[0]["combo"+i.toString()]["DHT"]["id"])
        id_check.push(json[0]["combo"+i.toString()]["PH"]["id"])
      }
    }


    let sum_sensor =  dataArray[1]["sensor"]["sl_dht"] + dataArray[1]["sensor"]["sl_ph"]
    let jsonObject = {}
    for (let i = 0; i < sum_sensor; i++ )
    {
      if(dataArray[1]["sensor"][i].hasOwnProperty("name_dht"))
      {
        let  value = dataArray[1]["sensor"][i]["name_dht"];
        let key = dataArray[1]["sensor"][i]["id_dht"];
        jsonObject[key] = value;
      }
      const json = await response.json();
      // console.log(json[0])
      // console.log("______________________________")
      for (let i = 0; i < dataArray[1]["bc"]["sl"]; i++) {
        id_check.push(json[0]["combo" + i.toString()]["DHT"]["id"]);
        id_check.push(json[0]["combo" + i.toString()]["PH"]["id"]);
      }
    }

      for (let i = 0; i < newlegend.length; i++) {
        if (jsonObject.hasOwnProperty(newlegend[i])) {
          newlegend[i] = jsonObject[newlegend[i]];
        }
      }
      // console.log(json[0]);

    newlegend = id_check.filter((item, index) => id_check.indexOf(item) === index);
    for (let i = 0; i < newlegend.length; i++) {
      if (jsonObject.hasOwnProperty(newlegend[i])) {
        newlegend[i] = jsonObject[newlegend[i]];
      }
      // console.log("SAD")
      // console.log("______________________________")
      // console.log(datelist)
      datelist.sort((a, b) => new Date(b) - new Date(a));
      let dateTimebegin = new Date(datelist[0]);
      let dateTimeend = new Date(datelist[datelist.length - 1]);

      // console.log(dateTimeend)


    var datelist = [];
    for (let i = 0;i<dataArray[1]["bc"]["sl"]; i++ )
    {
      for(let j = 0;j<6; j++ )
      {
        if (json[0]["combo"+i.toString()]["DHT"].hasOwnProperty(j.toString()))

        {
          datelist.push(json[0]["combo"+i.toString()]["DHT"][j.toString()]["datetime"])
          datelist.push(json[0]["combo"+i.toString()]["PH"][j.toString()]["datetime"])
        }
      } 
    }


    // console.log(datelist)
    datelist.sort((a, b) => new Date(b) - new Date(a));
    let dateTimebegin  = new Date(datelist[0]);
    let dateTimeend   = new Date(datelist[datelist.length - 1]);
    

      let hoursen = dateTimeend.getHours();
      let minutesen = dateTimeend.getMinutes();
      let secondsen = dateTimeend.getSeconds();
      // console.log(`Thời gian: ${hours}:${minutes}:${seconds}`);

    let hoursen = dateTimeend.getHours();
    let minutesen = dateTimeend.getMinutes(); 
    let secondsen = dateTimeend.getSeconds();
    // console.log(`Thời gian: ${hours}:${minutes}:${seconds}`);
    
    newlabels.push(`${hoursbe}:${minutesbe}:${secondsbe}`)
    newlabels.push("")
    newlabels.push("")
    newlabels.push("")
    newlabels.push(`${hoursen}:${minutesen}:${secondsen}`)

      
    // console.log(newlabels)
    const colors = [
      ["0, 119, 182",   // Màu cho dataset 0
      "165, 99, 54"],   // Màu cho dataset 1
      ["134, 65, 244",  // Màu cho dataset 2
      "134, 0, 244"],   // Màu cho dataset 3
      ["255, 0, 0",     // Màu cho dataset 4 (màu đỏ)
      "0, 255, 0"]     // Màu cho dataset 6 (màu xanh dương)
    ];


    // console.log(sum_sensor/2)
    for (let i = 0; i < (sum_sensor/2); i++) {
      let valuedht = [];
      let valueph = [];
      // console.log()
      // Sinh dữ liệu ngẫu nhiên cho mỗi dataset
      for (let j = 0; j < 6; j++) {
        // console.log(json[0]["combo"+i.toString()]["sensor"]["dht"+j.toString()])
        
        if(json[0]["combo"+i.toString()]["DHT"].hasOwnProperty(j.toString()))
        {
          // console.log(json[0]["combo"+i.toString()]["DHT"][j.toString()]["value"])
          valuedht.push(json[0]["combo"+i.toString()]["DHT"][j.toString()]["value"]);
          valueph.push(json[0]["combo"+i.toString()]["PH"][j.toString()]["value"]);
        }else 
        {
          valuedht.push(0);
          valueph.push(0);
        }
        
      }
      // Chọn màu sắc từ mảng colors
      let colordht = colors[i][0] || "0, 0, 0"; // Màu mặc định nếu không có màu nào phù hợp
      let colorph = colors[i][1] || "0, 0, 0"; // Màu mặc định nếu không có màu nào phù hợp
       
      // Thêm đối tượng dataset vào mảng
      newdatasets.push({
        data: valuedht,
        color: (opacity = 1) => `rgba(${colordht}, ${opacity})`,
        strokeWidth: 2, // optional
      });
      newdatasets.push({
        data: valueph,
        color: (opacity = 1) => `rgba(${colorph}, ${opacity})`,
        strokeWidth: 2, // optional
      });
 
    }

    
    const reversedArray = newlabels.reverse();
    const newData = { 
      labels: reversedArray,
      datasets: newdatasets,
      legend: newlegend, // optional
    };
    flag = true;
    this.setState({ datachart: newData });
    // console.log(datachart)
    isFunctionRunning = false;
    }
  };

  onMessageArrived = (message) => {
    console.log(message.payloadString);

    // var jsonString = message.payloadString;
    // const keyValuePairs = jsonString.slice(1, -1).split(',');

    // keyValuePairs.forEach(pair => {
    //   const [key, value] = pair.split(':').map(item => item.trim());
    //  if (key === '"humid"')
    //  {
    //   globalVariable = value;
    //  }
    // });
  };

  getvalueequipment = async () => {
    const { dataArray } = this.context;

    const url = apiUrl + `getvalueequipment/${dataArray[1]["id_esp"]}`;

    const response = await fetch(url);
    if (!response.ok) {
      this.setState({ msg: "error" });
      return;
    }
    const json = await response.json();
    const value = [];
    const newSwitchStates = [];
    const gettimelist = [];
    const name_bc = [];
    const slidebarvalue = [];
    const TimerList = [];
    const buttonTime = [];
    const modalVisible = [];
    for (let i = 0; i < dataArray[1]["bc"]["sl"]; i++) {
      const newSwitchStates2 = [];
      const time = [];
      // Thêm giá trị false vào mảng newSwitchStates
      newSwitchStates2.push(false);
      newSwitchStates2.push(false);
      newSwitchStates2.push(false);
      newSwitchStates.push(newSwitchStates2);
      if (Object.keys(json[0][i]["schedule"]).length === 0) {
        gettimelist.push([]);
      } else {
        Object.values(json[0][i]["schedule"]).forEach((obj, index) => {
          time.push(obj["time"]);
        });
        time.sort((a, b) => {
          // Chuyển đổi chuỗi thời gian thành giờ số để so sánh
          const timeA = new Date(`1970-01-01T${a}`);
          const timeB = new Date(`1970-01-01T${b}`);
          return timeA - timeB;
        });
        gettimelist.push(time);
      }
      buttonTime.push(false);
      modalVisible.push(false);
      TimerList.push([]);
      slidebarvalue.push(50);
      value.push(50);
      name_bc.push(json[0][i]["name"]);
    }
    this.setState({ TimerList: [] });
    this.setState({ modalVisible: modalVisible });
    this.setState({ buttonTime: buttonTime });
    this.setState({ name_bc: name_bc });
    this.setState({ timelist: gettimelist });
    this.setState({ sliderValue: value });
    this.setState({ slidebar: slidebarvalue });
    flag = true;
    this.setState({ switchStates: newSwitchStates });
  };

  //Picker
  async onValueChangeCat(value) {
    flag = true;
    // console.log(value)
    this.setState({ selecedCat: value });
  }

  render() {
    const { dataArray } = this.context;
    //Switch
    const { switchStates, switchAll } = this.state;
    const { datachart, status_mqtt } = this.state;

    //API
    const { TimerList, name_bc, timelist, sliderValue, isEnabled, buttonTime } =
      this.state;

    //Modal
    const { modalVisible, settingTimeModal } = this.state;
    //DateTime
    const { dateTime, showPicker } = this.state;
 
    
    if (flag_mqtt)
    {
      flag_mqtt= false;
      console.log("heheacuong")
      
    }

    const deviceList = [];
    if (flag) {
      flag = false;
      [...Array(dataArray[1]["bc"]["sl"])].forEach((_, index) => {
        // console.log(showPicker)
        var timeComponents = [];

        for (let i = 0; i < timelist[index].length; i++) {
          const time = timelist[index][i];

          timeComponents.push(
            <Text
              key={i}
              style={[
                styles.time,
                { color: switchStates[index][2] ? "#333" : "#8A8A8A" },
              ]}
            >
              {time}
            </Text>
          );
        }
        var time = [];

        [...Array(timelist[index].length)].forEach((_, indextime) => {
          time.push(
            <View key={indextime.toString() + index.toString()}>
              <View style={styles.timeArea}>
                <Text style={styles.timeText}>
                  {timelist[index][indextime]}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => this.RemoveTime(index, indextime)}
                  >
                    <Image
                      source={require("../assets/img/remove.png")}
                      style={styles.imgIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={styles.line}></View>
              </View>
            </View>
          );
        });
        TimerList.push(time);

        deviceList.push(
          <View style={styles.optionArea} key={index}>
            <Text style={styles.titleDevice}>{name_bc[index]}</Text>
            <View style={{}}>
              <View style={styles.function}>
                <Text>{i18next.t("Custom")}</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toogle1in3(index, 0)}
                  value={switchStates[index][0]}
                  style={{}}
                />

                <Text>{i18next.t("Auto")}</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toogle1in3(index, 1)}
                  value={switchStates[index][1]}
                  style={{}}
                />
                <Slider
                  style={{ width: 110, height: 40 }}
                  minimumValue={50}
                  maximumValue={95}
                  value={sliderValue[index]}
                  onValueChange={(value) =>
                    this.handleSliderChange(index, value)
                  }
                  onSlidingComplete={(value) =>
                    this.handleSliderComplete(index, value)
                  }
                  minimumTrackTintColor={"#81BB4D"}
                />
                <Text>{sliderValue[index]}%</Text>
              </View>
              <View style={styles.function}>
                <Text>{i18next.t("Timer")}</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toogle1in3(index, 2)}
                  value={switchStates[index][2]}
                  style={{ marginLeft: 11 }}
                />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={[
                    styles.timer,
                    {
                      backgroundColor: switchStates[index][2]
                        ? "white"
                        : "#D9D9D9",
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => this.setModalVisible(index)}
                  >
                    {timeComponents}
                  </TouchableOpacity>
                </ScrollView>
                {/* Modal Timer List*/}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible[index]}
                  onRequestClose={() => {
                    this.setModalVisible(index);
                  }}
                >
                  <View style={styles.overlay} />
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <TouchableOpacity
                        style={{ alignItems: "flex-end", top: 20, right: 20 }}
                        onPress={() => this.setModalVisible(index)}
                      >
                        <Image
                          source={require("../assets/img/x.png")}
                          style={{
                            width: 20,
                            height: 20,
                            marginBottom: 20,
                            tintColor: "#DEDEDE",
                          }}
                        />
                      </TouchableOpacity>

                      <ScrollView showsVerticalScrollIndicator={false}>
                        {TimerList[index]}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
                <TouchableOpacity
                  style={styles.btnPlus}
                  onPress={() => this.toggleDatePicker(index)}
                >
                  <Image
                    source={require("../assets/img/plus.png")}
                    style={styles.plusIcon}
                  />
                </TouchableOpacity>
                {/* Modal Add Timer */}
              </View>
            </View>
          </View>
        );
      });
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#2BA84A" />
        <LinearGradient
          colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
          style={styles.BackDropTop}
        >
          <SafeAreaView>
            <View style={styles.TitleTopArea}>
              <Text style={styles.TitleTop}>{dataArray[1]["name"]}</Text>
            </View>
            {/* <Text
              style={[
                styles.TitleTop,
                { fontSize: 20 },
                { textAlign: "center" },
                { marginTop: 5 },
              ]}
            >
            </Text>
            {/* <View style={{ width: "90%", marginBottom: 12 }}>
              <Text style={{ color: "white", textAlign: "center" }}>
                It is a long established fact that a reader will be distracted
                by the readable
              </Text>
            </View> */}
          </SafeAreaView>
        </LinearGradient>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={this.HistoryPage}>
            <LineChart
              data={datachart}
              width={screenWidth}
              height={200}
              fromZero={true}
              verticalLabelRotation={0}
              chartConfig={chartConfig}
              style={{ marginTop: 20 }}
              yAxisSuffix="%"
              bezier
            />
          </TouchableOpacity>

          {/* <View style={styles.midle}>
            <View style={styles.alarm}>
              <Text style={{ color: "#F12525" }}>
                <Text style={{ color: "#F12525", fontWeight: "bold" }}>
                  {i18next.t("Note")}:
                </Text>
                It is a long established fact that a reader will be distracted
                by the readable content
              </Text>
            </View>
          </View> */}
          <View style={styles.midle}>
            <View style={{ width: "95%" }}>
              {/* <View style={styles.dropdownOptionArea}>
                <Text style={styles.dropdownOptionText}>Control</Text>
                <View>
                  <Picker
                    style={{ width: 180 }}
                    mode="dropdown"
                    selectedValue={this.state.selecedCat}
                    onValueChange={this.onValueChangeCat.bind(this)}
                  >
                    {this.state.category.map((item, index) => (
                      <Picker.Item
                        color="#333"
                        label={i18next.t(item.itemName)}
                        value={item.itemName}
                        index={index}
                      />
                    ))}
                  </Picker>
                </View>
              </View> */}
              {this.state.selecedCat === "All" && (
                <View>
                  <Text style={styles.titleNote}>
                    {i18next.t("All control")}
                  </Text>
                  <View style={styles.optionArea}></View>
                </View>
              )}
              {this.state.selecedCat === "Independence" && (
                <View>
                  <Text style={styles.titleNote}>
                    {i18next.t("Custom control")}
                  </Text>
                  {deviceList}
                  {/* DateTimePicker */}
                  {showPicker && (
                    <DateTimePicker
                      mode="time"
                      display="spinner"
                      value={dateTime}
                      onChange={this.onChange}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

class BtnConnect extends Component {
  render() {
    const { onPress, title, disabled, isPressed, onPressIn, onPressOut } =
      this.props;
    return (
      <TouchableOpacity
        style={[
          styles.BtnConnect,
          {
            backgroundColor: isPressed
              ? "#2D314A"
              : disabled
              ? "#F0F0F0"
              : "#2D3A3A",
            marginRight: 15,
          },
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <Text
          style={[
            styles.BtnConnectText,
            { fontWeight: "bold" },
            { color: isPressed ? "#F0F6F6" : disabled ? "#A6A6A6" : "#fff" },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

class BtnCustomMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false, // Khởi tạo trạng thái ban đầu là off
    };
  }

  handlePress = () => {
    // Khi nút được nhấn, đảo ngược trạng thái
    this.setState((prevState) => ({ isOn: !prevState.isOn }));
  };

  render() {
    const { title, isPressed, onPressOut, onPress } = this.props;
    const { isOn } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.BtnCustomMode,
          { backgroundColor: isOn ? "#81BB4D" : "#CDCDCD" },
        ]}
        onPressOut={this.handlePress}
        onPress={onPress}
      >
        <Text
          style={[
            styles.BtnCustomModeText,
            { color: "#fff", fontWeight: "bold" },
          ]}
        >
          {isOn ? "ON" : "OFF"}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  midle: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  BackDropTop: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#73A942",
  },
  TitleTopArea: {
    backgroundColor: "While",
    justifyContent: "space-between",
  },
  TitleTop: {
    top: -5,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  body: {
    flex: 1,
    top: -23,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  alarm: {
    width: "95%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  titleNote: {
    color: "#8A8A8A",
    fontWeight: "bold",
    marginLeft: 8,
    marginTop: 10,
    marginBottom: 5,
  },

  //Drodown Option
  dropdownOptionArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownOptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  optionArea: {
    backgroundColor: "white",
    marginTop: 5,
    marginBottom: 5,
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  titleDevice: {
    fontWeight: "bold",
    fontSize: 16,
  },
  function: {
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  timer: {
    width: "51%",
    padding: 4,
    flexDirection: "row",
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  time: {
    marginLeft: 5,
    marginRight: 5,
  },
  btnPlus: {
    width: "15%",
    height: 26,
    marginLeft: 5,
    borderRadius: 3,
    backgroundColor: "#2BA84A",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    width: 14,
    height: 14,
    tintColor: "white",
  },

  // Modal View
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Tối đi màn hình với độ trong suốt 50%
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  timeText: {
    fontSize: 26,
  },
  imgIcon: {
    width: 24,
    height: 24,
    marginLeft: 9,
    marginRight: 9,
    tintColor: "#DEDEDE",
  },
  line: {
    width: "95%",
    height: 0.5,

    backgroundColor: "#D9D9D9",
  },
  moreSettingArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnMoreSetting: {},
  imgMoreSetting: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: "gray",
  },
});
