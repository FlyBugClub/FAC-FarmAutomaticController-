import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Views/Login'
import SignUp from './Views/SignUp'
import Home from './Views/Home'
import Details from './Views/Details'
import History from './Views/History'

const Stack = createNativeStackNavigator();

export default RootComponent = function() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='SignUp' component={SignUp}/>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Details' component={Details}/>
        <Stack.Screen name='History' component={History}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}