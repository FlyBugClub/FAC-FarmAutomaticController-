import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput } from 'react-native';


export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.sensor_value}>
        <SensorTempText title1={'26°C'} title2={'Temp'}></SensorTempText>
        <SensorTempText title1={'46.6%'} title2={'Humadity'}></SensorTempText>
        <SensorTempText title1={'30'} title2={'Air'}></SensorTempText>
      </View>

      <TextInput
      style={styles.TextValue}
      placeholder='Value...'/>

      <View style={{flexDirection: 'row'}}>
        <CustomButton title={'Get Data'} onPress={() => Alert.alert('Get Data Already')}/>
        <CustomButton title={'Send Data'} onPress={() => Alert.alert('Send Data Already')}/>
      </View>
      
      <StatusBar style="auto"/>
    </View>
  );
}

const SensorTempText = ({title1, title2}) => (
  <View>
    <Text style={[styles.TextInSensorArea, {color: '#4d587d'}, {fontSize: 18}]}>{title1}</Text>
    <Text style={[styles.TextInSensorArea, {color: '#c1c1c1'}]} >{title2}</Text>
  </View>
);

const CustomButton = ({ onPress, title }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isPressed ? '#2D314A' : 'white' }
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      <Text style={[
        styles.btn_data, 
        { fontWeight: 'bold' }, 
        { color: isPressed ? 'white' : '#2D314A' }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensor_value: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    // borderColor: 'black',
    // borderWidth: 1,
    // padding: 5
  },
  TextValue: {
    background: '#fff',
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    borderRadius: 8,
    marginBottom: 30,
  },
  TextInSensorArea:{
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 25,
    padding: 15,
    margin: 10,
  },
  btn_data: {
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
