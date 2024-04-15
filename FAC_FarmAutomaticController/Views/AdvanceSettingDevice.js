import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
  Switch,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import i18next from "../services/i18next";
import * as Notifications from "expo-notifications";

export default class AdvanceSettingDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connect: "connected",
      sliderValue: 50,
      isBottomSheetOpen: false,

      // ===== Switch ===== //
      switch1Enabled: false,
      switch2Enabled: true,
      switch3Enabled: false,

      // ===== DateTime ===== //
      dateTime: new Date(),
      showPicker: false,

      // ===== Modal ==== //
      modalVisible: false,

      // ===== Picker Change Farm =====//
      selectedFarm: "",
      Farm: [
        {
          itemName: "Farm 0",
        },

        {
          itemName: "Farm 1",
        },
      ],
    };
    this.snapPoint = ["25%", "50%", "75%"];
    this.bottomSheetRef = React.createRef();
  }

  // ============== Bottom Sheet ============== //
  handleClosePress = () => this.bottomSheetRef.current?.close();
  handleOpenPress = () => this.bottomSheetRef.current?.expand();

  // Phương thức mở hoặc đóng BottomSheet
  toggleBottomSheet = () => {
    this.setState(
      (prevState) => ({ isBottomSheetOpen: !prevState.isBottomSheetOpen }),
      () => {
        if (this.state.isBottomSheetOpen) {
          this.bottomSheetRef.current.expand();
        } else {
          this.bottomSheetRef.current.close();
        }
      }
    );
  };

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

  // ============== Picker Change Farm ============== //
  async onValueChangeFarm(value) {
    flag = true;
    this.setState({ selectedFarm: value });
  }

  // ============== Flatlist Change Farm ============== //
  // Hàm xử lý khi chọn một farm
  handleFarmSelect = (farm) => {
    this.setState({ selectedFarm: farm });
  };

  // Render mỗi mục trong danh sách farm
  renderFarmItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.handleFarmSelect(item.itemName)}>
      <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text>{item.itemName}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    let Premium = true;
    const { connect } = this.state;
    const { Farm, selectedFarm, isBottomSheetOpen } = this.state;

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
            <Text style={styles.timeText}>{index}:50 - 5s</Text>
            <View style={{ flexDirection: "row" }}>
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
        <GestureHandlerRootView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              style={styles.container}
            >
              <View style={styles.container}>
                <LinearGradient
                  colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
                  style={styles.NavigationTop}
                >
                  <SafeAreaView
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.title}>
                      {i18next.t("Advance setting")}
                    </Text>
                  </SafeAreaView>
                </LinearGradient>
                <View style={styles.content}>
                  <View style={styles.flex}>
                    <View style={styles.deviceNameArea}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.deviceName}>DEVICE NAME</Text>
                        <View style={styles.connectArea}>
                          {connect === "connected" && (
                            <>
                              <View
                                style={[
                                  styles.dot,
                                  { backgroundColor: "#80b918" },
                                ]}
                              ></View>
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  marginLeft: 2,
                                  marginRight: 2,
                                  fontSize: 14,
                                }}
                              >
                                {i18next.t("Connected")}
                              </Text>
                            </>
                          )}
                          {connect === "disconnected" && (
                            <>
                              <View
                                style={[
                                  styles.dot,
                                  { backgroundColor: "#E31C1C" },
                                ]}
                              ></View>
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  marginLeft: 2,
                                  marginRight: 2,
                                  fontSize: 14,
                                }}
                              >
                                {i18next.t("Disconneted")}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View>
                    <View style={styles.flex}>
                      <View style={styles.deviceNameArea}>
                        <Text style={styles.titleSetting}>
                          {i18next.t("Device")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.flex}>
                      <View style={styles.option}>
                        <View
                          style={[
                            styles.optionPart,
                            { marginBottom: 6, marginTop: 6 },
                          ]}
                        >
                          <Text>{i18next.t("Farm")}</Text>
                          {Platform.OS === "android" && (
                            <Picker
                              style={{ width: 180 }}
                              mode="dropdown"
                              selectedValue={this.state.selectedFarm}
                              onValueChange={this.onValueChangeFarm.bind(this)}
                            >
                              {this.state.Farm.map((item, index) => (
                                <Picker.Item
                                  color="#333"
                                  label={item.itemName}
                                  value={item.itemName}
                                  index={index}
                                />
                              ))}
                            </Picker>
                          )}
                          {Platform.OS === "ios" && (
                            <TouchableOpacity
                              style={styles.changeFarmArea}
                              // onPress={this.handleOpenPress}
                              onPress={this.toggleBottomSheet}
                            >
                              <Text style={styles.text}>{selectedFarm || 'Farm 1'}</Text>
                              <Image
                                source={require("../assets/img/down.png")}
                                style={{
                                  width: 12,
                                  height: 12,
                                  tintColor: "#767577",
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={styles.flex}>
                      <View style={styles.deviceNameArea}>
                        <Text style={styles.titleSetting}>
                          {i18next.t("Setting")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.flex}>
                      <View style={styles.option}>
                        <View style={styles.optionPart}>
                          <Text>{i18next.t("Custom")}</Text>
                          <Switch
                            trackColor={{ false: "#767577", true: "#2BA84A" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            value={switch1Enabled}
                            style={styles.switch}
                          />
                        </View>
                      </View>
                      <View style={styles.option}>
                        <View style={styles.optionPart}>
                          <Text>{i18next.t("Auto")}</Text>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Slider
                              style={{ flex: 1 }}
                              minimumValue={50}
                              maximumValue={95}
                              value={sliderValue}
                              onValueChange={this.handleSliderChange}
                              onSlidingComplete={this.handleSliderComplete}
                              minimumTrackTintColor={"#81BB4D"}
                              thumbTintColor={"#81BB4D"}
                            />
                            <Text>{Math.round(sliderValue)}% </Text>
                          </View>
                          <Switch
                            trackColor={{ false: "#767577", true: "#2BA84A" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            value={switch2Enabled}
                            style={styles.switch}
                          />
                        </View>
                      </View>
                      <View style={styles.option}>
                        <View style={styles.optionPart}>
                          <Text>{i18next.t("Timer")}</Text>
                          <Switch
                            trackColor={{ false: "#767577", true: "#2BA84A" }}
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            value={switch3Enabled}
                            style={styles.switch}
                          />
                        </View>
                        <View
                          style={[
                            styles.flex,
                            { flexDirection: "row", marginBottom: 8 },
                          ]}
                        >
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
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                              }}
                              onPress={() => this.setModalVisible(true)}
                            >
                              {/* Data time */}
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
                                ]}
                              >
                                09:35
                              </Text>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
                                ]}
                              >
                                09:40
                              </Text>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
                                ]}
                              >
                                09:45
                              </Text>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
                                ]}
                              >
                                09:50
                              </Text>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
                                ]}
                              >
                                09:55
                              </Text>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
                                ]}
                              >
                                10:00
                              </Text>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
                                ]}
                              >
                                10:05
                              </Text>
                              <Text
                                style={[
                                  styles.time,
                                  {
                                    color: switch3Enabled ? "#333" : "#8A8A8A",
                                  },
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
                                <SafeAreaView style={styles.modalTopArea}>
                                  <Text style={styles.timerTitleText}>
                                    {i18next.t("Timer")}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => this.setModalVisible(false)}
                                  >
                                    <Image
                                      source={require("../assets/img/x.png")}
                                      style={styles.closeModalTimer}
                                    />
                                  </TouchableOpacity>
                                </SafeAreaView>

                                <ScrollView
                                  showsVerticalScrollIndicator={false}
                                >
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
                        {Premium === true && (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <View style={styles.optionPart}>
                                <View
                                  style={[styles.flex, styles.inputTimeArea]}
                                >
                                  <Text>{i18next.t("Set time")}:</Text>
                                  <TextInput
                                    placeholder="HH"
                                    style={styles.inputTime}
                                  />
                                  <Text>{i18next.t("Hour")}</Text>
                                  <TextInput
                                    placeholder="mm"
                                    style={styles.inputTime}
                                  />
                                  <Text>{i18next.t("Minuts")}</Text>
                                </View>
                              </View>
                              <View style={styles.optionPart}>
                                <View
                                  style={[styles.flex, styles.inputTimeArea]}
                                >
                                  <Text>{i18next.t("Set duration")}:</Text>
                                  <TextInput
                                    placeholder="ss"
                                    style={styles.inputTime}
                                  />
                                  <Text>{i18next.t("Seconds")}</Text>
                                </View>
                              </View>
                            </View>
                            <TouchableOpacity style={styles.btnPlus}>
                              <Image
                                source={require("../assets/img/plus.png")}
                                style={styles.plusIcon}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                {Platform.OS === "ios" && (
                  <BottomSheet
                    ref={this.bottomSheetRef}
                    snapPoints={this.snapPoint}
                    enablePanDownToClose={true}
                    index={this.state.isBottomSheetOpen ? 0 : -1}
                  >
                    <View>
                      <Text
                        style={{ color: "gray", fontSize: 20, marginLeft: 10 }}
                      >
                        {i18next.t("Farm")}
                      </Text>
                      <FlatList
                        style={{ marginBottom: 50 }}
                        data={Farm}
                        renderItem={this.renderFarmItem}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </BottomSheet>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    ...Platform.select({
      ios: {
        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  NavigationTop: {
    ...Platform.select({
      ios: {
        width: "100%",
        height: "18%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#73A942",
      },
      android: {
        width: "100%",
        height: "14%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#73A942",
      },
    }),
  },
  title: {
    ...Platform.select({
      ios: {
        textAlign: "center",
        fontSize: 23,
        color: "#fff",
        fontWeight: "bold",
        marginTop: 5,
      },
      android: {
        textAlign: "center",
        marginTop: -25,
        fontSize: 23,
        color: "#fff",
        fontWeight: "bold",
      },
    }),
  },
  content: {
    flex: 1,
    top: -23,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  deviceNameArea: {
    width: "90%",
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  titleSetting: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: -5,
    fontWeight: "500",
    color: "#333",
  },
  option: {
    ...Platform.select({
      ios: {
        padding: 8,
      },
      android: {
        paddingLeft: 8,
        paddingRight: 8,
      },
    }),
    width: "90%",
    marginTop: 6,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  optionPart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  changeFarmArea: {
    gap: 18,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
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
    ...Platform.select({
      ios: {
        marginLeft: 10,
        marginRight: 10,
      },
      android: {
        marginLeft: 60,
        marginRight: 60,
      },
    }),
  },
  inputTimeArea: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    gap: 5,
  },
  inputTime: {
    width: 40,
    height: 23,
    textAlign: "center",
    borderRadius: 4,
    backgroundColor: "#edede9",
    // borderWidth: 1,
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

  // ========== Connect Status ==========//
  connectArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
  dot: {
    width: 7,
    height: 7,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 12,
  },

  // ========== Modal Area ==========//
  modalTopArea: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeModalTimer: {
    width: 20,
    height: 20,
    marginRight: 20,
    tintColor: "#DEDEDE",
  },
  timerTitleText: {
    fontSize: 23,
    fontWeight: "800",
    marginLeft: 20,
  },
});
