import * as React from 'react';
import { Component } from 'react';
import * as emailjs from "emailjs-com";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  Image, 
  Keyboard, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
} from "react-native"; 
    // import { send, EmailJSResponseStatus } from '@emailjs/react-native';
    import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
    import apiUrl from "../apiURL"
    import MyContext from "../DataContext"
    import App from '../App'



export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.input1Ref = React.createRef();
    this.input2Ref = React.createRef();
    this.input3Ref = React.createRef();
    this.input4Ref = React.createRef();
  }

  handleTextChange(ref, text) {
    if (text.length === 1) {
      ref.current.focus(); // Tự động chuyển tập trung sang TextInput tiếp theo
    }
  }

  LoginPage = () => {
    console.log("Login Page");
    this.props.navigation.navigate("Login");
  };
  static contextType = MyContext 
  LoginPage = () => { 
       
      this.props.navigation.navigate('Login');  
  }; 
   
  onSubmit = async () => { 

      console.log() 
      const { dataArray } = this.context; 
      var emailsend = dataArray[0]["gmail"] 
       
      var otp = dataArray[0]["otp"] 
      // Thực hiện gửi email 
      try { 
          // Thực hiện gửi email 
          const response = await emailjs.send('service_kxnxuvq', 'template_njqzjob', { 
            name: 'Cuong', 
            email: emailsend, 
            message: otp 
          }, '_5v3301hRA5j4LmV8'); 
          console.log('Email sent:', response); 
           
        } catch (error) { 
          console.error('Error sending email:', error); 
        } 
      }; 

  render() {
    this.onSubmit()
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={styles.container}
          >
            <View style={styles.container}>
              <Image
                source={require("../assets/img/otp.png")}
                style={styles.img}
              />
              <Text style={styles.textLogin}>Verify OTP!</Text>
              <Text style={styles.note}>
                Please Enter The Code 4 Degit Code Sent To
              </Text>
              <Text style={[styles.note, {marginBottom: 20}]}>heobadai2016@gail.com</Text>
              <View style={styles.inputArea}>
                <TextInput
                  style={styles.inputAccount}
                  ref={this.input1Ref}
                  maxLength={1}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    this.handleTextChange(this.input2Ref, text)
                  }
                />
                <TextInput
                  style={styles.inputAccount}
                  ref={this.input2Ref}
                  maxLength={1}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    this.handleTextChange(this.input3Ref, text)
                  }
                />
                <TextInput
                  style={styles.inputAccount}
                  ref={this.input3Ref}
                  maxLength={1}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    this.handleTextChange(this.input4Ref, text)
                  }
                />
                <TextInput
                  style={styles.inputAccount}
                  ref={this.input4Ref}
                  maxLength={1}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                onPress={this.LoginPage}
                style={{}}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#2BA84A",
                    fontWeight: "bold",
                    borderBottomWidth: 2,
                    borderStyle: 'dotted',
                    borderBottomColor: "#2BA84A",
                    marginTop: 20,
                    marginBottom: 20
                  }}
                >
                  Resent Code
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.LoginPage}
                style={styles.bntLogin}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 20
                  }}
                >
                  Verify
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  note: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  inputArea: {
    width: "80%",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  inputAccount: {
    width: 50,
    height: 50,
    margin: 10,
    padding: 5,
    borderRadius: 12,
    opacity: 0.9,
    backgroundColor: "#edede9",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
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
