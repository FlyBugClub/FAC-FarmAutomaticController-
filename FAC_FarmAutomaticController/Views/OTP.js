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
    Image} from 'react-native';
    // import { send, EmailJSResponseStatus } from '@emailjs/react-native';
    import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
    import apiUrl from "../apiURL"
    import MyContext from "../DataContext"
    import App from '../App'

export default class ForgotPassword extends Component {
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
        
        this.onSubmit();
        return(
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/img/otp.png')} style={styles.img}/>
                <Text style={styles.textLogin}>Verify OTP!</Text>
                <View style={styles.inputArea}>
                    <TextInput style={styles.inputAccount}/>
                    <TextInput style={styles.inputAccount}/>
                    <TextInput style={styles.inputAccount}/>
                    <TextInput style={styles.inputAccount}/>
                </View>
                <TouchableOpacity onPress={ this.LoginPage } style={styles.bntLogin}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Verify</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      },
    bgImage: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'cover'
    },
    img: {
        width: 150,
        height: 150,
        marginBottom: 40,
        marginTop: -100,
        tintColor: '#2BA84A'
    },
    textLogin: {
        fontSize: 28,
        fontWeight: 'bold',
        color:'#2BA84A',
        backgroundColor: 'white',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 25,
        borderRadius: 24,
    },
    inputArea: {
        width: '80%',
        borderRadius: 24, 
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft:16,
        paddingRight:16,
        marginTop: 8,
        marginBottom: 8
    },
    inputAccount: {
        width: 50,
        height: 50,
        margin: 10,
        padding: 5,
        borderRadius: 12,
        opacity: 0.9,
        backgroundColor: '#edede9'
    },
    functionArea: {
        width: '75%', 
        // borderWidth: 2, 
        // borderColor: '#333', 
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkboxArea: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 10
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1.8,
        borderColor: '#333',
        borderRadius: 4,
        marginRight: 10,
      },
    checked: {
    backgroundColor: '#0077b6',
    },
    label: {
    fontSize: 14,
    },
    bntLogin: {
        width: '75%',
        height: 35,
        marginTop: 15,
        backgroundColor: '#2BA84A',
        justifyContent: 'center',
        borderRadius: 24,
    },
})