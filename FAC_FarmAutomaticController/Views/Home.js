import * as React from "react";
import { Component, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  RefreshControl,
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
      refresh: false,
      listfarm: [],
    };
  }
  SignUpPage = () => {
    console.log("SignUp Page");
    this.props.navigation.navigate("SignUp");
  };

  fetchData = async () => {
    const { dataArray } = this.context;
    const url =
      apiUrl +
      `login/${dataArray[0]["user"]["gmail"]}/${dataArray[0]["user"]["password"]}`;
    const response = await fetch(url);
    if (!response.ok) {
      this.setState({ msg: "error" });
      return;
    }
    const json = await response.json();
    console.log("heheaaa");
    this.setState({ listfarm: json[0] });
  };

  componentDidMount = async () => {
    const { dataArray } = this.context;
    const url =
      apiUrl +
      `login/${dataArray[0]["user"]["gmail"]}/${dataArray[0]["user"]["password"]}`;
    const response = await fetch(url);
    if (!response.ok) {
      this.setState({ msg: "error" });
      return;
    }
    const json = await response.json();
    // console.log(json[0])
    console.log("heheaaa");
    this.setState({ listfarm: json[0] });
  };

  DetailPage = (index) => {
    console.log(index);
    this.GetEquidmentValues(index);
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
    const { refresh } = this.state;

    const { dataArray } = this.context;
    const { listfarm } = this.state;
    const farmHouseList = [];
    // const jsonObject = JSON.parse(dataArray[1]);
    var keyCount = 0;
    if (listfarm.length !== 0) {
      // console.log("jaajaj")
      // console.log(listfarm)
      for (const key in listfarm["equipment"]) {
        keyCount = keyCount + 1;
      }
      const handleDetailPress = (index) => {
        this.DetailPage(index);
      };
      // const farmHouseList = [];
      // Sử dụng forEach để thêm các phần tử vào mảng items
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
                  <View style={styles.dot}></View>
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
                  {i18next.t('Humidity')}: {data[index]["sensor"]["sl_dht"]}
                </Text>
                <Text style={{ fontSize: 13, color: "#777777" }}>
                {i18next.t('pH')}: {data[index]["sensor"]["sl_ph"]}
                </Text>
                <Text style={{ fontSize: 13, color: "#777777" }}>
                {i18next.t('Water pump')}: {data[index]["bc"]["sl"]}
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
          <LinearGradient
            colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
            style={styles.header}
          >
            <SafeAreaView style={styles.header}>
              <Text style={styles.headerText}>
                {i18next.t("Hello")}! {dataArray[0]["user"]["name"]}
              </Text>
              <Text style={styles.headerText}>
                {i18next.t("Have a nice Day")}
              </Text>
            </SafeAreaView>
          </LinearGradient>
          <View style={styles.body}>
            <ScrollView
              style={{ height: "73%" }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={this.pullMe} />
              }
            >
              <View style={{ marginTop: 8 }}>{farmHouseList}</View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    height: 150,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#80b918",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
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
  body: {
    width: "90%",
    marginTop: 6,
    justifyContent: "center",
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
    backgroundColor: "#80b918",
    borderRadius: 12,
  },
});
