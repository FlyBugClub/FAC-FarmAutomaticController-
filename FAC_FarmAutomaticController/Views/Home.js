import * as React from "react";
import { Component, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  // Image,
  // FlatList,
  ScrollView,
  StatusBar,
} from "react-native";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart,
// } from "react-native-chart-kit";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { Icon } from "@rneui/base";
import MyContext from "../DataContext.js";
// import { index } from "d3-array";
// import axios from "axios";
const data = [];
//
export default class Home extends Component {
  LoginPage = () => {
    console.log("Login Page");
    this.props.navigation.navigate("Login");
  };
  SignUpPage = () => {
    console.log("SignUp Page");
    this.props.navigation.navigate("SignUp");
  };
  DetailPage = (index) => {
    console.log(index)
    this.GetEquidmentValues(index);
  };
  
  static contextType = MyContext;
  GetEquidmentValues = async (index) => {
    const { addDataAtIndex } = this.context;
    addDataAtIndex(data[index], 1);
    this.props.navigation.navigate("Details");
  };

  render() {
    const { dataArray } = this.context;
    console.log(dataArray)
    // const jsonObject = JSON.parse(dataArray[1]);
    var keyCount = 0;
    for (const key in dataArray[0]) {
      if (key === "user") {
        break;
      }
      keyCount = keyCount + 1;
    }

    const handleDetailPress = (index) => {
      this.DetailPage(index);
    };
    const farmHouseList = [];
    // Sử dụng forEach để thêm các phần tử vào mảng items
    [...Array(keyCount)].forEach((_, index) => {
      data[index] = Object.values(dataArray[0])[index];
      // console.log(data)
      farmHouseList.push(
        <View key={index}>
          <TouchableOpacity
            style={styles.famrItem}
            onPress={() => handleDetailPress(index)}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.titleItem} numberOfLines={1}>
                {" "}
                Farm {index}: {data[index]["name"]}
              </Text>
              <View style={styles.connectArea}>
                <View style={styles.dot}></View>
                <Text style={{ fontWeight: "bold", marginLeft: 2, marginRight: 2, fontSize: 13}}>Connected</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, marginTop: 5, marginLeft: 4 }}>
              It is a long established fact that a reader will be distracted by
              the readable
            </Text>
            <View style={{flexDirection: 'row', gap: 18, marginTop: 5, marginLeft: 4}}>
                <Text style={{ fontSize: 13, color: '#777777' }}>Humidiry: {data[index]["dht"]}</Text>
                <Text style={{ fontSize: 13, color: '#777777' }}>pH: {data[index]["ph"]}</Text>
                <Text style={{ fontSize: 13, color: '#777777' }}>Water pump: {data[index]["bc"]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View style={styles.safeContainer}>
        <StatusBar backgroundColor="#ebf2f2" barStyle={"dark-content"} />
        <View style={styles.container}>
          <View style={styles.header}>
            <SafeAreaView>
              <Text style={styles.monthText}>March</Text>
              <View style={styles.calendarArea}>
                <View style={styles.calendar}>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ color: "white" }}>Mon</Text>
                    <Text style={styles.dayNumberText}>8</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ color: "white" }}>Tue</Text>
                    <Text style={styles.dayNumberText}>9</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ color: "white" }}>Wed</Text>
                    <Text style={styles.dayNumberText}>10</Text>
                  </View>
                  <View style={[styles.active, { alignItems: "center" }]}>
                    <Text style={{ color: "white" }}>Thu</Text>
                    <Text style={styles.dayNumberText}>11</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ color: "white" }}>Fri</Text>
                    <Text style={styles.dayNumberText}>12</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ color: "white" }}>Sat</Text>
                    <Text style={styles.dayNumberText}>13</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ color: "white" }}>Sun</Text>
                    <Text style={styles.dayNumberText}>14</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </View>
          <View style={styles.body}>
            {/* <MyContext.Consumer>
                    {contextData => {
                    const  message  = contextData;
                    console.log(message)
                    }}
                    </MyContext.Consumer> */}
            <ScrollView
              style={{ height: "73%" }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginTop: 8 }}>
                <View>{farmHouseList}</View>
              </View>
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
    backgroundColor: "#80b918",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  body: {
    width: "90%",
    marginTop: 6,
    justifyContent: "center",
  },
  calendarArea: {
    alignItems: "center",
  },
  calendar: {
    width: "90%",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  active: {
    padding: 3,
    borderWidth: 1.2,
    borderColor: "white",
    borderRadius: 8,
  },
  monthText: {
    marginLeft: 40,
    marginBottom: 12,
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  dayNumberText: {
    fontWeight: "bold",
    marginTop: 5,
    color: "white",
  },
  famrItem: {
    padding: 8,
    marginTop: 8,
    marginBottom: 5,
    borderRadius: 12,
    // backgroundColor: "#ebf2f2",
    backgroundColor: "#fff",
    shadowColor: '#000',
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
