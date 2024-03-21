import * as React from 'react';
import { Component, useState,useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, FlatList, ScrollView, StatusBar} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from '@rneui/base';
import MyContext from '../DataContext.js';
import { index } from 'd3-array';

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
        this.handleUpdateMessage();
        this.props.navigation.navigate('Details'); 
    };


    static contextType = MyContext;

    handleUpdateMessage = () => {
      // Lấy giá trị context và cập nhật dữ liệu trong MyContext từ Home component
      const { addDataAtIndex } = this.context;
      addDataAtIndex({ id_esp1: 'ESP0001',id_esp2:"ESP002" },1);
    };


    render() {
        const farmHouseList = [];
        // Sử dụng forEach để thêm các phần tử vào mảng items
        [...Array(2)].forEach((_, index) => {
            farmHouseList.push(
                <View>
                    <TouchableOpacity style={styles.famrItem} onPress={this.DetailPage}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="water-outline" size={50} color={'#333'}/>
                            <View>
                                <Text style={styles.titleItem} numberOfLines={1}> Farm {index}: Nấm Bào Ngư hải sản</Text>
                                <Text style={{ color: '#333', marginTop: 5 }}> 75% - 86%</Text>
                            </View>
                        </View>
                        <View>
                            <Image style={styles.imgItem} source={require('../assets/NamBaoNgu.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });

        return(
            <View style={styles.safeContainer}>
                <StatusBar backgroundColor="#ebf2f2" barStyle={'dark-content'}/>
                   <View style={styles.container}>
                    <View style={styles.header}>
                        <SafeAreaView>
                           <Text style={styles.monthText}>March</Text>
                            <View style={styles.calendarArea}>
                                <View style={styles.calendar}>
                                    <View style={{alignItems:'center'}}>
                                        <Text style={{color: 'white'}}>Mon</Text>
                                        <Text style={styles.dayNumberText}>8</Text>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <Text style={{color: 'white'}}>Tue</Text>
                                        <Text style={styles.dayNumberText}>9</Text>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <Text style={{color: 'white'}}>Wed</Text>
                                        <Text style={styles.dayNumberText}>10</Text>
                                    </View>
                                    <View style={[styles.active ,{alignItems:'center'}]}>
                                        <Text style={{color: 'white'}}>Thu</Text>
                                        <Text style={styles.dayNumberText}>11</Text>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <Text style={{color: 'white'}}>Fri</Text>
                                        <Text style={styles.dayNumberText}>12</Text>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <Text style={{color: 'white'}}>Sat</Text>
                                        <Text style={styles.dayNumberText}>13</Text>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <Text style={{color: 'white'}}>Sun</Text>
                                        <Text style={styles.dayNumberText}>14</Text>
                                    </View>
                                </View>
                            </View> 
                        </SafeAreaView>
                        
                    </View>
                    <View style={styles.body}>
                    <MyContext.Consumer>
                    {contextData => {
                    const  message  = contextData;
                    console.log(message)
                    }}
                    </MyContext.Consumer>
                        <ScrollView style={{height:'73%'}} showsVerticalScrollIndicator={false}>
                            <View style={{marginTop: 8}}>
                                <Text style={styles.littleText}>Farm house</Text>
                                <View>
                                    {farmHouseList}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
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
        height: 150,
        marginBottom: 6,
        backgroundColor: '#2BA84A',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    body: {
        width: '90%',
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
        borderColor: 'white',
        borderRadius: 8
    },
    monthText: {
        marginLeft: 40,
        marginBottom: 12,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    dayNumberText: {
        fontWeight: 'bold',
        marginTop: 5,
        color: 'white'
    },
    littleText: {
        marginLeft: 20,
        marginTop: 8,
        marginBottom: 12,
        color: '#2BA84A',
        fontWeight: 'bold',
        fontSize: 16,
    },
    famrItem: {
        width: '100%',
        padding: 8,
        marginTop: 5,
        marginBottom: 5,
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