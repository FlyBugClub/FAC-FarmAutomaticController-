import * as React from 'react';
import { Component, useState,useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, FlatList, ScrollView, StatusBar} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from '@rneui/base';
import MyContext from '../DataContext.js';
import { index } from 'd3-array';

const data = [];
export default class Home extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };
    SignUpPage = () => {
        console.log("SignUp Page");
        this.props.navigation.navigate('SignUp'); 
    };
    DetailPage = (index) => {
        console.log(index)
        this.GetEquidmentValues(index);
        // this.props.navigation.navigate('Details'); 
    };
    

    static contextType = MyContext;
    GetEquidmentValues = async  (index) => {
        try {
      // Lấy giá trị context và cập nhật dữ liệu trong MyContext từ Home component
      const { addDataAtIndex } = this.context;
      console.log('http://127.0.0.1:5000/api/get_equipmentlastinfo/'+data[index])
      const response = await fetch('http://127.0.0.1:5000/api/get_equipmentlastinfo/'+data[index]);
    //   if (!response.ok) {
    //       throw new Error('Failed to fetch data');
    //   }

    console.log("haha");

      const data_equidmentvalues = await response.json();
    //   Tiếp tục xử lý dữ liệu nhận được từ API
      console.log("hêh");
      addDataAtIndex({ id_esp1: 'ESP0001',id_esp2:"ESP002" },1);
        }catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    render() {
        const { dataArray } = this.context;
        // const jsonObject = JSON.parse(dataArray[1]);
        const keyCount = Object.keys(dataArray[1]).length;
        const handleDetailPress = (index) => {
            this.DetailPage(index);
        };
        const farmHouseList = [];
        // Sử dụng forEach để thêm các phần tử vào mảng items
        [...Array(keyCount)].forEach((_, index) => {
            data[index] = Object.values(dataArray[1])[index];
            farmHouseList.push(
                <View>
                    <TouchableOpacity style={styles.famrItem} onPress={() => handleDetailPress(index)}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name="water-outline" size={50} color={'#333'}/>
                            <View>
                                <Text style={styles.titleItem} numberOfLines={1}> Farm {index}: {Object.values(dataArray[1])[index]}</Text>
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
            
            <SafeAreaView style={styles.safeContainer}>
            <StatusBar backgroundColor="#ebf2f2" barStyle={'dark-content'}/>
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
                    <MyContext.Consumer>
                    {contextData => {
                    const  message  = contextData;
                    console.log(message)
                    }}
                    </MyContext.Consumer>
                        {/* <Text style={[styles.littleText, {color: '#333'}]}>Today</Text> */}
                        <ScrollView style={{height:'73%'}} showsVerticalScrollIndicator={false}>
                            {/* <View>
                                <View>
                                    <LinearGradient colors={['#aacc00', '#80b918', '#55a630']} style={styles.famrItem}>
                                        <TouchableOpacity onPress={this.DetailPage} 
                                        style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Ionicons name="water-outline" size={50} color={'#dee2e6'}/>
                                                <View>
                                                    <Text style={[styles.titleItem, {color: '#dee2e6'}]} numberOfLines={1}> Farm 1: Nấm Bào Ngư hải sản</Text>
                                                    <Text style={{ color: '#dee2e6', marginTop: 5 }}> 75% - 86%</Text>
                                                </View>
                                            </View>
                                            <Image style={styles.imgItem} source={require('../assets/NamBaoNgu.png')}/>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <LinearGradient colors={['#aacc00', '#80b918', '#55a630']} style={styles.famrItem}>
                                        <TouchableOpacity onPress={this.DetailPage} 
                                        style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Ionicons name="water-outline" size={50} color={'#dee2e6'}/>
                                                <View>
                                                    <Text style={[styles.titleItem, {color: '#dee2e6'}]} numberOfLines={1}> Farm 4: Nấm Kim Châm</Text>
                                                    <Text style={{ color: '#dee2e6', marginTop: 5 }}> 75% - 86%</Text>
                                                </View>
                                            </View>
                                            <Image style={styles.imgItem} source={require('../assets/NamBaoNgu.png')}/>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                </View>
                            </View> */}

                            <View style={{marginTop: 8}}>
                                <Text style={styles.littleText}>Farm house</Text>
                                <View>
                                    {farmHouseList}
                                </View>
                            </View>
                        </ScrollView>
                        
                        

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