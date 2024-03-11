import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync : {}
});
const options = {
  host: 'broker.emqx.io',
  port: 8083,
  path: '/mqtt',
  id: 'id_' + parseInt(Math.random()*100000)
};

client = new Paho.MQTT.Client(options.host, options.port, options.path);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "tr6r/cuong",
      message: '',
      messageList: [],
      sliderValue: 0,
      statusAuto: false,
      statusManual: false
    };
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
  }
  onConnect = () => {
    console.log('onConnect');

  }

  onFailure = (err) => {
    console.log('Connect failed!');
 
  }

  connect = () => {

        client.connect({
          onSuccess: this.onConnect,
          useSSL: false,
          timeout: 3,
          onFailure: this.onFailure
        });

  }

  subscribeTopic = () => {

        
        client.subscribe(this.state.topic, { qos: 0 });
      }
  
  

  sendMessage = () =>{
    var message = new Paho.MQTT.Message("cuong : hehelo");
    message.destinationName = this.state.topic;
    client.send(message);
  }
  onConnectionLost=(responseObject)=>{
    this.connect();
  }

  onMessageArrived = (message )=> {
   
    console.log('onMessageArrived:' + JSON.parse(message.payloadString));
   
  }


  handleSliderChange = (value) => {
    
    this.setState({ sliderValue: value });
  };

  handleSliderComplete = (value) => {
    // Khi người dùng kết thúc việc điều chỉnh slider, bạn có thể lấy giá trị ở đây
    this.setState({ sliderValue: value });
    console.log('Slider value after complete:', value);
  };

  pressauto =  () => {
    
      console.log("hehe");
      this.subscribeTopic();
  };

  pressmanual =  () => {
    
    console.log("haha");
    this.sendMessage();
};

  render() {
    const { status, messageList,sliderValue  } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.sensor_value}>
          <SensorTempText title1={'26°C'} title2={'Temp'}></SensorTempText>
          <SensorTempText title1={'46.6%'} title2={'Humidity'}></SensorTempText>
          <SensorTempText title1={'30'} title2={'Air'}></SensorTempText>
        </View>

        <Slider 
                  style={{width: 200, height: 40}}
                  minimumValue={50}
                  maximumValue={95}
                  value={sliderValue}
                  onValueChange={this.handleSliderChange}
                  onSlidingComplete={this.handleSliderComplete}
        />
        <Text style={styles.sliderValueText}>Slider Value: {Math.round(sliderValue)}</Text>

        <View style={{ flexDirection: 'row' }}>
          <CustomButton
             type='solid'
             title='CONNECT'
             onPress={this.connect}
             buttonStyle={{
              marginBottom:50,
              backgroundColor: status === 'failed' ? 'red' : '#397af8'
            }}
            icon={{ name: 'lan-connect', type: 'material-community', color: 'white' }}
            loading={status === 'isFetching' ? true : false}
            disabled={status === 'isFetching' ? true : false}
          />
          <CustomButton
            title={'Auto'}
          
            onPress={this.pressauto}
          
          />

          <CustomButton
            title={'Manual'}
          
            onPress={this.pressmanual}
          
          />
        </View>

        <StatusBar style="auto" />
      </View>
    );
  }
}

class SensorTempText extends Component {
  render() {
    const { title1, title2 } = this.props;
    return (
      <View>
        <Text style={[styles.TextInSensorArea, { color: '#4d587d' }, { fontSize: 18 }]}>{title1}</Text>
        <Text style={[styles.TextInSensorArea, { color: '#c1c1c1' }]}>{title2}</Text>
      </View>
    );
  }
}

class CustomButton extends Component {
  render() {
    const { onPress, title, isPressed, onPressIn, onPressOut } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isPressed ? '#2D314A' : 'white' }
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <Text style={[
          styles.btn_data,
          { fontWeight: 'bold' },
          { color: isPressed ? 'white' : '#2D314A' }]}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

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
  },
  TextValue: {
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    borderRadius: 8,
    marginBottom: 30,
  },
  TextInSensorArea: {
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

export default App;
