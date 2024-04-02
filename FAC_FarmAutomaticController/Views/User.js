import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MyContext from "../DataContext"
const screenWidth = Dimensions.get('window').width;
const squareWidth = screenWidth * 0.9;

export default class User extends Component {
    static contextType = MyContext
    
    render() {
        const { dataArray } = this.context; 
        
        return(
            <View style={styles.container}>
                <LinearGradient colors={['#bfd200', '#aacc00', '#80b918']}  style={styles.NavigationTop}>
                    <SafeAreaView style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.title}>User information</Text>
                    </SafeAreaView>
                </LinearGradient>
                <SafeAreaView style={styles.safeContainer}>
                    <View style={styles.userArea}>
                        <View>
                            <Image source={require('../assets/img/avatar_user.jpg')} style={styles.avatar}/>
                        </View>
                        <View style={{marginLeft: 10, marginRight: 10}}>
                            <Text style={styles.textInfo}>Username: {dataArray[0]["name"]}</Text>
                            <Text style={styles.textInfo}>Email: {dataArray[0]["gmail"]}</Text>
                            <Text style={styles.textInfo}>Phone: {dataArray[0]["phone_no"]}</Text>
                        </View>
                    </View> 
                    <View style={{flexDirection: 'row', width: '90%', justifyContent: 'center', gap: 10}}>
                        <View style={styles.square}>
                            <Text style={styles.titleText}>Farm House</Text>
                            <LinearGradient colors={['#cd9777', '#c38e70', '#9d6b53']}  style={styles.circleOutSide}>
                                <View style={styles.circleInSide}>
                                    <Text style={styles.number}>9</Text>
                                </View>
                            </LinearGradient>
                        </View>
                        <View style={styles.square}>
                            <Text style={styles.titleText}>Water pump</Text>
                            <LinearGradient colors={['#48cae4', '#00b4d8', '#0096c7']}  style={styles.circleOutSide}>
                                <View style={styles.circleInSide}>
                                    <Text style={styles.number}>38</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', width: '90%', gap: 10}}>
                        <View style={styles.square}>
                            <Text style={styles.titleText}>Humid sensor</Text>
                            <LinearGradient colors={['#ff9e00', '#ff9100', '#ff8500']}  style={styles.circleOutSide}>
                                <View style={styles.circleInSide}>
                                    <Text style={styles.number}>18</Text>
                                </View>
                            </LinearGradient>
                        </View>
                        <View style={styles.square}>
                            <Text style={styles.titleText}>pH sensor</Text>
                            <LinearGradient colors={['#bfd200', '#aacc00', '#80b918']}  style={styles.circleOutSide}>
                                <View style={styles.circleInSide}>
                                    <Text style={styles.number}>12</Text>
                                </View>
                            </LinearGradient>
                        </View>
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
        marginTop: 5,
        marginBottom: 5,
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
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    square: {
        width: squareWidth * 0.5,
        height: squareWidth * 0.5,
        marginTop: 6,
        marginBottom: 6,
        // marginLeft: 6,
        // marginRight: 6,
        backgroundColor: 'white',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    circleOutSide: {
        width: 110,
        height:110,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleInSide: {
        width:100,
        height:100,
        backgroundColor:'white',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    number: {
      fontSize: 38,
      fontWeight: 'bold'  
    },
})