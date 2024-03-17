import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, FlatList, ScrollView, statusbar} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@rneui/base';
import { bounds } from '@shopify/react-native-skia';


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
        console.log("DetailsPage");
        this.props.navigation.navigate('Details'); // 'History' là tên của màn hình History trong định tuyến của bạn
    };

    render() {
        
        return(
            <View style={styles.container}>
                <LinearGradient colors={['#55a630', '#80b918', '#aacc00']}  style={styles.NavigationTop}>
                    <SafeAreaView>
                        <Text style={{textAlign: 'center', fontSize: 23, marginBottom: 15, color: '#fff'}}>History</Text>
                    </SafeAreaView>
                </LinearGradient>
                <SafeAreaView>
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
                            <Text style={{fontSize: 14, color: '#8B934B', fontWeight: 'bold'}}>Humidity</Text>
                        </View>
                        <View>
                            <Text style={{textAlign: 'center', fontSize: 14}}>8</Text>
                            <Text style={{fontSize: 14, color: '#8B934B', fontWeight: 'bold'}}>Pump</Text>
                        </View>
                    </View>
                    <ScrollView>
                    {/* Data here */}
                    <View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                        <View style={{marginLeft: 30}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                marginBottom: 5, 
                                marginTop: 5}}>
                                <Icon name="schedule" size={20} color={'#b8b8b8'}/>
                                <Text style={{color: '#b8b8b8', fontSize: 12, marginRight: 5}}>25/02/2024</Text>
                                <Text style={{color: '#b8b8b8', fontSize: 12}}>16:38</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row', 
                                marginBottom: 5, 
                                marginTop: 5, 
                                justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 45}}>
                                    <Icon name="water-drop" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>82%</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 85}}>
                                    <Icon name="heat-pump" size={50} color={'#00b4d8'}/>
                                    <Text style={{fontSize: 25}}>6</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{borderWidth: 0.5, borderColor: '#b8b8b8'}}></View>
                    </View>

                    {/* <TouchableOpacity onPress={ this.DetailsPage }>
                        <Text>Back to details</Text>
                    </TouchableOpacity> */}
                    </ScrollView>
                </SafeAreaView>
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
        height: 90,
        backgroundColor: '#73A942',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    DataArea: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
        marginBottom: 15
    },
})