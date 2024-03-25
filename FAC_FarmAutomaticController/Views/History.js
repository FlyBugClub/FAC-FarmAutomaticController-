import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, statusbar} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@rneui/base';
import AnDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import { bounds } from '@shopify/react-native-skia';
import { index } from 'd3-array';


// Dữ liệu mẫu cho biểu đồ
const data = {
    labels: ['Mon', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [
      {
        data: [80, 84, 75, 87, 77, 79, 89],
        color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`, // optional
        strokeWidth: 2 // optional
      },
      {
        data: [7, 12, 15, 17, 17, 14, 18],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      },
    ],
    legend: ["Humidity", "Pump"] // optional
  };

// Cấu hình cho biểu đồ
const chartConfig = {
    backgroundGradientFrom: "#fafafa",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fafafa",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(2, 62, 138, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: true, // optional
  };

const screenWidth = Dimensions.get("window").width;




export default class History extends Component {
    DetailsPage = () => {
        console.log("Details Page");
        this.props.navigation.navigate('Details'); // 'History' là tên của màn hình History trong định tuyến của bạn
    };

    render() {
        const items = [];
        // Sử dụng forEach để thêm các phần tử vào mảng items
        [...Array(10)].forEach((_, index) => {
            items.push(
                <View key={index}>
                    <View style={{width: '100%'}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginLeft: 5,
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <AnDesign name="pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>{index}</Text>
                                </View>
                            </View>
                        </View>
                    <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                </View>
            );
        });

        return(
            <View style={styles.container}>
                <LinearGradient colors={['#bfd200', '#aacc00', '#80b918']}  style={styles.NavigationTop}>
                    <SafeAreaView style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{textAlign: 'center', fontSize: 23, color: '#fff'}}>History</Text>
                    </SafeAreaView>
                </LinearGradient>
                <LineChart
                data={data}
                width={screenWidth+ 30}
                height={256}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                bezier
                style={{marginLeft: 20}}
                />
                <View style={styles.DataArea}>
                    <View>
                        <Text style={{textAlign: 'center', fontSize: 14}}>82%</Text>
                        <Text style={{fontSize: 14, color: '#80b918', fontWeight: 'bold'}}>Humidity</Text>
                    </View>
                    <View>
                        <Text style={{textAlign: 'center', fontSize: 14}}>8</Text>
                        <Text style={{fontSize: 14, color: '#80b918', fontWeight: 'bold'}}>Pump</Text>
                    </View>
                </View>
                <View style={{width: '100%', height: '43%'}}>
                    <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                        {/* Data here */}
                        {items}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        // justifyContent: 'center',
        alignItems: 'center'
    },
    ChartArea: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
    DataArea: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        marginBottom: 15
    },
})