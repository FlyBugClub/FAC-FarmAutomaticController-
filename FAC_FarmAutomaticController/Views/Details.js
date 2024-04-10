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
  Button,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { LineChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import MyContext from "../DataContext.js";
import apiUrl from "../apiURL.js";
import * as Notifications from "expo-notifications";
import { thresholdFreedmanDiaconis } from "d3";
let isFunctionRunning = false;
var flag = false;

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
};

const screenWidth = Dimensions.get("window").width;

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      statusManual: false,
      statusAuto: false,
      isEnabled: false,
      message_humid: "0.0",
      showArcRanges: false,
      
      datachart:{
        labels: [""],
        datasets: [
          {
            data: [0],
          }
        ],
        legend: ["loading"], // optional
      },
   
      switchStates: [],
      slidebar: [],
      sliderValue: [],
      name_bc:[],
      timelist: [],
      buttonaddtime: [],
      switchAll: [false,false,false],
      
      modalVisible: false,
      settingTimeModal: false,

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
  }


  static contextType = MyContext;
  HistoryPage = () => {
    // console.log("HistoryPage");
    this.props.navigation.navigate("History"); // 'History' là tên của màn hình History trong định tuyến của bạn
  };

  
  DateTimePage = () => {
    console.log("DateTime Page");
    flag = true;
    this.props.navigation.navigate("DateTime"); // 'History' là tên của màn hình History trong định tuyến của bạn
  };


  sendMessage = () => {};


  autoSwitch = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled,
    }));
    if (this.state.statusAuto == true) {
      this.state.statusAuto = false;
    } else if (this.state.statusAuto == false) {
      this.state.statusAuto = true;
    }
    this.sendMessage();
  };


  customSwitch = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled,
    }));
    if (this.state.statusAuto == true) {
      this.state.statusAuto = false;
    } else if (this.state.statusAuto == false) {
      this.state.statusAuto = true;
    }
    this.sendMessage();
  };


  pressmanual = () => {
    if (this.state.statusManual == false) {
      this.state.statusManual = true;
      // console.log('true');
      this.sendMessage();
    } else if (this.state.statusManual == true) {
      this.state.statusManual = false;
      // console.log('fasle');
      this.sendMessage();
    }
  };

  componentDidMount() {
    flag = false;
    this.getnumberswitch(); 
     // Gọi hàm push vào mảng khi component được mount
  }
  // componentDidMount() {
  //   const{loop} = this.state;
  //   this.intervalId = setInterval(() => {
  //     // Thực hiện các hành động bạn muốn lặp lại sau mỗi 5 giây ở đây
      

  //     this.getvalue()
  //   }, 3000);
   
  
  // }


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

  //test toggle
  
  toogle1in3 = (setIndex, buttonIndex) => {
    
    this.setState(prevState => {
      const updatedButtonSets = prevState.switchStates.map((set, i) => {
        if (i === setIndex) {
          return set.map((btn, j) => (j === buttonIndex ? !btn : false));
        } else {
          return set;
        }
      });

      
      flag = true;

      return { switchStates: updatedButtonSets };
    });
  };

  toogleall = (index) => {
    
    this.setState(prevState => {
      const updatedButtons = prevState.switchAll.map((_, i) => (i === index ? true : false));
      return { switchAll: updatedButtons };
    });
  };


   handleSliderChange = (index,value) => {
    flag = true
    this.setState(prevState => {
      const newValues = [...prevState.sliderValue];
      newValues[index] = parseInt(value) ;
      return { sliderValue: newValues };
    });
  };


  handleSliderComplete = (value) => {
    // Khi người dùng kết thúc việc điều chỉnh slider, bạn có thể lấy giá trị ở đây
    flag = true;
  };


  setbarvalue = (index) => {
    
    this.setState(prevState => {
      const updatedButtons = prevState.switchAll.map((_, i) => (i === index ? true : false));
      return { switchAll: updatedButtons };
    });
  };


  //Set Modal View
  setModalVisible = (visible) => {
    flag = true;
    console.log("heheh")
    
    this.setState({ modalVisible: visible });
  };

  setSettingTimeModalVisible = (visible) => {
    flag = true;
    this.setState({ settingTimeModal: visible });
  };

  //DateTime
  toggleDatePicker = () => {
    flag = true;
    this.setState((prevState) => ({ showPicker: !prevState.showPicker }));
  };

  onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || this.state.date;
      this.setState({ date: currentDate });
      if (Platform.OS === "android") {
        this.toggleDatePicker();
      }
    } else {
      this.toggleDatePicker();
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
    // console.log("______________________________")
    for (let i = 0;i<dataArray[1]["bc"]["sl"];i++)
    {
      id_check.push(json[0]["combo"+i.toString()]["DHT"]["id"])
      id_check.push(json[0]["combo"+i.toString()]["PH"]["id"])
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
      else if (dataArray[1]["sensor"][i].hasOwnProperty("name_ph"))
      {
        let  value = dataArray[1]["sensor"][i]["name_ph"];
        let key  = dataArray[1]["sensor"][i]["id_ph"];
        jsonObject[key] = value;
      }
    }
    newlegend = id_check.filter((item, index) => id_check.indexOf(item) === index);


    for (let i = 0; i < newlegend.length; i++) {
      if (jsonObject.hasOwnProperty(newlegend[i])) {
        newlegend[i] = jsonObject[newlegend[i]];
      }

    }
    // console.log(json[0]);

    var datelist = [];
    for (let i = 0;i<dataArray[1]["bc"]["sl"]; i++ )
    {
      for(let j = 0;j<6; j++ )
      {
        datelist.push(json[0]["combo"+i.toString()]["DHT"][j.toString()]["datetime"])
        datelist.push(json[0]["combo"+i.toString()]["PH"][j.toString()]["datetime"])
      } 
    }
    // console.log("SAD")
    // console.log("______________________________")
    // console.log(datelist)
    datelist.sort((a, b) => new Date(b) - new Date(a));
    let dateTimebegin  = new Date(datelist[0]);
    let dateTimeend   = new Date(datelist[datelist.length - 1]);
    
    // console.log(dateTimeend)

    // Lấy thời gian từ đối tượng Date
    let hoursbe = dateTimebegin.getHours();
    let minutesbe = dateTimebegin.getMinutes(); 
    let secondsbe = dateTimebegin.getSeconds();

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
   
    for (let i = 0; i < (sum_sensor/2); i++) {
      let valuedht = [];
      let valueph = [];
      // console.log()
      // Sinh dữ liệu ngẫu nhiên cho mỗi dataset
      for (let j = 0; j < 6; j++) {
        // console.log(json[0]["combo"+i.toString()]["sensor"]["dht"+j.toString()])
        valuedht.push(json[0]["combo"+i.toString()]["DHT"][j.toString()]["value"]);
        valueph.push(json[0]["combo"+i.toString()]["PH"][j.toString()]["value"]);
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

    this.setState({ datachart: newData });
    // console.log(datachart)
    isFunctionRunning = false;
    }
  };


  getnumberswitch = async () => {
    
    const { dataArray } = this.context;
    
    const url = apiUrl + `getvalueequipment/${dataArray[1]["id_esp"]}`;
    
    const response = await fetch(url);
                if (!response.ok ) {
                    this.setState({ msg: "error" });
                    return;
                }
            
                const json = await response.json();
      

    const value = [];
    const newSwitchStates = [];
    const gettimelist = [];
    const name_bc = [];
    const slidebarvalue = [];
    for (let i = 0; i < dataArray[1]["bc"]["sl"]; i++) {
      const newSwitchStates2 = [];
      const time = [];
      // Thêm giá trị false vào mảng newSwitchStates
      newSwitchStates2.push(false);
      newSwitchStates2.push(false);
      newSwitchStates2.push(false);
      newSwitchStates.push(newSwitchStates2)
   
      if (Object.keys(json[0][i]["schedule"]).length === 0) {
        gettimelist.push([])
      } else {
        Object.values(json[0][i]["schedule"]).forEach((obj, index) => {
          time.push(obj["time"])
      
      });


      time.sort((a, b) => {
        // Chuyển đổi chuỗi thời gian thành giờ số để so sánh
        const timeA = new Date(`1970-01-01T${a}`);
        const timeB = new Date(`1970-01-01T${b}`);
        
        // So sánh thời gian
        return timeA - timeB;
      });
      gettimelist.push(time)
      } 
      slidebarvalue.push(50)
      value.push(50)
      name_bc.push(json[0][i]["name"])
    }

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
    this.setState({ selecedCat: value });
  }
  

  render() {
    const { dataArray } = this.context;
    //Switch
    const {switchStates ,switchAll} = this.state;
    const { datachart } = this.state;

    //API
    const { name_bc,timelist,sliderValue, isEnabled } =this.state;

    //Modal
    const { modalVisible, settingTimeModal } = this.state;
    //DateTime
    const { dateTime, showPicker } = this.state;
 
    const deviceList = [];
    // Sử dụng forEach để thêm các phần tử vào mảng items
    if (flag)
    {
      flag = false;

    
      [...Array(dataArray[1]["bc"]["sl"])].forEach((_, index) => {

        const timeComponents = [];
        const TimerList = [];
      
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

        [...Array(timelist[index].length)].forEach((_, indextime) => {
          TimerList.push(
            <View key={indextime}>
              <View style={styles.timeArea}>
                <Text style={styles.timeText}>{timelist[index][indextime]}</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity>
                    <Image
                      source={require("../assets/img/settings.png")}
                      style={styles.imgIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
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


        deviceList.push(
          <View style={styles.optionArea} key={index}>
            <Text style={styles.titleDevice}>{name_bc[index]}</Text>
            <View style={{}}>
              <View style={styles.function}>
                <Text>Custom</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toogle1in3(index,0)}
                  value={switchStates[index][0]}
                  style={{}}
                />
                
                <Text>Auto</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toogle1in3(index,1)}
                  value={switchStates[index][1]}
                  style={{}}
                />
                <Slider
                  style={{ width: 110, height: 40 }}
                  minimumValue={50}
                  maximumValue={95}
                  value={sliderValue[index]}
                  onValueChange={(value) => this.handleSliderChange(index, value)}
                  onSlidingComplete={this.handleSliderComplete}
                  minimumTrackTintColor={"#81BB4D"}
                />
                <Text>{sliderValue[index]}%</Text>
              </View>
              <View style={styles.function}>
                <Text>Timer</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => this.toogle1in3(index,2)}
                  value={switchStates[index][2]}
                  style={{ marginLeft: 11 }}
                />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={[
                    styles.timer,
                    { backgroundColor: switchStates[index][2] ? "white" : "#D9D9D9" },
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => this.setModalVisible(true)}
                  >
                    {timeComponents}
                  </TouchableOpacity>
                </ScrollView>
                {/* Modal Timer List*/}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.overlay} />
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <TouchableOpacity
                        style={{ alignItems: "flex-end", top: 20, right: 20 }}
                        onPress={() => this.setModalVisible(false)}
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
                        {TimerList}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
                <TouchableOpacity
                  style={styles.btnPlus}
                  onPress={this.toggleDatePicker}
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
        <StatusBar backgroundColor="#bfd200" />
        <LinearGradient
          colors={["#bfd200", "#aacc00", "#80b918"]}
          style={styles.BackDropTop}
        >
          <SafeAreaView>
            <View style={styles.TitleTopArea}>
            
              <Text style={styles.TitleTop}>{dataArray[1]["name"]}</Text>
            </View>
            <Text
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
              verticalLabelRotation={0}
              chartConfig={chartConfig}
              style={{ marginTop: 20 }}
              bezier
            />
          </TouchableOpacity>

          {/* <View style={styles.midle}>
            <View style={styles.alarm}>
              <Text style={{ color: "#F12525" }}>
                <Text style={{ color: "#F12525", fontWeight: "bold" }}>
                  Note:{" "}
                </Text>
                It is a long established fact that a reader will be distracted
                by the readable content
              </Text>
            </View>
          </View> */}
          <View style={styles.midle}>
            <View style={{ width: "95%" }}>
              <View style={styles.dropdownOptionArea}>
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
                        label={item.itemName}
                        value={item.itemName}
                        index={index}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {this.state.selecedCat === "All" && (
                <View>
                  <Text style={styles.titleNote}>All control</Text>
                  <View style={styles.optionArea}>
                    <View style={styles.function}>
                      <Text>Custom</Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => this.toogleall(0)}
                        value={switchAll[0]}
                        style={{}}
                      />
                      <Text>Auto</Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => this.toogleall(1)}
                        value={switchAll[1]}
                        style={{}}
                      />
                      <Slider
                        style={{ width: 110, height: 40 }}
                        minimumValue={50}
                        maximumValue={95}
                        value={sliderValue}
                        onValueChange={this.handleSliderChange}
                        onSlidingComplete={this.handleSliderComplete}
                        minimumTrackTintColor={"#81BB4D"}
                      />
                      <Text>85%</Text>
                    </View>
                    <View style={styles.function}>
                      <Text>Timer</Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => this.toogleall(2)}
                        value={switchAll[2]}
                        style={{ marginLeft: 11 }}
                      />
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={[
                          styles.timer,
                          {
                            backgroundColor: switchAll[2]
                              ? "white"
                              : "#D9D9D9",
                          },
                        ]}
                      >
                        <TouchableOpacity
                          style={{ flexDirection: "row" }}
                          onPress={() => this.setModalVisible(true)}
                        >
                          {/* Data time */}
                          <Text
                            style={[
                              styles.time,
                              { color: switchAll[2] ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:35
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switchAll[2] ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:40
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switchAll[2] ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:45
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switchAll[2] ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:50
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switchAll[2] ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:55
                          </Text>
                        </TouchableOpacity>
                      </ScrollView>

                      {/* DateTimePicker */}
                      {showPicker && (
                        <DateTimePicker
                          mode="time"
                          display="spinner"
                          value={dateTime}
                          onChange={this.onChange}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.btnPlus}
                        onPress={this.toggleDatePicker}
                      >
                        <Image
                          source={require("../assets/img/plus.png")}
                          style={styles.plusIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              {this.state.selecedCat === "Independence" && (
                <View>
                  <Text style={styles.titleNote}>Custom control</Text>
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
    backgroundColor: "#73A942",
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
});
