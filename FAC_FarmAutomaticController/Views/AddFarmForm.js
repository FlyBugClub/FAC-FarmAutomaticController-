import * as React from "react";
import { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import i18next, { languageResources } from "../services/i18next";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class AddFarmForm extends Component {
  OpenCamera = () => {
    console.log("Open Camera");
    this.props.navigation.navigate("CameraCreateNewFarmHouse");
  };

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
                  <Text style={styles.title}>{i18next.t("Create Farm House")}</Text>
                </SafeAreaView>
              </LinearGradient>
              <View style={{ alignItems: "flex-end", right: 40 }}>
                <TouchableOpacity
                  style={styles.btnQrCode}
                  onPress={this.OpenCamera}
                >
                  <Text style={styles.btnQrCodeText}>{i18next.t("Scan Qr code")}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containerContent}>
                <TextInput placeholder={i18next.t("Farm name")} style={styles.input} />
                <TextInput
                  placeholder={i18next.t("Description")}
                  style={styles.textArea}
                  multiline={true}
                />
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
  textLogin: {
    marginLeft: 20,
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
  btnAdd: {
    width: "85%",
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
  textArea: {
    width: "85%",
    height: 100,
    margin: 10,
    backgroundColor: "#edede9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: "top", // Căn văn bản từ trên xuống
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
});
