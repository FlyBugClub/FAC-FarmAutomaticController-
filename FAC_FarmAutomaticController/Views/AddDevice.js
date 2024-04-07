import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import i18next, { languageResources } from "../services/i18next";
import { index } from "d3";

export default class AddDevice extends Component {
  OpenCamera = () => {
    console.log("Open Camera");
    this.props.navigation.navigate("CameraConnectDevice");
  };

  state = {
    selecedCat: "",
    selectedLanguage: "",
    category: [
      {
        itemName: "Farm 0",
      },
      {
        itemName: "Farm 1",
      },
      {
        itemName: "Farm 2",
      },
    ],
  };

  async onValueChangeCat(value) {
    this.setState({ selecedCat: value });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#bfd200" />
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={styles.container}
          >
            <View>
              <LinearGradient
                colors={["#bfd200", "#aacc00", "#80b918"]}
                style={styles.NavigationTop}
              >
                <SafeAreaView
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={styles.title}>{i18next.t("Add Device")}</Text>
                </SafeAreaView>
              </LinearGradient>
              <View style={{ alignItems: "flex-end", right: 40 }}>
                {/* <TouchableOpacity
                  style={styles.btnQrCode}
                  onPress={this.OpenCamera}
                >
                  <Text style={styles.btnQrCodeText}>
                    {i18next.t("Scan Qr code")}
                  </Text>
                </TouchableOpacity> */}
              </View>
              <View style={styles.containerContent}>
                <TextInput
                  placeholder={i18next.t("ID device")}
                  style={styles.input}
                />
                <TextInput
                  placeholder={i18next.t("Device name")}
                  style={styles.input}
                />
                <View style={styles.optionArea}>
                  <View>
                    <Text style={{ color: "" }}>{i18next.t("Farm house")}</Text>
                  </View>
                  <View>
                    <Picker
                      style={{ width: 220 }}
                      mode="dropdown"
                      selectedValue={this.state.selecedCat}
                      onValueChange={this.onValueChangeCat.bind(this)}
                    >
                      {this.state.category.map((item, index) => (
                        <Picker.Item
                          color="#333"
                          label={item.itemName}
                          value={item.itemName}
                          index={index}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity style={styles.btnAdd}>
                  <Text style={styles.btnText}>{i18next.t("Create")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  containerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  NavigationTop: {
    width: "100%",
    height: 90,
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
  input: {
    width: "85%",
    height: 40,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 24,
    opacity: 0.9,
    backgroundColor: "#edede9",
  },
  btnQrCode: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#80b918",
    borderRadius: 20,
  },
  btnQrCodeText: {
    color: "white",
  },
  btnAdd: {
    width: "83%",
    height: 40,
    margin: 10,
    backgroundColor: "#80b918",
    justifyContent: "center",
    borderRadius: 20,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  optionArea: {
    width: "83%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#edede9",
    paddingLeft: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 16,
    elevation: 1,
  },
});
