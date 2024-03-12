import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput, Image, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
    
    var message = new Paho.MQTT.Message(JSON.stringify({"cuong": "hello"}));;
    message.destinationName = this.state.topic;
    client.send(message);
  }
  onConnectionLost=(responseObject)=>{
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
    this.connect();
    this.subscribeTopic();
  }

  onMessageArrived = (message )=> {
    
    console.log( message.payloadString);
    let myData = JSON.parse(message)
  


   
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
      // <View style={styles.container}>
      //   <View style={styles.sensor_value}>
      //     <SensorTempText title1={'26°C'} title2={'Temp'}></SensorTempText>
      //     <SensorTempText title1={'46.6%'} title2={'Humidity'}></SensorTempText>
      //     <SensorTempText title1={'30'} title2={'Air'}></SensorTempText>
      //   </View>

      //   <Slider 
      //             style={{width: 200, height: 40}}
      //             minimumValue={50}
      //             maximumValue={95}
      //             value={sliderValue}
      //             onValueChange={this.handleSliderChange}
      //             onSlidingComplete={this.handleSliderComplete}
      //   />
      //   <Text style={styles.sliderValueText}>Slider Value: {Math.round(sliderValue)}</Text>

      //   <View style={{ flexDirection: 'row' }}>
      //     <CustomButton
      //        type='solid'
      //        title='CONNECT'
      //        onPress={this.connect}
      //        buttonStyle={{
      //         marginBottom:50,
      //         backgroundColor: status === 'failed' ? 'red' : '#397af8'
      //       }}
      //       icon={{ name: 'lan-connect', type: 'material-community', color: 'white' }}
      //       loading={status === 'isFetching' ? true : false}
      //       disabled={status === 'isFetching' ? true : false}
      //     />
      //     <CustomButton
      //       title={'Auto'}
          
      //       onPress={this.pressauto}
          
      //     />

      //     <CustomButton
      //       title={'Manual'}
          
      //       onPress={this.pressmanual}
          
      //     />
      //   </View>

      //   <StatusBar style="auto" />
      // </View>

      <View style={styles.container}>
        <View style={styles.BackDropTop}>
          <View style={styles.TitleTopArea}>
            <Icon style={styles.IconTop} name="chevron-left" size={30} color="#fff" />
            <Text style={styles.TitleTop}>MUSHROOM FARM</Text>
            <Icon style={styles.IconTop} name="cog" size={30} color="#fff" />
          </View>
          <Text style={[styles.TitleTop, {fontSize: 20}, {textAlign: 'center'}, {marginTop: 5}]}>Farm 1</Text>
          <View style={{alignItems: 'center'}}>
            <Image style={styles.ImgTitleTop} source={require('./assets/NamBaoNgu.png')}/>
          </View>
        </View>

        <View style={{alignItems: 'center'}}>
          <View style={styles.ConnectArea}>
            <View style={[{flexDirection: 'row'}, {marginLeft: -20}]}>
              <View style={styles.IconStatus}></View>
              <Text>Online</Text>
            </View>
            <BtnConnect style={{}} title={'Connected'} disabled/>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.ShortBoardControl}>
              
            </View>
            <View style={styles.ShortBoardControl}>
              <Text style={{color: '#8B934B', fontSize: 16, fontWeight: 'bold', marginTop: 10}}>Custom mode</Text>
              <BtnCustomMode onPress={() => {}} title="On"/>
            </View>
          </View>
          <View style={styles.LongtBoardControl}>
            <Text  style={{
              color: '#8B934B', 
              fontSize: 16, 
              fontWeight: 'bold',
              marginTop: 10,
              marginLeft: 15}}>Auto mode</Text>
            <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{marginLeft: 15, marginRight: 10, marginTop: 6}}>Active</Text>
                <Text style={{marginLeft: 10, marginRight: 10, marginTop: 6}}>
                {this.state.isEnabled ? 'ON' : 'OFF'}</Text>
              </View>
              <BtnTogleAutoMode />
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={{marginLeft: 15, marginRight: 10, marginTop: 6}}>Huminity</Text>
                <Slider 
                  style={{width: 200, height: 40}}
                  minimumValue={50}
                  maximumValue={95}
                  value={sliderValue}
                  onValueChange={this.handleSliderChange}
                  onSlidingComplete={this.handleSliderComplete}
                  minimumTrackTintColor={'#A4AC86'}
                />
              </View>
              <Text style={{marginRight: 15, marginTop: 5, fontSize: 16}}>{Math.round(sliderValue)}%</Text>
            </View>
          </View>
        </View>
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

class BtnConnect extends Component {
  render() {
    const { onPress, title, disabled , isPressed, onPressIn, onPressOut } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.BtnConnect,
          { backgroundColor: isPressed ? '#2D314A' : (disabled ? '#F0F0F0' : '#2D3A3A')}
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <Text style={[
          styles.BtnConnectText,
          { fontWeight: 'bold' },
          { color: isPressed ? '#F0F6F6' : (disabled ? '#A6A6A6' : '#fff') }]}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

class BtnCustomMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false // Khởi tạo trạng thái ban đầu là off
    };
  }

  handlePress = () => {
    // Khi nút được nhấn, đảo ngược trạng thái
    this.setState(prevState => ({ isOn: !prevState.isOn }));
  }

  render() {
    const { title, isPressed} = this.props;
    const { isOn } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.BtnCustomMode,
          { backgroundColor: isOn ? '#81BB4D' : '#CDCDCD'}
        ]}
        onPress={this.handlePress}
      >
        <Text style={[styles.BtnCustomModeText, { color:'#fff', fontWeight: 'bold' }]}>
          {isOn ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>
    );
  }
}

class BtnTogleAutoMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false // Khởi tạo trạng thái ban đầu là disabled
    };
  }

  toggleSwitch = () => {
    this.setState(previousState => ({
      isEnabled: !previousState.isEnabled // Khi nút được nhấn, đảo ngược trạng thái
    }));
  };

  render() {
    return (
      <View style={{marginRight: 15}}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={this.toggleSwitch}
          value={this.state.isEnabled}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  BackDropTop: {
    width: '100%',
    height: 262,
    backgroundColor: '#73A942',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    marginBottom: 10,
  },
  TitleTopArea: {
    flexDirection: 'row',
    backgroundColor: 'While',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  TitleTop: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  IconTop: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5
  },
  ImgTitleTop: {
    width: 140,
    height: 140,
    marginTop: 5
  },
  ConnectArea: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '75%',
    height: 45,
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly'

  },
  IconStatus: {
    width: 8,
    height: 8,
    marginTop: 6,
    marginRight: 5,
    marginLeft: 15,
    backgroundColor: '#73A942',
    borderRadius: 20,
  },
  BtnConnect: {
    height: 25,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    // borderWidth: 1,
    // borderColor: '#000',
  },
  BtnConnectText: {
    marginTop: 2,
    color: '#A6A6A6'
  },
  ShortBoardControl: {
    width: 170,
    height: 170,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  LongtBoardControl: {
    width: 360,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  BtnCustomMode: {
    width: 100,
    height: 100,
    marginTop: 16,
    borderRadius: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // alignItems: 'center',
  },
  BtnCustomModeText: {
    fontSize: 24,
    marginTop: 32,
    textAlign: 'center',
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
    flexDirection: 'row',
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
