import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, FlatList, ScrollView, statusbar} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@rneui/base';

export default class SignUp extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };

    render() {
        return(
            <View>
                <Text>SignUp Page</Text>
                <TouchableOpacity onPress={ this.LoginPage }>
                        <Text>Back to login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}