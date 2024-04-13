import * as React from "react";
import { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  statusbar,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import i18next, { languageResources } from "../services/i18next";
import MyContext from "../DataContext.js";
import apiUrl from "../apiURL.js";
var flag = false;

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      historyList: [],
    };
  }
  static contextType = MyContext;
  gethistory = async () => {
    // api/history/{id_esp}/{strtimebegin}/{strtimeend}
    //string dateString = "2024-03-21-14-59-59"

    const { dataArray } = this.context;
    const historyList = [];
    const date = new Date();
    // Lấy năm, tháng, ngày, giờ, phút và giây từ đối tượng Date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const timebegin = `2023-${month}-${day}-${hours}-${minutes}-${seconds}`;
    const timeend = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

    var url =
      apiUrl + `history/${dataArray[1]["id_esp"]}/${timebegin}/${timeend}`;
    // console.log(url)
    const response = await fetch(url);
    if (!response.ok) {
      this.setState({ msg: "error" });
      return;
    }
    const json = await response.json();
    Object.values(json[0]["schedule"]).forEach((obj, index) => {
      const history = [];

      history.push(obj["id_equipment"]);

      // Tách chuỗi dựa trên ký tự 'T' để lấy phần ngày và thời gian
      const [datePart, timePart] = obj["datetime"].split("T");

      // Chuyển đổi ngày sang đối tượng Date
      const date = new Date(datePart);

      // Lấy thứ, ngày/tháng/năm và thời gian
      const options = {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      // const weekday = date.toLocaleString('vi-VN', { weekday: 'long' });
      const dateString = date.toLocaleDateString("vi-VN", options);
      const timeString = timePart;

      history.push(dateString);
      // history.push()
      history.push(timeString);

      historyList.push(history);
    });
    // console.log(historyList)
    // console.log(historyList)
    flag = true;
    this.setState({ historyList: historyList });
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.gethistory();
    }, 2000);
  }

  render() {
    let Premium = true;
    const { historyList } = this.state;
    const history = [];
    if (flag) {
      flag = false;
      // Sử dụng forEach để thêm các phần tử vào mảng items
      [...Array(historyList.length)].forEach((_, index) => {
        const timeParts = historyList[index][2].split(".");
        const timeString = timeParts[0];

        history.push(
          <View key={index}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={styles.lineHistoy}>
                {Platform.OS === "ios" && (
                  <>
                    <Text style={{ width: 170 }}>
                      {historyList[index][1]}
                    </Text>
                    <Text style={{ width: 65 }}>
                      {historyList[index][0]}
                    </Text>
                    <Text style={{ width: 72 }}>
                      {timeString}
                    </Text>
                  </>
                )}
                {Platform.OS === "android" && (
                  <>
                    <Text style={{ width: 150 }}>
                      {historyList[index][1]}
                    </Text>
                    <Text style={{ width: 55 }}>
                      {historyList[index][0]}
                    </Text>
                    <Text style={{ width: 60,  }}>
                      {timeString}
                    </Text>
                  </>
                )}
              </View>
              <View
                style={{
                  width: "95%",
                  height: 0.5,
                  backgroundColor: "#D9D9D9",
                  marginBottom: 2,
                }}
              ></View>
            </View>
          </View>
        );
      });
    }

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
          style={[styles.NavigationTop]}
        >
          <SafeAreaView
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.title}>{i18next.t("History")}</Text>
          </SafeAreaView>
        </LinearGradient>
        <View style={styles.body}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                marginTop: 26,
                marginBottom: 10,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Text style={styles.date}>{i18next.t("Date")}</Text>
              <Text style={styles.device}>{i18next.t("Device")}</Text>
              <Text style={styles.time}>{i18next.t("Time")}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {history}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  body: {
    flex: 1,
    top: -23,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  lineHistoy: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
    gap: 15,
  },

  date: {
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontSize: 14,
        width: 170,
        textAlign: "center",
        borderWidth: 1,
      },
      android: {
        fontWeight: "bold",
        fontSize: 14,
        width: 150,
        textAlign: "center",
      },
    }),
  },
  time: {
    ...Platform.select({
      ios: { fontWeight: "bold", fontSize: 14, width: 70, textAlign: "center" },
      android: {
        fontWeight: "bold",
        fontSize: 14,
        width: 60,
        textAlign: "center",
        textAlignVertical: "center",
      },
    }),
  },
  device: {
    ...Platform.select({
      ios: {
        fontWeight: "bold",
        fontSize: 14,
        width: 65,
        textAlign: "center",
      },
      android: {
        fontWeight: "bold",
        fontSize: 14,
        width: 55,
        textAlign: "center",
      },
    }),
  },
});
