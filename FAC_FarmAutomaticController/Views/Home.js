import * as React from "react";
import { Component, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  RefreshControl,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import i18next, { languageResources } from "../services/i18next";
import apiUrl from "../apiURL.js";
import MyContext from "../DataContext.js";
// import { index } from "d3-array";
// import axios from "axios";
const data = [];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connect: "connected",
      refresh: false,
      listfarm: [],
      msg: "",
      isConnect: {},
    };
  }

  // ========== Change Page ========== //
  SignUpPage = () => {
    console.log("SignUp Page");
    this.props.navigation.navigate("SignUp");
  };

  DetailPage = (index) => {
    // console.log(index)
    this.GetEquidmentValues(index);
  };

  // ========== Fetch Data ========== //
  fetchData = async () => {
    const { dataArray, addDataAtIndex } = this.context;
    // const { route } = this.props;
    // const data = route.params;
    // console.log(dataArray[0]["user"]["gmail"])
    const url = apiUrl + `getfarm/${dataArray[0]["user"]["gmail"]}`;
    const response = await fetch(url);
    // console.log("ok")
    if (!response.ok) {
      this.setState({ msg: "error" });
      return;
    }

    // console.log(url)
    const json = await response.json();
    addDataAtIndex(json[0], 0);
    // console.log("heheaaa");
    this.setState({ listfarm: json[0] });
  };

  fetchIsConnect = async () => {
    const { dataArray } = this.context;
    // const { route } = this.props;
    // const data = route.params;
    const url = apiUrl + `isconect/${dataArray[0]["user"]["id"]}`;
    const response = await fetch(url);
    // console.log("ok")
    if (!response.ok) {
      this.setState({ msg: "error" });
      return;
    }
    // console.log(url)
    const json = await response.json();

    if (dataArray[0]["user"]["id"] !== undefined) {
      this.setState({ isConnect: json["status"] });
    }
  };

  componentWillUnmount() {
    // Dừng vòng lặp khi trang được thoát
    clearInterval(this.intervalId);
    if (this.focusListener) {
      this.focusListener();
    }
  }
  componentDidMount = async () => {
    this.fetchData();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      // console.log("Details screen is focused");
      this.fetchData();
      // Thực hiện các hành động khi trang được focus
    });

    // Lắng nghe sự kiện blur khi trang bị blur

    // this.fetchIsConnect();
    this.intervalId = setInterval(() => {
      const { listfarm } = this.state;
      if (listfarm.length !== 0) {
        this.fetchIsConnect();
      } else this.fetchData();
    }, 3000);
  };

  static contextType = MyContext;
  GetEquidmentValues = async (index) => {
    const { addDataAtIndex } = this.context;
    addDataAtIndex(data[index], 1);
    this.props.navigation.navigate("Details");
  };

  pullMe = () => {
    this.setState({ refresh: true });
    setTimeout(() => {
      this.setState({ refresh: false });
      this.fetchData();
    }, 2000);
  };

  render() {
    const { height } = Dimensions.get("window");
    const { refresh } = this.state;
    const { connect } = this.state;

    const { dataArray } = this.context;
    const { listfarm, isConnect } = this.state;
    const farmHouseList = [];

    var name_user = " ";
    // const jsonObject = JSON.parse(dataArray[1]);
    var keyCount = 0;
    // console.log(listfarm)
    // console.log(isConnect)

    if (listfarm.length !== 0 && isConnect !== undefined) {
      name_user = listfarm["user"]["name"];
      for (const key in listfarm["equipment"]) {
        keyCount = keyCount + 1;
      }
      const handleDetailPress = (index) => {
        this.DetailPage(index);
      };
      // const farmHouseList = [];

      [...Array(keyCount)].forEach((_, index) => {
        data[index] = Object.values(listfarm["equipment"])[index];
        // console.log(data)
        farmHouseList.push(
          <View key={index}>
            <TouchableOpacity
              style={styles.famrItem}
              onPress={() => handleDetailPress(index)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.titleItem} numberOfLines={1}>
                  {" "}
                  Farm {index}: {data[index]["name"]}
                </Text>
                <View style={styles.connectArea}>
                  {isConnect["esp" + index.toString()] === true && (
                    <>
                      <View
                        style={[styles.dot, { backgroundColor: "#80b918" }]}
                      ></View>
                      <Text
                        style={{
                          fontWeight: "bold",
                          marginLeft: 2,
                          marginRight: 2,
                          fontSize: 13,
                        }}
                      >
                        {i18next.t("Connected")}
                      </Text>
                    </>
                  )}
                  {(isConnect["esp" + index.toString()] === false ||
                    isConnect["esp" + index.toString()] === null) && (
                    <>
                      <View
                        style={[styles.dot, { backgroundColor: "#E31C1C" }]}
                      ></View>
                      <Text
                        style={{
                          fontWeight: "bold",
                          marginLeft: 2,
                          marginRight: 2,
                          fontSize: 13,
                        }}
                      >
                        {i18next.t("Disconnected")}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <Text style={{ fontSize: 13, marginTop: 5, marginLeft: 4 }}>
                {data[index]["decription"]}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 18,
                  marginTop: 5,
                  marginLeft: 4,
                }}
              >
                <Text style={{ fontSize: 13, color: "#777777" }}>
                  {i18next.t("Humidity")}: {data[index]["sensor"]["sl_dht"]}
                </Text>
                <Text style={{ fontSize: 13, color: "#777777" }}>
                  {i18next.t("pH")}: {data[index]["sensor"]["sl_ph"]}
                </Text>
                <Text style={{ fontSize: 13, color: "#777777" }}>
                  {i18next.t("Water pump")}: {data[index]["bc"]["sl"]}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      });
    }
    return (
      <View style={styles.safeContainer}>
        <StatusBar backgroundColor="#2BA84A" barStyle={"dark-content"} />

        <View style={styles.container}>
          {/* <LinearGradient
              colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
              style={styles.header}
            >
              <SafeAreaView style={styles.header}>
                <Text style={styles.headerText}>
                  {i18next.t("Hello")}! {name_user}
                </Text>
                <Text style={styles.headerText}>
                  {i18next.t("Have a nice Day")}
                </Text>
              </SafeAreaView>
            </LinearGradient> */}
          <View style={styles.header}>
            <Image
              source={require("../assets/background/greenRoad.jpg")}
              blurRadius={8}
              style={[styles.header]}
            />
            <SafeAreaView style={[styles.weatherView]}>
              <View style={styles.flex}>
                <View>
                  <Image
                    source={require("../assets/img_wearther/sunny.png")}
                    style={{
                      width: 100,
                      height: 100,
                      justifyContent: "center",
                    }}
                  />
                  <Text style={styles.curentTemp}>23°</Text>
                  <Text style={styles.curentTempText}>Parrly sunny</Text>
                </View>
                <View>
                  <View
                    style={[
                      styles.flex,
                      styles.windNotification,
                      { justifyContent: "space-around" },
                    ]}
                  >
                    <View style={[styles.flex, styles.windContent]}>
                      <Image
                        source={require("../assets/img_wearther/wind.png")}
                        style={styles.windIcon}
                      />
                      <Text style={styles.textInWind}>22km</Text>
                    </View>
                    <View style={[styles.flex, styles.windContent]}>
                      <Image
                        source={require("../assets/img_wearther/wind.png")}
                        style={styles.windIcon}
                      />
                      <Text style={styles.textInWind}>18%</Text>
                    </View>
                    <View style={[styles.flex, styles.windContent]}>
                      <Image
                        source={require("../assets/img_wearther/wind.png")}
                        style={styles.windIcon}
                      />
                      <Text style={styles.textInWind}>6:30 AM</Text>
                    </View>
                  </View>
                  <View style={styles.forecastView}>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <Image
                        source={require("../assets/img/calendar.png")}
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: "white",
                        }}
                      />
                      <Text style={[styles.color_w]}>Daily forecast</Text>
                    </View>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={styles.dailyForecasrView}
                    >
                      <View style={{ flexDirection: "row", gap: 15 }}>
                        <View
                          style={[styles.bgWeatherForecast, { marginTop: 10 }]}
                        >
                          <Image
                            source={require("../assets/img_wearther/rainy.png")}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Text
                            style={[
                              styles.color_w,
                              {
                                fontSize: 12,
                                fontWeight: "200",
                                textAlign: "center",
                              },
                            ]}
                          >
                            Monday
                          </Text>
                          <Text
                            style={[
                              styles.color_w,
                              { textAlign: "center", marginTop: 5 },
                            ]}
                          >
                            21°
                          </Text>
                        </View>
                        <View
                          style={[styles.bgWeatherForecast, { marginTop: 10 }]}
                        >
                          <Image
                            source={require("../assets/img_wearther/rainy.png")}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Text
                            style={[
                              styles.color_w,
                              {
                                fontSize: 12,
                                fontWeight: "200",
                                textAlign: "center",
                              },
                            ]}
                          >
                            Monday
                          </Text>
                          <Text
                            style={[
                              styles.color_w,
                              { textAlign: "center", marginTop: 5 },
                            ]}
                          >
                            21°
                          </Text>
                        </View>
                        <View
                          style={[styles.bgWeatherForecast, { marginTop: 10 }]}
                        >
                          <Image
                            source={require("../assets/img_wearther/rainy.png")}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Text
                            style={[
                              styles.color_w,
                              {
                                fontSize: 12,
                                fontWeight: "200",
                                textAlign: "center",
                              },
                            ]}
                          >
                            Monday
                          </Text>
                          <Text
                            style={[
                              styles.color_w,
                              { textAlign: "center", marginTop: 5 },
                            ]}
                          >
                            21°
                          </Text>
                        </View>
                        <View
                          style={[styles.bgWeatherForecast, { marginTop: 10 }]}
                        >
                          <Image
                            source={require("../assets/img_wearther/rainy.png")}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Text
                            style={[
                              styles.color_w,
                              {
                                fontSize: 12,
                                fontWeight: "200",
                                textAlign: "center",
                              },
                            ]}
                          >
                            Monday
                          </Text>
                          <Text
                            style={[
                              styles.color_w,
                              { textAlign: "center", marginTop: 5 },
                            ]}
                          >
                            21°
                          </Text>
                        </View>
                        <View
                          style={[styles.bgWeatherForecast, { marginTop: 10 }]}
                        >
                          <Image
                            source={require("../assets/img_wearther/rainy.png")}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Text
                            style={[
                              styles.color_w,
                              {
                                fontSize: 12,
                                fontWeight: "200",
                                textAlign: "center",
                              },
                            ]}
                          >
                            Monday
                          </Text>
                          <Text
                            style={[
                              styles.color_w,
                              { textAlign: "center", marginTop: 5 },
                            ]}
                          >
                            21°
                          </Text>
                        </View>
                        <View
                          style={[styles.bgWeatherForecast, { marginTop: 10 }]}
                        >
                          <Image
                            source={require("../assets/img_wearther/rainy.png")}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Text
                            style={[
                              styles.color_w,
                              {
                                fontSize: 12,
                                fontWeight: "200",
                                textAlign: "center",
                              },
                            ]}
                          >
                            Monday
                          </Text>
                          <Text
                            style={[
                              styles.color_w,
                              { textAlign: "center", marginTop: 5 },
                            ]}
                          >
                            21°
                          </Text>
                        </View>
                        <View
                          style={[styles.bgWeatherForecast, { marginTop: 10 }]}
                        >
                          <Image
                            source={require("../assets/img_wearther/rainy.png")}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Text
                            style={[
                              styles.color_w,
                              {
                                fontSize: 12,
                                fontWeight: "200",
                                textAlign: "center",
                              },
                            ]}
                          >
                            Monday
                          </Text>
                          <Text
                            style={[
                              styles.color_w,
                              { textAlign: "center", marginTop: 5 },
                            ]}
                          >
                            21°
                          </Text>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </View>

          {farmHouseList.length !== 0 && (
            <View style={styles.body}>
              <Text style={styles.littleTitle}>Farm house</Text>
              <ScrollView
                style={{ height: height > 1000 ? "82%" : "70%" }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={this.pullMe}
                  />
                }
              >
                <View style={{ marginTop: 8 }}>{farmHouseList}</View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  color_w: {
    color: "white",
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: 230,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#80b918",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    zIndex: 0,
  },
  headerText: {
    ...Platform.select({
      ios: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
      },
      android: {
        fontSize: 23,
        fontWeight: "bold",
        color: "white",
      },
    }),
  },

  // ========== Weather ========== //
  weatherView: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  curentTemp: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  curentTempText: {
    color: "white",
    fontSize: 14,
    fontWeight: "200",
    textAlign: "center",
  },
  windNotification: {
    width: "85%",
    gap: 10,
  },
  windContent: {
    gap: 5,
  },
  windIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  textInWind: {
    color: "white",
  },
  forecastView: {
    backgroundColor: "gray",
    width: 300,
    marginTop: 8,
  },
  dailyForecasrView: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "white"
  },
  bgWeatherForecast: {
    backgroundColor: "rgba(255,255,255,0.20)",
    padding: 6,
    borderRadius: 12,
  },

  // ==========  ========== //
  body: {
    width: "90%",
    marginTop: 6,
    justifyContent: "center",
  },
  littleTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 18,
    color: "#2BA84A",
  },
  famrItem: {
    padding: 8,
    marginTop: 8,
    marginBottom: 5,
    borderRadius: 12,
    // backgroundColor: "#ebf2f2",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  titleItem: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    // overflow: "hidden",
  },
  connectArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
  },
  dot: {
    width: 7,
    height: 7,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 12,
  },
});
