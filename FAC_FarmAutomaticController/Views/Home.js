import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, FlatList, ScrollView, StatusBar} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from '@rneui/base';

export default class Home extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };
    SignUpPage = () => {
        console.log("SignUp Page");
        this.props.navigation.navigate('SignUp'); 
    };
    DetailPage = () => {
        console.log("Details Page");
        this.props.navigation.navigate('Details'); 
    };

    render() {
        return(
            <SafeAreaView style={styles.safeContainer}>
                <StatusBar backgroundColor="#ebf2f2"/>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.monthText}>March</Text>
                        <View style={styles.calendarArea}>
                            <View style={styles.calendar}>
                                <View style={{alignItems:'center'}}>
                                    <Text>Mon</Text>
                                    <Text style={styles.dayNumberText}>8</Text>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text>Tue</Text>
                                    <Text style={styles.dayNumberText}>9</Text>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text>Wed</Text>
                                    <Text style={styles.dayNumberText}>10</Text>
                                </View>
                                <View style={[styles.active ,{alignItems:'center'}]}>
                                    <Text>Thu</Text>
                                    <Text style={styles.dayNumberText}>11</Text>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text>Fri</Text>
                                    <Text style={styles.dayNumberText}>12</Text>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text>Sat</Text>
                                    <Text style={styles.dayNumberText}>13</Text>
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Text>Sun</Text>
                                    <Text style={styles.dayNumberText}>14</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <Text style={styles.littleText}>Farm</Text>
                        <TouchableOpacity style={styles.famrItem} onPress={this.DetailPage}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Ionicons name="water-outline" size={50} color={'#333'}/>
                                <View>
                                    <Text style={styles.titleItem} numberOfLines={1}> Farm 1: Nấm Bào Ngư hải sản</Text>
                                    <Text style={{ color: '#333', marginTop: 5 }}> 75% - 86%</Text>
                                </View>
                            </View>
                            <View>
                                <Image style={styles.imgItem} source={require('../assets/NamBaoNgu.png')}/>
                            </View>
                        </TouchableOpacity>

                    </View>
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
    header: {
        width: '100%',
        height: 110,
        marginBottom: 6,
        backgroundColor: '#ebf2f2',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    body: {
        width: '80%',
        marginTop: 6,
        justifyContent: 'center',
    },
    calendarArea: {
        alignItems: 'center'
    },
    calendar: {
        width: '90%',
        marginTop: 12,
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center'
    },
    active: {
        padding: 3,
        borderWidth: 1.2,
        borderColor: '#248232',
        borderRadius: 8
    },
    monthText: {
        marginLeft: 40,
        marginBottom: 12,
        color: '#2BA84A',
        fontWeight: 'bold',
        fontSize: 18
    },
    dayNumberText: {
        fontWeight: 'bold',
        marginTop: 5
    },
    littleText: {
        marginBottom: 6,
        color: '#2BA84A',
        fontWeight: 'bold',
        fontSize: 16,
    },
    famrItem: {
        width: '100%',
        padding: 8,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ebf2f2'
    },
    titleItem: {
        maxWidth: 170,
        width: '100%',
        fontSize: 15 , 
        color: '#333', 
        fontWeight: 'bold', 
        overflow: 'hidden',
        // borderWidth:2,
        // borderColor: '#000'
    },
    imgItem: {
        width: 60,
        height: 60,
    },
})