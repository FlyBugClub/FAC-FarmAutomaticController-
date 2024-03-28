import * as React from 'react';
import { useState } from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer, useNavigation  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconFeather from 'react-native-vector-icons/Feather';
import 'react-native-gesture-handler';
import MyContext from './DataContext.js';

import Login from './Views/Login'
import SignUp from './Views/SignUp'
import Home from './Views/Home'
import Details from './Views/Details'
import History from './Views/History'
import AddFarm from './Views/AddFarm'
import User from './Views/User.js'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tạo Stack Navigator
function StackNavigator() {
  return (

    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Home' component={Home}/>
      <Stack.Screen name='Login' component={Login}/>
      <Stack.Screen name='SignUp' component={SignUp}/>
      <Stack.Screen name='Details' component={Details}/>
      <Stack.Screen name='History' component={History}/>
      <Stack.Screen name='AddFarm' component={AddFarm}/>
      <Stack.Screen name='User' component={User}/>
    </Stack.Navigator>
  );
};

// Tạo Tab Navigator
function TabNavigator() {
  const navigation = useNavigation();
  return (
    
    <Tab.Navigator  
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#ebf2f2',
        height: '10%'
      }
    }}>
      <Tab.Screen name="Home" component={StackNavigator}  options={{
        tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image 
            source={require('./assets/img/home.png')}
            resizeMode="contain"
            style={{ 
              width: 25,
              height: 25,
              tintColor: focused ? '#80b918' : '#333'
             }}/>
            <Text style={{ color: focused ? '#80b918' : '#333', fontSize: 12 }}>Home</Text>
          </View>
        ),
      }}/>
      <Tab.Screen name="AddFarm" component={AddFarm} options={{
        tabBarIcon: ({focused}) => (
          <TouchableOpacity onPress={() => navigation.navigate('AddFarm')}>
            <View style={{
              width: 70,
              height: 70,
              backgroundColor: '#80b918',
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
              top: -30
            }}>
              <Image 
              source={require('./assets/img/plus.png')}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                tintColor: '#fff'
              }}/>
            </View>
          </TouchableOpacity>
        ),        
      }}/>
      <Tab.Screen name="Us" component={User} options={{
        tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image 
            source={require('./assets/img/user.png')}
            resizeMode="contain"
            style={{ 
              width: 25,
              height: 25,
              tintColor: focused ? '#80b918' : '#333'
             }}/>
            <Text style={{ color: focused ? '#80b918' : '#333', fontSize: 12 }}>User</Text>
          </View>
        ),
      }}/>
    </Tab.Navigator>
  );
};

export default RootComponent = function() {
  // const [contextData, setContextData] = useState([]);
  
  // const updateContextData = (newData) => {
  //   setContextData({ ...contextData, ...newData });
  // };
  // const [dataArray, setDataArray] = useState([{ id_user: 'CT0001' }, {id_esp1: "ESP0001", id_esp2: "ESP002"}]);
  const [dataArray, setDataArray] = useState([]);

  // Hàm để thêm phần tử mới vào mảng
  // const addData = (newItem) => {
  //   setDataArray([...dataArray, newItem]);
  // };
  const addDataAtIndex = (newItem, index) => {
    // Sao chép mảng ban đầu để tránh thay đổi trực tiếp mảng gốc
    const newDataArray = [...dataArray];
    
    // Ghi đè giá trị mới vào index được chỉ định
    newDataArray.splice(index, 1, newItem);
    
    // Cập nhật mảng mới vào state
    setDataArray(newDataArray);
  };
  return (
    <MyContext.Provider value={{ dataArray, addDataAtIndex  }}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='TabNavigator' component={TabNavigator}/>
        {/* <Stack.Screen name='Home' component={Home}/> */}
        <Stack.Screen name='SignUp' component={SignUp}/>
        <Stack.Screen name='Details' component={Details}/>
        <Stack.Screen name='History' component={History}/>
        <Stack.Screen name='AddFarm' component={AddFarm}/>
      </Stack.Navigator>
    </NavigationContainer>
  </MyContext.Provider>
 
  )
}

const style = StyleSheet.create({

});