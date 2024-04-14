import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
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
import MyContext from "../DataContext.js";
import apiUrl from "../apiURL.js";
import AppLoader2 from "./AppLoader2.js";

export default class AddDevice extends Component {
  OpenCamera = () => {
    console.log("Open Camera");
    this.props.navigation.navigate("CameraConnectDevice");
  };

  state = {
    msg: "",
    selecedCat: "",
    dht_name: "",
    ph_name: "",
    bc_name: "",
    selectedLanguage: "",
    category: [],
    dht_id: "",
    ph_id: "",
    bc_id: "",
  };

  async onValueChangeCat(value) {
    this.setState({ selecedCat: value });
  }

  static contextType = MyContext;

  componentDidMount() {
    const { route } = this.props;
    const { id_bc, id_dht, id_ph } = route.params || {};

    this.setState({ bc_id: id_bc });
    this.setState({ dht_id: id_dht });
    this.setState({ ph_id: id_ph });
    this.getFarm();
  }
  getFarm = () => {
    const { dataArray } = this.context;
    const Farmlist = [];
    Object.values(dataArray[0]["equipment"]).forEach((obj, index) => {
      const farm = {};
      // console.log(obj["name_esp"])
      farm["itemName"] = obj["name"];
      Farmlist.push(farm);
      // console.log(obj["name"])
    });
    this.setState({ category: Farmlist });
  };
  // console.log(dataArray[0])
  createEquip = async () => {
    // Hiển thị loading
    this.setState({ isLoading: true });

    const { dataArray } = this.context;
    const { dht_name, ph_name, bc_name, selecedCat, ph_id, dht_id, bc_id } =
      this.state;
    // console.log(selecedCat)
    if (dht_id !== "") {
      if (selecedCat !== "") {
        this.setState({ msg: "" });
        if (bc_name !== "") {
          this.setState({ msg: "" });
          if (dht_name !== "") {
            this.setState({ msg: "" });
            if (ph_name !== "") {
              this.setState({ msg: "" });
              var id_esp = "";
              Object.values(dataArray[0]["equipment"]).forEach((obj, index) => {
                const farm = {};
                if (obj["name"] === selecedCat) {
                  id_esp = obj["id_esp"];
                }
              });
              const body = {
                id_esp: id_esp,
                id_sensor: dht_id,
                name_sensor: dht_name,
                expectedValues: 50.0,
                min_max_values: "60/90",
              };
              var result_dht = await this.postfunction("sensormanager", body);
              // console.log(result_dht)
              if (result_dht === "success") {
                const body_ph = {
                  id_esp: id_esp,
                  id_sensor: ph_id,
                  name_sensor: ph_name,
                  expectedValues: 50.0,
                  min_max_values: "5/10",
                };
                var result_ph = await this.postfunction(
                  "sensormanager",
                  body_ph
                );
                console.log(result_ph);
                if (result_ph === "success") {
                  const body_bc = {
                    id_esp: id_esp,
                    id_equipment: bc_id,
                    name_equipment: bc_name,
                    automode: 0,
                    id_sensor: dht_id + "/" + ph_id,
                  };
                  var result_bc = await this.postfunction(
                    "equidmentmanager",
                    body_bc
                  );
                  console.log(result_bc);
                  if (result_bc === "success") {
                    this.props.navigation.navigate("Home");
                  }
                }
              }
              // if (result) {
              //   if (result == "Success") {
              //     console.log("ok")
              //

              //   } else if (result["Message"] == "sensor is already usee") {
              //     this.setState({ msg: "this equipment is already use" });
              //   } else this.setState({ msg: "some thing is wrong" });
              // }

              this.setState({ isLoading: false });
            } else
              this.setState({ msg:  "The ph sensor has not yet been named" });
          } else
            this.setState({ msg: "The dht sensor has not yet been named" });
        } else this.setState({ msg: "The pump has not yet been named" });
      } else this.setState({ msg: "choose farm" });
    } else this.setState({ msg: "scan qr code again" });
  };

  postfunction = async (route, body) => {
    const url = apiUrl + route;
    let result = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // body: JSON.stringify({
      //   id_esp: id_esp,
      //   id_sensor : dht_id,
      //   name_sensor: dht_name,
      //   expectedValues: 50.0,
      //   min_max_values: "60/90"
      // }),
    });
    result = await result.json();

    return result;
  };

  render() {
    const { isLoading } = this.state;
    
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#2BA84A" />
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={styles.container}
          >
            <View>
              <LinearGradient
                colors={["#2BA84A", "#2BA84A", "#2BA84A"]}
                style={styles.NavigationTop}
              >
                <SafeAreaView
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={styles.title}>{i18next.t("Add Device")}</Text>
                </SafeAreaView>
              </LinearGradient>
              <View style={{ alignItems: "flex-end", right: 40 }}>
                <TouchableOpacity
                  style={styles.btnQrCode}
                  onPress={this.OpenCamera}
                >
                  <Text style={styles.btnQrCodeText}>
                    {i18next.t("Scan Qr code")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.containerContent}>
                <TextInput
                  placeholder={i18next.t("pump name")}
                  style={styles.input}
                  onChangeText={(text) => this.setState({ bc_name: text })}
                />
                <TextInput
                  placeholder={i18next.t("humid sensor name")}
                  style={styles.input}
                  onChangeText={(text) => this.setState({ dht_name: text })}
                />
                <TextInput
                  placeholder={i18next.t("ph sensor name")}
                  style={styles.input}
                  onChangeText={(text) => this.setState({ ph_name: text })}
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
                <Text>{i18next.t(this.state.msg)}</Text>
              </View>
              {isLoading && <AppLoader2 />}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  style={styles.btnAdd}
                  onPress={this.createEquip}
                >
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
    ...Platform.select({
      ios: {
        width: "100%",
        height: "21.3%",
        backgroundColor: "#73A942",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
      },
      android: {
        width: "100%",
        height: "14%",
        backgroundColor: "#73A942",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
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
    marginTop: 28,
        },
        android: {
            textAlign: "center",
            fontSize: 23,
            color: "#fff",
            fontWeight: "bold",
        }
    })
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
    backgroundColor: "#2BA84A",
    borderRadius: 20,
  },
  btnQrCodeText: {
    color: "white",
  },
  btnAdd: {
    width: "83%",
    height: 40,
    margin: 10,
    backgroundColor: "#2BA84A",
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
