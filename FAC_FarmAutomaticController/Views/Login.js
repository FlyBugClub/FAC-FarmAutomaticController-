import * as React from 'react';
import { Component, useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    SafeAreaView, 
    Statusbar, 
    ImageBackground,
    TextInput} from 'react-native';
import { Icon } from 'react-native-elements';
import MyContext from '../DataContext.js';
import App from '../App'
import apiUrl from '../apiURL.js'

const data = [];
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg:'',         
            email: 'admin@gmail.com',
            password: '123456'
        };
      }
      static contextType = MyContext;
      handleLogin = () => {
        var data = [];
        var erorr = true;
        const { email, password } = this.state;
        // Hai chuỗi bạn muốn cộng
        const { addDataAtIndex } = this.context;
        const url = apiUrl+`login/${email}/${password}`;
        fetch(url)
            .then(res=>{
                if (!res.ok) {
                    this.setState({ msg: "error" });
                    erorr = false;
                }
                return res.json();
              })
            .then((json)=>{
                // console.log(json)
                
                if (json != null && erorr)
                {
                    const combinedJson = Object.assign({}, json[0], json[1]);
                    addDataAtIndex(combinedJson,0);
                    this.setState({ msg: "" });
                    this.props.navigation.navigate('TabNavigator');
                }
                else this.setState({ msg: "email or password are incorect" });
                
            });
       
      };

    HomePage = () => {
        console.log("Detail Page");
        this.props.navigation.navigate('Home'); 
    };
    SignUpPage = () => {
        console.log("SignUp Page");
        this.props.navigation.navigate('SignUp'); 
    };





    render() {
        const { msg } = this.state;
        return(
            
            // <ImageBackground style={styles.bgImage}
            // source={require('../assets/background/bgfarm05.jpg')}>
            //     <SafeAreaView style={styles.container}>
            //         <Text style={styles.textLogin}>Login</Text>
            //         <TextInput style={styles.inputAccount} placeholder='Email'/>
            //         <TextInput style={styles.inputAccount} placeholder='Password' secureTextEntry={true}/>
            //         <TouchableOpacity onPress={ () => this.props.navigation.navigate('TabNavigator') } style={styles.bntLogin}>
            //             <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Login</Text>
            //         </TouchableOpacity>
            //         <TouchableOpacity onPress={ this.SignUpPage }>
            //             <Text style={{color: 'white', marginTop: 10}}>Don't you have account!</Text>
            //         </TouchableOpacity>
            //     </SafeAreaView>
            // </ImageBackground>

            <SafeAreaView style={styles.container}>
                <Text style={styles.textLogin}>Login</Text>
                <TextInput style={styles.inputAccount}  placeholder='Email' onChangeText={text => this.setState({ email: text })}/>
                <TextInput style={styles.inputAccount}   placeholder='Password' secureTextEntry={true} onChangeText={text => this.setState({ password: text })}/>
                <Text>{msg}</Text>
                <TouchableOpacity onPress={this.handleLogin} style={styles.bntLogin}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleLogin}>
                    <Text style={{color: '#333', marginTop: 10, fontSize: 12}}>Don't you have account!</Text>
                </TouchableOpacity>
            </SafeAreaView>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      },
    bgImage: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'cover'
    },
    textLogin: {
        fontSize: 28,
        fontWeight: 'bold',
        color:'#2BA84A',
        backgroundColor: 'white',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 25,
        borderRadius: 24,
    },
    inputAccount: {
        width: '75%',
        height: 40,
        margin: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 24,
        opacity: 0.9,
        backgroundColor: '#edede9'
    },
    bntLogin: {
        width: '75%',
        height: 35,
        marginTop: 15,
        backgroundColor: '#2BA84A',
        justifyContent: 'center',
        borderRadius: 24,
    },
})