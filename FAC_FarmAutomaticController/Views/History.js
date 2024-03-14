import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";


// Dữ liệu mẫu cho biểu đồ
const data = {
    labels: ['Mon', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [
      {
        data: [80, 84, 75, 87, 77, 79, 89],
        color: (opacity = 1) => `rgba(0, 119, 182, ${opacity})`,
        strokeWidth: 2
      }
    ],
};

// Cấu hình cho biểu đồ
const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(2, 62, 138, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(2, 62, 138, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#808080"
    }
};

export default class History extends Component {
    DetailsPage = () => {
        console.log("DetailsPage");
        this.props.navigation.navigate('Details'); // 'History' là tên của màn hình History trong định tuyến của bạn
    };

    render() {
        
        return(
            <View style={styles.container}>
                <SafeAreaView>
                    <View style={styles.ChartArea}>
                        <LineChart
                        data={data}
                        width={380}
                        height={256}
                        verticalLabelRotation={30}
                        chartConfig={chartConfig}
                        bezier
                        />
                    </View>
                    
                    <Text>History Page</Text>
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
})