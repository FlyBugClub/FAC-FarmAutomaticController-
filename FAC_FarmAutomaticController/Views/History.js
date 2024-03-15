import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';


// Dữ liệu mẫu cho biểu đồ
const data = {
    labels: ['Mon', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [
      {
        data: [80, 84, 75, 87, 77, 79, 89],
        color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Humidity"] // optional
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
                    width={screenWidth}
                    height={256}
                    verticalLabelRotation={30}
                    chartConfig={chartConfig}
                    bezier
                    />
                    
                    <TouchableOpacity onPress={ this.DetailsPage }>
                        <Text>Back to details</Text>
                    </TouchableOpacity>
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
})