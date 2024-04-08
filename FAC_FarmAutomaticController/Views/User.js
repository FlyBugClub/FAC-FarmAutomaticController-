import * as React from "react";
import { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  NativeModules,
  I18nManager 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import i18next, { languageResources } from "../services/i18next";
import languagesList from "../services/languagesList.json";
import MyContext from "../DataContext";
const screenWidth = Dimensions.get("window").width;
const squareWidth = screenWidth * 0.9;

export default class User extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: "vi",
    };
  }

  changeLng = async (lng) => {
    i18next.changeLanguage(lng);
    this.setState({ selectedLanguage: lng });
    // I18nManager.forceRTL(true);
    // I18nManager.allowRTL(true);
  };

  // ========== Change page ========== //
  PakagePremiumPage = () => {
    console.log("Pakage Premium Page");
    this.props.navigation.navigate("PremiumPakage");
  };

  render() {
    const { dataArray } = this.context;

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
          style={styles.NavigationTop}
        >
          <SafeAreaView
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Text style={styles.title}>{i18next.t("User information")}</Text>
          </SafeAreaView>
        </LinearGradient>
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.userArea}>
            <View>
              <Image
                source={require("../assets/img/avatar_user.jpg")}
                style={styles.avatar}
              />
            </View>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <Text style={styles.textInfo}>
                {i18next.t("Username")}: {dataArray[0]["name"]}
              </Text>
              <Text style={styles.textInfo}>
                Email: {dataArray[0]["gmail"]}
              </Text>
              <Text style={styles.textInfo}>
                {i18next.t("Phone")}: {dataArray[0]["phone_no"]}
              </Text>
            </View>
          </View>
          <ScrollView>
            <View style={styles.settingContent}>
              <Text style={styles.text}>{i18next.t("Language")}</Text>
              <Picker
                selectedValue={this.state.selectedLanguage}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.changeLng(itemValue)
                }
              >
                {Object.keys(languageResources).sort().map((key, index) => (
                  <Picker.Item
                    key={index}
                    label={i18next.t(languagesList[key].nativeName)}
                    value={key}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.line}></View>
            <View style={styles.settingContent}>
              <TouchableOpacity style={styles.btn} onPress={this.PakagePremiumPage}>
                <Text style={[styles.text]}>{i18next.t("Update Pakage")}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line}></View>
            <View style={styles.settingContent}>
              <TouchableOpacity style={styles.btn}>
                <Text style={[styles.text]}>{i18next.t("Sign out")}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line}></View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //Line
  line: {
    borderWidth: 0.5,
    borderColor: "#DEDEDE",
  },
  text: {
    fontSize: 16,
  },
  safeContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },
  userArea: {
    width: "90%",
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 120,
  },
  textInfo: {
    marginTop: 3,
    marginBottom: 3,
    fontSize: 15,
  },
  NavigationTop: {
    width: "100%",
    height: 80,
    backgroundColor: "#73A942",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 23,
    color: "#fff",
    fontWeight: "bold",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  square: {
    width: squareWidth * 0.5,
    height: squareWidth * 0.5,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  circleOutSide: {
    width: 110,
    height: 110,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  circleInSide: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 38,
    fontWeight: "bold",
  },
  picker: {
    width: 170,
    right: -45,
  },
  settingContent: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
  },
  btn: {
    marginTop: 10,
    marginBottom: 10,
  },
});
