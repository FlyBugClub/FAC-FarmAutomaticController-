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
          colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
          style={styles.NavigationTop}
        >
          <SafeAreaView
            style={{ alignItems: "center", justifyContent: "center" }}
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
                width: "95%",
                marginTop: 26,
                marginBottom: 10,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 14, width: 155, textAlign: 'center'}}
              >
                {i18next.t("Date")}
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 14, width: 150, textAlign: 'center'}}
              >
                {i18next.t("Device")}
              </Text>
              {Platform.OS ==='android' && (
                <Text
                style={{ fontWeight: "bold", fontSize: 14, width: 70, textAlign: 'center' }}
              >
                {i18next.t("Time")}
              </Text>
              )}
              {Platform.OS ==='ios' && (
                <Text
                style={{ fontWeight: "bold", fontSize: 14, width: 65, textAlign: 'center' }}
              >
                {i18next.t("Time")}
              </Text>
              )}
              
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
