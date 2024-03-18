import * as React from 'react';
import { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, FlatList, ScrollView, statusbar} from 'react-native';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@rneui/base';

export default class Login extends Component {
    SignUpPage = () => {
        console.log("SignUp Page");
        this.props.navigation.navigate('SignUp'); 
    };
    render() {
        return(
            <View>
                <Text>Login Page</Text>
                <TouchableOpacity onPress={ this.SignUpPage }>
                        <Text>SignUp</Text>
                </TouchableOpacity>
            </View>
        )
    }
}