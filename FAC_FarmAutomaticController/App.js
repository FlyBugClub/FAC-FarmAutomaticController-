import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput, Image, Switch,Pressable  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { SegmentedArc } from '@shipt/segmented-arc-for-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';

import { LiquidGauge } from 'react-native-liquid-gauge';

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
let globalVariable = '0.0';

client = new Paho.MQTT.Client(options.host, options.port, options.path);

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      id : 'cuong',
      topic: 'tr6r/cuong',
      subscribedTopic: '',
      sliderValue : 50,
      message: '',
      messageList: [],
      status: '',
      statusManual : false,
      statusAuto : false,
      isEnabled: false,
      message_humid:"0.0",

      
      showArcRanges: false
    };
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
  }
  
  
  onConnect = () => {
    console.log('onConnect');
    this.setState({ status: 'connected' });
    this.subscribeTopic();
  }
  
  onFailure = (err) => {
    console.log('Connect failed!');
    console.log(err);
    this.setState({ status: 'failed' });
    // this.setState({ status: '', subscribedTopic: '' });
    this.onConnect();
  }
 
  connect = () => {
    this.setState(
      { status: 'isFetching' },
      () => {
        client.connect({
          onSuccess: this.onConnect,
          useSSL: false,
          timeout: 3,
          onFailure: this.onFailure
        });
      }
    );
  }
  
  onConnectionLost=(responseObject)=>{
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
    this.setState({ status: 'disconnected' });
    this.onConnect();
  }
 

  onChangeTopic = (text) => {
    this.setState({ topic: "tr6r/cuong" });
  }
 
  subscribeTopic = () => {
    this.setState(
      { subscribedTopic: this.state.topic },
      () => {
        client.subscribe(this.state.topic, { qos: 0 });
        console.log("ok")
      }
    );
  }
 
  unSubscribeTopic = () => {
    client.unsubscribe(this.state.subscribedTopic);
    this.setState({ subscribedTopic: '' });
  }
  onChangeMessage = (text) => {
    this.setState({ message: text });
  }
 
  sendMessage = () =>{
    const Data = {
      "Id": this.state.id,
      "StateManual": this.state.statusManual,
      "slide_value": Math.round(this.state.sliderValue),
      "toogleAuto" : this.state.statusAuto,
      "humid" : this.state.humid
    };
    const jsonString = JSON.stringify(Data);
    var message = new Paho.MQTT.Message(jsonString);
    message.destinationName = this.state.subscribedTopic;
    client.send(message);
    console.log("send");
  }
  handleSliderChange = (value) => {
    
    this.setState({ sliderValue: value });
  };

  handleSliderComplete = (value) => {
    // Khi người dùng kết thúc việc điều chỉnh slider, bạn có thể lấy giá trị ở đây
    this.setState({ sliderValue: value });
    this.sendMessage();
  };
  toggleSwitch = () => {
    this.setState((prevState) => ({
      isEnabled: !prevState.isEnabled,
    }));
    if (this.state.statusAuto == true)
    {
      this.state.statusAuto = false
    }
    else if (this.state.statusAuto == false)
    {
      this.state.statusAuto = true
    }
    this.sendMessage();
  };

 

  pressmanual =  () => {
    if (this.state.statusManual == false)
    {
      this.state.statusManual = true;
      console.log('true');
      this.sendMessage();
    }
    else if (this.state.statusManual == true)
    {
      this.state.statusManual = false;
      console.log('fasle');
      this.sendMessage();
    }
  };
segments = [
  {
    scale: 0.25,
    filledColor: '#FF746E',
    emptyColor: '#F2F3F5',
    data: { label: 'Red' }
  },
  {
    scale: 0.25,
    filledColor: '#F5E478',
    emptyColor: '#F2F3F5',
    data: { label: 'Yellow' }
  },
  {
    scale: 0.25,
    filledColor: '#78F5CA',
    emptyColor: '#F2F3F5',
    data: { label: 'Green' }
  },
  {
    scale: 0.25,
    filledColor: '#6E73FF',
    emptyColor: '#F2F3F5',
    data: { label: 'Blue' }
  }
];

ranges = ['60', '70', '80', '90', '100'];
handlePress = () => {
  this.setState(prevState => ({
    showArcRanges: !prevState.showArcRanges,
  }));
};
renderContent = metaData => (
  <Pressable onPress={this.handlePress} style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 16, paddingTop: 16 }}>{metaData.lastFilledSegment.data.label}</Text>
    <Text style={{ lineHeight: 80, fontSize: 24 }}>{globalVariable}</Text>
  </Pressable>
);

  onMessageArrived = (message )=> {
    console.log(message.payloadString);
    var jsonString = message.payloadString;
    const keyValuePairs = jsonString.slice(1, -1).split(',');

    keyValuePairs.forEach(pair => {
      const [key, value] = pair.split(':').map(item => item.trim());
     if (key === '"humid"')
     {
      globalVariable = value;
     }
    });
  }
  componentDidMount() {
    // Thay đổi tin nhắn mỗi 2 giây (điều chỉnh khoảng thời gian tùy vào nhu cầu)
    this.interval = setInterval(() => {
      this.setState({ message_humid: globalVariable });
      
    }, 1000);
  }

  componentWillUnmount() {
    // Xóa interval để tránh rò rỉ bộ nhớ
    clearInterval(this.interval);
  }

  render() {
    const { status, messageList,sliderValue,isEnabled  ,message_humid } = this.state;
    return (
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
            {this.state.status === 'connected' ? (

             <View style={{alignItems: 'center'}}>
             <View style={styles.ConnectArea}>
               <View style={[{flexDirection: 'row'}, {marginLeft: -20}]}>
                 <View style={styles.IconStatus}></View>
                 <Text>Online</Text>
               </View>
               <BtnConnect style={{}} title={'Disconnected'} onPress={() => {client.disconnect();this.setState({ status: '', subscribedTopic: '' });}}  loading={status === 'isFetching' ? true : false}disabled={status === 'isFetching' ? true : false} />
             </View>
             <View style={{flexDirection: 'row'}}>
               <View style={styles.ShortBoardControl}>
                 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                 <LiquidGauge
                    config={{
                      circleColor: '#4ea8de',
                      textColor: '#0077b6',
                      waveTextColor: '#0096c7',
                      waveColor: '#48cae4',
                      circleThickness: 0.2,
                      textVertPosition: 0.5,
                      waveAnimateTime: 1000,
                    }}
                    value={50}
                    width={130}
                    height={130}
                  />
                 </View>
               </View>
               <View style={styles.ShortBoardControl}>
                 <Text style={{color: '#8B934B', fontSize: 16, fontWeight: 'bold', marginTop: 10}}>Custom mode</Text>
                 <BtnCustomMode  onPress={this.pressmanual} title="On"/>
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
                 <Switch
                   trackColor={{ false: "#767577", true: "#81b0ff" }}
                   thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                   ios_backgroundColor="#3e3e3e"
                   onValueChange={this.toggleSwitch}
                   value={isEnabled}
                 />
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
            ) : (


              <View style={styles.ConnectArea}>
              <View style={[{flexDirection: 'row'}, {marginLeft: -20}]}>
                <View style={styles.IconStatus1}></View>
                <Text>Offline</Text>
              </View>
              <BtnConnect
                style={{}}
                title={'Connected'}
                onPress={this.connect}
                loading={status === 'isFetching' ? true : false}
                disabled={status === 'isFetching' ? true : false}
              />
            </View>


            )}
            
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
    const { onPress, title, disabled , isPressed, onPressIn, onPressOut} = this.props;
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
    const { title, isPressed, onPressOut,onPress} = this.props;
    const { isOn } = this.state;
    var classapp = new App();
    return (
      <TouchableOpacity
        style={[
          styles.BtnCustomMode,
          { backgroundColor: isOn ? '#81BB4D' : '#CDCDCD'}
        ]}
        
        onPressOut={this.handlePress}
        onPress = {onPress}
      >
        <Text style={[styles.BtnCustomModeText, { color:'#fff', fontWeight: 'bold' }]}>
          {isOn ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>
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
  IconStatus1: {
    width: 8,
    height: 8,
    marginTop: 6,
    marginRight: 5,
    marginLeft: 15,
    backgroundColor: '#ff0000',
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
    borderRadius: 50,
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
