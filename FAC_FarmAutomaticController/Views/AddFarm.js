import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, ScrollView} from 'react-native';


export default class AddFarm extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };

    render() {
        return(
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.container}>
                    <Text>Add More Farm Here</Text>
                </View>
            </SafeAreaView>
            
        )
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#ebf2f2'
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
})