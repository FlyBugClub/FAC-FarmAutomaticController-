import * as React from 'react';
import { Component, useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    SafeAreaView, 
    Statusbar, 
    ImageBackground,
    TextInput} from 'react-native';
import { Icon } from 'react-native-elements';

import App from '../App'

export default class Login extends Component {
    HomePage = () => {
        console.log("Detail Page");
        this.props.navigation.navigate('Home'); 
    };
    SignUpPage = () => {
        console.log("SignUp Page");
        this.props.navigation.navigate('SignUp'); 
    };
    render() {
        return(
            // <ImageBackground style={styles.bgImage}
            // source={require('../assets/background/bgfarm05.jpg')}>
            //     <SafeAreaView style={styles.container}>
            //         <Text style={styles.textLogin}>Login</Text>
            //         <TextInput style={styles.inputAccount} placeholder='Email'/>
            //         <TextInput style={styles.inputAccount} placeholder='Password' secureTextEntry={true}/>
            //         <TouchableOpacity onPress={ () => this.props.navigation.navigate('TabNavigator') } style={styles.bntLogin}>
            //             <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Login</Text>
            //         </TouchableOpacity>
            //         <TouchableOpacity onPress={ this.SignUpPage }>
            //             <Text style={{color: 'white', marginTop: 10}}>Don't you have account!</Text>
            //         </TouchableOpacity>
            //     </SafeAreaView>
            // </ImageBackground>

            <SafeAreaView style={styles.container}>
                <Text style={styles.textLogin}>Login</Text>
                <TextInput style={styles.inputAccount} placeholder='Email'/>
                <TextInput style={styles.inputAccount} placeholder='Password' secureTextEntry={true}/>
                <TouchableOpacity onPress={ () => this.props.navigation.navigate('TabNavigator') } style={styles.bntLogin}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ this.SignUpPage }>
                    <Text style={{color: '#333', marginTop: 10, fontSize: 12}}>Don't you have account!</Text>
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
    inputAccount: {
        width: '75%',
        height: 40,
        margin: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 24,
        opacity: 0.9,
        backgroundColor: '#edede9'
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