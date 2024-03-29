import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


export default class User extends Component {
    render() {
        return(
            <View style={styles.container}>
                <LinearGradient colors={['#bfd200', '#aacc00', '#80b918']}  style={styles.NavigationTop}>
                    <SafeAreaView style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.title}>Create Farm House</Text>
                    </SafeAreaView>
                </LinearGradient>
                <SafeAreaView style={styles.safeContainer}>
                    <View style={styles.userArea}>
                        <View>
                            <Image source={require('../assets/img/avatar_user.jpg')} style={styles.avatar}/>
                        </View>
                        <View style={{marginLeft: 10, marginRight: 10}}>
                            <Text style={styles.textInfo}>Username: Henry Devil</Text>
                            <Text style={styles.textInfo}>Email: HenryDevil@gmail.com</Text>
                            <Text style={styles.textInfo}>Phone: +84 5487 5441 875</Text>
                        </View>
                    </View> 
                    <View style={styles.farmArea}>
                        <Text>Farm</Text>
                        <LinearGradient colors={['#bfd200', '#aacc00', '#80b918']}  style={styles.circle}>
                            
                        </LinearGradient>
                    </View>
                </SafeAreaView>
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center'
    },
    userArea: {
        width: '90%',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    avatar: {
        width: 100,
        height: 100,
        marginTop: 15,
        marginBottom: 15,
        marginLef: 5,
        marginRight: 5,
        borderRadius: 120,
    },
    textInfo: {
        marginTop: 3,
        marginBottom: 3,
        // fontWeight: 'bold',
        fontSize: 15
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
    farmArea: {
        width: 180,
        height: 180,
        backgroundColor: 'white',
        borderRadius: 12
    },
})