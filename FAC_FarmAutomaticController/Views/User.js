import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image} from 'react-native';


export default class User extends Component {
    render() {
        return(
            <SafeAreaView style={styles.safeContainer}>
                <Image source={require('../assets/img/avatar_user.jpg')} style={styles.avatar}/>

                <Text style={styles.textInfo}>Username: Henry Devil</Text>
                <Text style={styles.textInfo}>Email: HenryDevil@gmail.com</Text>
                <Text style={styles.textInfo}>Phone: +84 5487 5441 875</Text>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ebf2f2'
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    avatar: {
        width: 150,
        height: 150,
        marginTop: 50,
        marginBottom: 30,
        borderRadius: 120,
    },
    textInfo: {
        marginTop: 1,
        marginBottom: 1,
        // fontWeight: 'bold',
        fontSize: 16
    }
})