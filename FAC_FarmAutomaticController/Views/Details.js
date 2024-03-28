import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Switch, Pressable ,ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { LiquidGauge } from 'react-native-liquid-gauge';
import { Icon } from '@rneui/base';
import MyContext from '../DataContext.js';
import apiUrl from '../apiURL.js'
let globalVariable = '50.0';
var flag_humid_respect = 0;
export default class Details extends Component {
  constructor(props){
    super(props)
    this.state={
      sliderValue : 50,
      statusManual : false,
      statusAuto : false,
      isEnabled: false,
      message_humid:"0.0",
      showArcRanges: false
    };
  }
  static contextType = MyContext;
  componentDidMount() {
    // Dispatch một action để lấy dữ liệu từ Redux store (nếu cần)
    this.props.fetchData();
  }
  HistoryPage = () => {
    console.log("HistoryPage");
    this.props.navigation.navigate('History'); // 'History' là tên của màn hình History trong định tuyến của bạn
  };
  
  handleSliderChange = (value) => {
    
    this.setState({ sliderValue: value });
  };
 

 

  handleSliderComplete = (value) => {
    // Khi người dùng kết thúc việc điều chỉnh slider, bạn có thể lấy giá trị ở đây
    this.setState({ sliderValue: value });
    this.sendMessage();
  };
  sendMessage= () => {};
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
      // console.log('true');
      this.sendMessage();
    }
    else if (this.state.statusManual == true)
    {
      this.state.statusManual = false;
      // console.log('fasle');
      this.sendMessage();
    }
  };

  componentDidMount() {
    // Thay đổi tin nhắn mỗi 2 giây (điều chỉnh khoảng thời gian tùy vào nhu cầu)
    this.interval = setInterval(() => {
      this.setState({ message_humid: globalVariable });
      
    }, 2000);
  }

  componentWillUnmount() {
    // Xóa interval để tránh rò rỉ bộ nhớ
    clearInterval(this.interval);
  }

  render() {
    const { status, messageList,sliderValue,isEnabled  ,message_humid } = this.state;
    const { dataArray } = this.context;
    const url = apiUrl+`getequidmentvalues/${dataArray[1]["id_esp"]}`;
    fetch(url)
            .then(res=>{
                return res.json();
              })
            .then((json)=>{
              if (json != null)
              {
                
                if (Object.values(json[0]) == 0)
                {
                  this.setState({ isEnabled: false });
                }
                else   this.setState({ isEnabled: true });
                
                for (const key in json) {
                  // console.log(Object.keys(json[key]));
                  const keys_dht = Object.keys(json[key])
                  
                  if (keys_dht.includes("id_dht") && flag_humid_respect == 0) {
                    flag_humid_respect = 1;
                    this.setState({ sliderValue: json[key]["respect"] });
              
                  }
                 
              }

                  
              }
            });
       
    return (
      <View style={styles.container}>
        {/* <MyContext.Consumer>
        {contextData => {
          // const  message  = contextData;
          // console.log(message)
        }}
      </MyContext.Consumer> */}
        <StatusBar backgroundColor="#bfd200"/>
        
        <ScrollView>
        <LinearGradient colors={['#bfd200', '#aacc00', '#80b918']}  style={styles.BackDropTop}>
          <SafeAreaView>
            <View style={styles.TitleTopArea}>
              {/* <Icon style={styles.IconTop} name="chevron-left" size={30} color="#fff" /> */}
              <Text style={styles.TitleTop}>MUSHROOM FARM</Text>
              {/* <Icon style={styles.IconTop} name="cog" size={30} color="#fff" /> */}
            </View>
            <Text style={[styles.TitleTop, {fontSize: 20}, {textAlign: 'center'}, {marginTop: 5}]}>Farm 1</Text>
            <View style={{alignItems: 'center'}}>
              <Image style={styles.ImgTitleTop} source={require('../assets/NamBaoNgu.png')}/>
            </View>
          </SafeAreaView>
        </LinearGradient>
        
        <View style={{alignItems: 'center'}}>
        

             <View style={{alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
                  <View style={styles.ShortBoardControl}>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.HistoryPage}>
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
                              value={parseFloat(globalVariable)} 
                              width={130}
                              height={130}
                          />
                        </TouchableOpacity>
                      </View>
                  </View>
                  <View style={[styles.ShortBoardControl, {marginRight: 8}]}>
                      <Text style={{color: '#80b918', fontSize: 16, fontWeight: 'bold'}}>Custom mode</Text>
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <BtnCustomMode  onPress={this.pressmanual} title="On"/>
                      </View>
                  </View>
                </View>
                <View style={styles.LongtBoardControl}>
                <Text  style={{
                    color: '#80b918', 
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
                    onValueChange={this.sendMessage}
                    value={isEnabled}
                    style={{marginRight: 15}}
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
                    <Text style={{marginRight: 20, marginTop: 6, fontSize: 16}}>
                        {Math.round(sliderValue)}%
                    </Text>
                </View>
                </View>
             </View>
            
            
        </View>

        </ScrollView>
      </View>
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
          { backgroundColor: isPressed ? '#2D314A' : (disabled ? '#F0F0F0' : '#2D3A3A'),
            marginRight: 15
          }
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
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#73A942',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    marginBottom: 10,
  },
  TitleTopArea: {
    backgroundColor: 'While',
    justifyContent: 'space-between',
  },
  TitleTop: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  IconTop: {
    textAlign: 'center',
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
    // justifyContent: 'space-evenly'

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
    // marginLeft: 100,
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
    width: '45%',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 15,
    paddingTop: 15,
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
    marginTop: 10,
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
});
