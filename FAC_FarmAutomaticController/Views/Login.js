// import * as React from 'react';
import { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Statusbar,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MyContext from "../DataContext.js";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MIcon from "react-native-vector-icons/MaterialIcons";
import i18next, { languageResources } from "../services/i18next";
import { Ionicons } from "@expo/vector-icons";
import apiUrl from "../apiURL.js";
import AppLoader from "./AppLoader.js";

const data = [];
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      email: "admin@gmail.com",
      password: "123456",
      isChecked: false,
      secureTextEntry: true,
      status: "Show password",
      
    };
  }
  toggleCheckbox = () => {
    this.setState((prevState) => ({
      isChecked: !prevState.isChecked,
    }));
    const { isChecked } = this.state;
    if (isChecked) {
      this.setState({ status: "Show password" });
      this.setState({ secureTextEntry: true });
    } else {
      this.setState({ status: "Hide password" });
      this.setState({ secureTextEntry: false });
    }
  };
  static contextType = MyContext;
  //   handleLogin = async () => {
  //     var erorr = true;
  //     const { email, password } = this.state;
  //     const { addDataAtIndex } = this.context;
  //     const url = apiUrl+`login/${email}/${password}`;
  //     await fetch(url)
  //         .then(res=>{
  //             if (!res.ok) {
  //                 this.setState({ msg: "error" });
  //                 erorr = false;
  //             }
  //             return res.json();
  //           })
  //         .then((json)=>{
  //             if (json != null && erorr)
  //             {
  //                 const combinedJson = Object.assign({}, json[0], json[1]);

  //                 addDataAtIndex(combinedJson,0);
  //                 this.setState({ msg: "" });
  //                 this.props.navigation.navigate('TabNavigator');
  //             }
  //             else this.setState({ msg: "email or password are incorect" });

  //         });

  //   };
  handleLogin = async () => {
    const { email, password } = this.state;
    const { addDataAtIndex } = this.context;
    const url = apiUrl + `login/${email}/${password}`;

    // Hiển thị loading
  this.setState({ isLoading: true });

    try {
      if (email != "" && password != "") {
        const response = await fetch(url);
        if (!response.ok) {
          this.setState({ msg: "error" });
          return;
        }

        const json = await response.json();
        // console.log(json)
        // console.log("hehe")

        if (json != null) {
          // const combinedJson = Object.assign({}, json[0], json[1],json[2]);
          addDataAtIndex(json[0], 0);
          this.setState({ msg: "" });
          this.props.navigation.navigate("TabNavigator");
        } else {
          this.setState({ msg: i18next.t("email or password are incorrect")});
        }
      } else this.setState({ msg: i18next.t("email or password are incorrect") });
    } catch (error) {
      console.error("Error handling login:", error);
      this.setState({ msg: i18next.t("An error occurred") });
    }
    
    this.setState({ isLoading: false });
  };



  HomePage = () => {
    this.props.navigation.navigate("Home");
  };
  SignUpPage = () => {
    this.props.navigation.navigate("SignUp");
  };
  ResetPasswordPage = () => {
    this.props.navigation.navigate("ForgotPassword");
  };
  ChangePassPage = () => {
    this.props.navigation.navigate("PremiumPakage");
  };
  render() {
    const { msg, secureTextEntry, status } = this.state;
    const { isChecked } = this.state;
    const { isLoading } = this.state;

    return (
      <>
        <SafeAreaView style={styles.container}>
          <Image
            source={require("../assets/img/user-login.png")}
            style={styles.img}
          />
          <Text style={styles.textLogin}>{i18next.t("Login")}</Text>
          <View style={styles.inputArea}>
            <MCIcon name="email" size={28} color={"#2BA84A"} />
            <Text style={{ color: "#2BA84A", marginLeft: 4, marginRight: 2 }}>
              |
            </Text>
            <TextInput
              style={styles.inputAccount}
              placeholder="Email"
              onChangeText={(text) => this.setState({ email: text })}
            />
          </View>
          <View style={styles.inputArea}>
            <MIcon name="password" size={28} color={"#2BA84A"} />
            <Text style={{ color: "#2BA84A", marginLeft: 4, marginRight: 2 }}>
              |
            </Text>
            <TextInput
              style={styles.inputAccount}
              placeholder={i18next.t("Password")}
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={secureTextEntry}
            />
          </View>
          <Text>{msg}</Text>
          <View style={styles.functionArea}>
            <View>
              <TouchableOpacity
                onPress={this.toggleCheckbox}
                style={styles.checkboxArea}
              >
                <View style={[styles.checkbox, isChecked && styles.checked]}>
                  {isChecked && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text style={styles.label}>{i18next.t(status)}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginRight: 15 }}>
              <TouchableOpacity onPress={this.ResetPasswordPage}>
                <Text style={{ color: "#0077b6" }}>
                  {i18next.t("Forgot password")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isLoading && <AppLoader />}
          <TouchableOpacity onPress={this.handleLogin} style={styles.bntLogin}>
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {i18next.t("Login")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.SignUpPage}>
            <Text style={{ color: "#333", marginTop: 10, fontSize: 12 }}>
              {i18next.t("Don't have account!")}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
  },
  img: {
    width: 150,
    height: 150,
    marginBottom: 40,
    tintColor: "#2BA84A",
  },
  textLogin: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2BA84A",
    backgroundColor: "white",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 25,
    borderRadius: 24,
  },
  inputArea: {
    width: "75%",
    backgroundColor: "#edede9",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  inputAccount: {
    width: "80%",
    height: 40,
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
    opacity: 0.9,
    backgroundColor: "#edede9",
  },
  functionArea: {
    width: "75%",
    // borderWidth: 2,
    // borderColor: '#333',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkboxArea: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.8,
    borderColor: "#333",
    borderRadius: 4,
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#0077b6",
  },
  label: {
    fontSize: 14,
  },
  bntLogin: {
    width: "75%",
    height: 35,
    marginTop: 15,
    backgroundColor: "#2BA84A",
    justifyContent: "center",
    borderRadius: 24,
  },
});
