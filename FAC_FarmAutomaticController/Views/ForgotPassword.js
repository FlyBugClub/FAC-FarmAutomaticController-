import * as React from 'react';
import { Component } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    SafeAreaView, 
    TextInput,
    Image,
    Button} from 'react-native';
    import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import App from '../App'

export default class ForgotPassword extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };
    render() {
        return(
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/img/paper-plane.png')} style={styles.img}/>
                <Text style={styles.textLogin}>Forgot password</Text>
                <View style={styles.inputArea}>
                    <MCIcon name="email" size={28} color={'#2BA84A'}/>
                    <Text style={{color: '#2BA84A', marginLeft:4, marginRight: 2}}>|</Text>
                    <TextInput style={styles.inputAccount} 
                    placeholder='Email'
                    keyboardType='email-address'/>
                </View>
                <TouchableOpacity onPress={ this.LoginPage } style={styles.bntLogin}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Send</Text>
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
        width: '75%',
        backgroundColor: '#edede9',
        borderRadius: 24, 
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft:16,
        paddingRight:16,
        marginTop: 8,
        marginBottom: 8
    },
    inputAccount: {
        width: '80%',
        height: 40,
        margin: 5,
        paddingTop: 5,
        paddingBottom: 5,
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