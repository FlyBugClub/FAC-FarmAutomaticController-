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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import i18next, { languageResources } from "../services/i18next";
import * as Notifications from "expo-notifications";

export default class AdvanceSettingDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 50,

      // ===== Switch ===== //
      switch1Enabled: false,
      switch2Enabled: true,
      switch3Enabled: false,

      // ===== DateTime ===== //
      dateTime: new Date(),
      showPicker: false,

      // ===== Modal ==== //
      modalVisible: false,
    };
  }

  // ============== Slider ============== //
  handleSliderChange = (value) => {
    this.setState({ sliderValue: value });
  };

  handleSliderComplete = (value) => {
    // Khi người dùng kết thúc việc điều chỉnh slider, bạn có thể lấy giá trị ở đây
    this.setState({ sliderValue: value });
    this.sendMessage();
  };

  // ============== Swich ============== //
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

  // ============== DateTime ============== //
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

  // ============== Picker ============== //
  async onValueChangeCat(value) {
    this.setState({ selecedCat: value });
  }

  // ============== Set Modal View ============== //
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    //Slider
    const { sliderValue } = this.state;

    //Switch
    const { isEnabled, switch1Enabled, switch2Enabled, switch3Enabled } =
      this.state;

    //DateTime
    const { dateTime, showPicker } = this.state;

    //Modal
    const { modalVisible } = this.state;

    // Foreach Timer
    const TimerList = [];
    // Sử dụng forEach để thêm các phần tử vào mảng items
    [...Array(18)].forEach((_, index) => {
      TimerList.push(
        <View>
          <View style={styles.timeArea}>
            <Text style={styles.timeText}>{index}:50</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={this.toggleDatePicker}>
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

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#bfd200", "#aacc00", "#80b918"]}
          style={styles.BackDropTop}
        >
          <SafeAreaView>
            <View style={styles.TitleTopArea}>
              <Text style={styles.TitleTop}>
                {i18next.t("Advance setting")}
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
        <SafeAreaView style={styles.flex}>
          <View style={styles.option}>
            <Text>{i18next.t("Custom")}</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              value={switch1Enabled}
            />
          </View>
          <View style={styles.flex}>
            <View style={styles.option}>
              <Text>{i18next.t("Auto")}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={switch2Enabled}
              />
            </View>
            <View style={[styles.flex, { flexDirection: "row" }]}>
              <Slider
                style={{ width: "80%", height: 40 }}
                minimumValue={50}
                maximumValue={95}
                value={sliderValue}
                onValueChange={this.handleSliderChange}
                onSlidingComplete={this.handleSliderComplete}
                minimumTrackTintColor={"#81BB4D"}
              />
              <Text>{Math.round(sliderValue)}% </Text>
            </View>
          </View>
          <View style={styles.flex}>
            <View style={styles.option}>
              <Text>{i18next.t("Timer")}</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={switch3Enabled}
              />
            </View>
            <View style={[styles.flex, { flexDirection: "row", width: "90%" }]}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={[
                  styles.timer,
                  {
                    backgroundColor: switch3Enabled ? "white" : "#D9D9D9",
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}
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
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    10:00
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    10:05
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      { color: switch3Enabled ? "#333" : "#8A8A8A" },
                    ]}
                  >
                    10:10
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
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
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
  flex: {
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timer: {
    padding: 4,
    marginRight: 10,
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
    marginLeft: 60,
    marginRight: 60,
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
