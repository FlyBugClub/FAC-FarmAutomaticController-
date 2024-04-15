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
      <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
        <Text>{item.itemName}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    let Premium = true;
    const { connect } = this.state;
    const { Farm, selectedFarm, isBottomSheetOpen } = this.state;

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
                      {i18next.t("Farm infomation")}
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
                        <Text style={styles.deviceName}>FARM NAME</Text>
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

                  <ScrollView>
                    <View style={styles.flex}>
                      <View style={styles.deviceNameArea}>
                        <Text style={styles.titleSetting}>
                          {i18next.t("Farm")}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.flex}>
                      <View style={{ width: "90%" }}>
                        <TextInput
                          maxLength={19}
                          placeholder={i18next.t("Farm name")}
                          style={styles.input}
                          onChangeText={(text) =>
                            this.setState({ bc_name: text })
                          }
                        />
                        <TextInput
                          maxLength={99}
                          placeholder={i18next.t("Description")}
                          style={styles.textArea}
                          onChangeText={(text) =>
                            this.setState({ dht_name: text })
                          }
                        />
                      </View>
                    </View>
                    <View style={styles.flex}>
                      <View style={{ width: "90%" }}>
                        <TouchableOpacity style={styles.btnSave}>
                          <Text style={styles.btnSaveText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
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
  input: {
    width: "100%",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 24,
    opacity: 0.9,
    backgroundColor: "#edede9",
  },
  textArea: {
    width: "100%",
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#edede9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: "top", // Căn văn bản từ trên xuống
  },
  btnSave: {
    height: 36,
    backgroundColor: "#2BA84A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSaveText: {
    color: "white",
    fontWeight: "500",
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
});
