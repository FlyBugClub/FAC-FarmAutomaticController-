// import * as React from 'react';
import { Component, useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    SafeAreaView, 
    Statusbar, 
    ImageBackground,
    TextInput,
    Image,
    ScrollView} from 'react-native';
import { Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import App from '../App'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        };
    }
    
    toggleCheckbox = () => {
        this.setState(prevState => ({
            isChecked: !prevState.isChecked
        }));
    };

    HomePage = () => {
        console.log("Detail Page");
        this.props.navigation.navigate('Home'); 
    };
    SignUpPage = () => {
        console.log("SignUp Page");
        this.props.navigation.navigate('SignUp'); 
    };
    ResetPasswordPage = () => {
        console.log("Reset Password Page");
        this.props.navigation.navigate('ForgotPassword'); 
    };
    render() {
        const { isChecked } = this.state;
        
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
                <Image source={require('../assets/img/pump.png')} style={styles.img}/>
                <Text style={styles.textLogin}>Login</Text>
                <TextInput style={styles.inputAccount} placeholder='Email'/>
                <TextInput style={styles.inputAccount} placeholder='Password' secureTextEntry={true}/>
                <View style={styles.functionArea}>
                    <View>
                        <TouchableOpacity  onPress={this.toggleCheckbox} style={styles.checkboxArea}>
                            <View style={[styles.checkbox, isChecked && styles.checked]}>
                                {isChecked && <Ionicons name="checkmark" size={14} color="white" />}
                            </View>
                            <Text style={styles.label}>Remember</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginRight: 15}}>
                        <TouchableOpacity onPress={this.ResetPasswordPage}>
                            <Text style={{color:'#0077b6'}}>Forgot password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={ () => this.props.navigation.navigate('TabNavigator') } style={styles.bntLogin}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ this.SignUpPage }>
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
    img: {
        width: 150,
        height: 150,
        marginBottom: 40,
        tintColor: '#2BA84A'
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
    functionArea: {
        width: '75%', 
        // borderWidth: 2, 
        // borderColor: '#333', 
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkboxArea: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 10
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1.8,
        borderColor: '#333',
        borderRadius: 4,
        marginRight: 10,
      },
    checked: {
    backgroundColor: '#0077b6',
    },
    label: {
    fontSize: 14,
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