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
  
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@rneui/base";
import AnDesign from "react-native-vector-icons/MaterialCommunityIcons";
import { bounds } from "@shopify/react-native-skia";
import { index } from "d3-array";

export default class History extends Component {
  render() {
    let Premium = true;
    const historyList = [];
    // Sử dụng forEach để thêm các phần tử vào mảng items
    [...Array(30)].forEach((_, index) => {
      historyList.push(
        <View key={index}>
          <View style={{alignItems: "center", justifyContent: "center"}}>
            <View style={styles.lineHistoy}>
              <Text>Saturday, 30 March 2024</Text>
              <Text>Water pump 4</Text>
              <Text>09:42:18</Text>
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

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#bfd200", "#aacc00", "#80b918"]}
          style={styles.NavigationTop}
        >
          <SafeAreaView
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Text style={styles.title}>History</Text>
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
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 14, marginLeft: 70 }}
              >
                Date
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 14, marginLeft: 110 }}
              >
                Device
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 14, marginLeft:55 }}
              >
                Time
              </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {historyList}
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
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#73A942",
  },
  title: {
    marginTop: -25,
    textAlign: "center",
    fontSize: 23,
    color: "#fff",
    fontWeight: "bold",
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
});
