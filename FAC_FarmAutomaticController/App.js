import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Details from './Views/Details'
import History from './Views/History'

const Stack = createNativeStackNavigator();

export default RootComponent = function() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Details" screenOptions={{headerShown: false}}>
        <Stack.Screen name='Details' component={Details}/>
        <Stack.Screen name='History' component={History}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}