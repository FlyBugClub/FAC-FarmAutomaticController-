import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity, SafeAreaView, Image, ScrollView, StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default class AddFarm extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };

    render() {
        return(
            <View style={styles.Container}>
                <StatusBar backgroundColor="#bfd200"/>
                <LinearGradient colors={['#bfd200', '#aacc00', '#80b918']}  style={styles.NavigationTop}>
                    <SafeAreaView style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.title}>Create Farm House</Text>
                    </SafeAreaView>
                </LinearGradient>
                <SafeAreaView style={styles.safeContainer}>
                    <View style={{width: '90%'}}>
                        <ScrollView>
                            <TextInput style={styles.input} placeholder='Farm house name'/>
                            <TextInput style={styles.input} placeholder=''/>
                            <TextInput style={styles.input} placeholder=''/>
                            <TextInput style={styles.input} placeholder=''/>
                            <TouchableOpacity style={styles.btnAdd}>
                                <Text style={styles.btnText}>Add new</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
            
            
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: 'white',
    },
    safeContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
    },
    NavigationTop: {
        width: '100%',
        height: 80,
        backgroundColor: '#73A942',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center', 
        fontSize: 23, 
        color: '#fff',
        fontWeight: 'bold'
    },
    textLogin: {
        marginLeft: 20
    },
    input: {
        width: '95%',
        height: 40,
        margin: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 10,
        borderRadius: 24,
        opacity: 0.9,
        backgroundColor: '#edede9',
    },
    btnAdd: {
        height: 40,
        margin: 10,
        backgroundColor: '#80b918', 
        justifyContent: 'center',
        borderRadius: 20,
    },
    btnText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16
    },
})