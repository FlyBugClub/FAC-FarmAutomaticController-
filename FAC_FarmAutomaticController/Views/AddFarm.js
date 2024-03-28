import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, SafeAreaView, StatusBar} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class AddFarm extends Component {
    OpenCamera = () => {
        console.log("Open Camera");
        this.props.navigation.navigate('CameraCreateNewFarmHouse'); 
    };

    AddDevicePage = () => {
        console.log("Add Device Page");
        this.props.navigation.navigate('AddDevice'); 
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
                        <TouchableOpacity style={styles.btnAdd} onPress={this.OpenCamera}>
                            <Text style={styles.btnText}>Create new farm house</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnAdd} onPress={this.AddDevicePage}>
                            <Text style={styles.btnText}>Add device</Text>
                        </TouchableOpacity>
                        
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