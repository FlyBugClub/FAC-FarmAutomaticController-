import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
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
        itemName: "Mango",
      },
      {
        itemName: "Watermelon",
      },
      {
        itemName: "Pink",
      },
    ],
  };

  async onValueChangeCat(value) {
    this.setState({ selecedCat: value });
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#bfd200", "#aacc00", "#80b918"]}
          style={styles.NavigationTop}
        >
          <SafeAreaView
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Text style={styles.title}>Create Farm House</Text>
          </SafeAreaView>
        </LinearGradient>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              width: "83%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              borderRadius: 20,
            }}
          >
            <View>
              <Text>Device</Text>
            </View>

            <View style={{}}>
              <Picker
                style={{ width: 240 }}
                mode="dropdown"
                selectedValue={this.state.selecedCat}
                onValueChange={this.onValueChangeCat.bind(this)}
              >
                {this.state.category.map((item, index) => (
                  <Picker.Item
                    color="#0087f0"
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
          <TouchableOpacity style={styles.btnAdd} onPress={this.OpenCamera}>
            <Text style={styles.btnText}>Scan QR to connect device</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
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
});
