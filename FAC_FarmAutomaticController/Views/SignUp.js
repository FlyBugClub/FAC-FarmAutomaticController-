import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, statusbar, TextInput} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@rneui/base';

export default class SignUp extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };

    render() {
        return(
            // <View>
            //     <Text>SignUp Page</Text>
            //     <TouchableOpacity onPress={ this.LoginPage }>
            //             <Text>Back to login</Text>
            //     </TouchableOpacity>
            // </View>

            <SafeAreaView style={styles.container}>
                <Text style={styles.textLogin}>SignUp</Text>
                <TextInput style={styles.inputAccount} placeholder='Username'/>
                <TextInput style={styles.inputAccount} placeholder='Email'/>
                <TextInput style={styles.inputAccount} placeholder='Phone number'/>
                <TextInput style={styles.inputAccount} placeholder='Password' secureTextEntry={true}/>
                <TextInput style={styles.inputAccount} placeholder='Verify password' secureTextEntry={true}/>
                <TouchableOpacity onPress={ this.LoginPage } style={styles.bntLogin}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>SignUp</Text>
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