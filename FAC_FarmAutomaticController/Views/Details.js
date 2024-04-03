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
let globalVariable = "50.0";
var flag_humid_respect = 0;

const data = {
  labels: ["12h30", "12h35", "12h40", "12h45", "12h50", "12h55"],
  datasets: [
    {
      data: [80, 84, 75, 87, 77, 79, 89],
      color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
    {
      data: [67, 86, 72, 79, 86, 89, 68],
      color: (opacity = 1) => `rgba(165, 99, 54, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
    {
      data: [7, 12, 15, 17, 17, 14, 18],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
  legend: ["Humidity 1", "Humidity 2", "pH"], // optional
};

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
      sliderValue: 50,
      statusManual: false,
      statusAuto: false,
      isEnabled: false,
      message_humid: "0.0",
      showArcRanges: false,

      //test swith
      switch1Enabled: false,
      switch2Enabled: true,
      switch3Enabled: false,

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
  componentDidMount() {
    // Dispatch một action để lấy dữ liệu từ Redux store (nếu cần)
    this.props.fetchData();
  }
  HistoryPage = () => {
    console.log("HistoryPage");
    this.props.navigation.navigate("History"); // 'History' là tên của màn hình History trong định tuyến của bạn
  };

  DateTimePage = () => {
    console.log("DateTime Page");
    this.props.navigation.navigate("DateTime"); // 'History' là tên của màn hình History trong định tuyến của bạn
  };

  handleSliderChange = (value) => {
    this.setState({ sliderValue: value });
  };

  handleSliderComplete = (value) => {
    // Khi người dùng kết thúc việc điều chỉnh slider, bạn có thể lấy giá trị ở đây
    this.setState({ sliderValue: value });
    this.sendMessage();
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
    // Thay đổi tin nhắn mỗi 2 giây (điều chỉnh khoảng thời gian tùy vào nhu cầu)
    this.interval = setInterval(() => {
      this.setState({ message_humid: globalVariable });
    }, 2000);
  }

  componentWillUnmount() {
    // Xóa interval để tránh rò rỉ bộ nhớ
    clearInterval(this.interval);
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

  //test toggle
  handleSwitch1Change = () => {
    this.setState({
      switch1Enabled: true,
      switch2Enabled: false,
      switch3Enabled: false,
    });
  };

  handleSwitch2Change = () => {
    this.setState({
      switch1Enabled: false,
      switch2Enabled: true,
      switch3Enabled: false,
    });
  };

  handleSwitch3Change = () => {
    this.setState({
      switch1Enabled: false,
      switch2Enabled: false,
      switch3Enabled: true,
    });
  };

  //Set Modal View
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  setSettingTimeModalVisible = (visible) => {
    this.setState({ settingTimeModal: visible });
  };

  //DateTime
  toggleDatePicker = () => {
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
    const { dataArray } = this.context;
    const url = apiUrl + `getvalue/${dataArray[1]["id_esp"]}`;
    // console.log(url);
    console.log(dataArray[1])
    const response = await fetch(url);
                if (!response.ok ) {
                    this.setState({ msg: "error" });
                    return;
                }
            
                const json = await response.json();
                // console.log(json[0])
  };

  //Picker
  async onValueChangeCat(value) {
    this.setState({ selecedCat: value });
  }

  render() {
    const { dataArray } = this.context;
    //Switch
    const { switch1Enabled, switch2Enabled, switch3Enabled } = this.state;

    //API
    const { status, messageList, sliderValue, isEnabled, message_humid } =this.state;

    //Modal
    const { modalVisible, settingTimeModal } = this.state;

    //DateTime
    const { dateTime, showPicker } = this.state;

    

    // console.log("+++++++++++++++++++++++++++++")
    // console.log(dataArray[1])
    this.getvalue()
  
          // if (Object.values(json[0]) == 0) {
          //   this.setState({ isEnabled: false });
          // } else this.setState({ isEnabled: true });

          // for (const key in json) {
          //   // console.log(Object.keys(json[key]));
          //   const keys_dht = Object.keys(json[key]);

          //   if (keys_dht.includes("id_dht") && flag_humid_respect == 0) {
          //     flag_humid_respect = 1;
          //     this.setState({ sliderValue: json[key]["respect"] });
          //   }
          // }
      
    // Foreach Timer
    const TimerList = [];
    // Sử dụng forEach để thêm các phần tử vào mảng items
    [...Array(18)].forEach((_, index) => {
      TimerList.push(
        <View>
          <View style={styles.timeArea}>
            <Text style={styles.timeText}>{index}:50</Text>
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

    const deviceList = [];
    // Sử dụng forEach để thêm các phần tử vào mảng items
    [...Array(2)].forEach((_, index) => {
      deviceList.push(
        <View style={styles.optionArea}>
          <Text style={styles.titleDevice}>Water pump {index}</Text>
          <View style={{}}>
            <View style={styles.function}>
              <Text>Custom</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={switch1Enabled}
                style={{}}
              />
              <Text>Auto</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.handleSwitch2Change}
                value={switch2Enabled}
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
                onValueChange={this.handleSwitch3Change}
                value={switch3Enabled}
                style={{ marginLeft: 11 }}
              />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={[
                  styles.timer,
                  { backgroundColor: switch3Enabled ? "white" : "#D9D9D9" },
                ]}
              >
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => this.setModalVisible(true)}
                >
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    09:35
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    09:40
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    09:45
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    09:50
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    09:55
                  </Text>
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
            <View style={{ width: "90%", marginBottom: 12 }}>
              <Text style={{ color: "white", textAlign: "center" }}>
                It is a long established fact that a reader will be distracted
                by the readable
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={this.HistoryPage}>
            <LineChart
              data={data}
              width={screenWidth}
              height={200}
              verticalLabelRotation={0}
              chartConfig={chartConfig}
              style={{ marginTop: 20 }}
              bezier
            />
          </TouchableOpacity>

          <View style={styles.midle}>
            <View style={styles.alarm}>
              <Text style={{ color: "#F12525" }}>
                <Text style={{ color: "#F12525", fontWeight: "bold" }}>
                  Note:{" "}
                </Text>
                It is a long established fact that a reader will be distracted
                by the readable content
              </Text>
            </View>
          </View>
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
                        onValueChange={this.handleSwitch1Change}
                        value={switch1Enabled}
                        style={{}}
                      />
                      <Text>Auto</Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.handleSwitch2Change}
                        value={switch2Enabled}
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
                        onValueChange={this.handleSwitch3Change}
                        value={switch3Enabled}
                        style={{ marginLeft: 11 }}
                      />
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={[
                          styles.timer,
                          {
                            backgroundColor: switch3Enabled
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
                              { color: switch3Enabled ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:35
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switch3Enabled ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:40
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switch3Enabled ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:45
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switch3Enabled ? "#333" : "#8A8A8A" },
                            ]}
                          >
                            09:50
                          </Text>
                          <Text
                            style={[
                              styles.time,
                              { color: switch3Enabled ? "#333" : "#8A8A8A" },
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
