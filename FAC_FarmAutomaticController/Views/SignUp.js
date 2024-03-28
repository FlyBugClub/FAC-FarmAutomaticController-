import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, statusbar, TextInput, Image} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SignUp extends Component {
    LoginPage = () => {
        console.log("Login Page");
        this.props.navigation.navigate('Login'); 
    };

    render() {
        return(
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/img/pH.png')} style={styles.img}/>
                <Text style={styles.textLogin}>SignUp</Text>
                <View style={styles.inputArea}>
                    <Image source={require('../assets/img/user01.png')} style={styles.imgInput}/>
                    <Text style={{color: '#2BA84A', marginLeft:4, marginRight: 2}}>|</Text>
                    <TextInput style={styles.inputAccount} placeholder='Username'/>
                </View>
                <View style={styles.inputArea}>
                    <MCIcon name="email" size={28} color={'#2BA84A'}/>
                    <Text style={{color: '#2BA84A', marginLeft:4, marginRight: 2}}>|</Text>
                    <TextInput style={styles.inputAccount} placeholder='Email'/>
                </View>
                <View style={styles.inputArea}>
                    <Image source={require('../assets/img/iphone.png')} style={styles.imgInput}/>
                    <Text style={{color: '#2BA84A', marginLeft:4, marginRight: 2}}>|</Text>
                    <TextInput style={styles.inputAccount} placeholder='Phone number'/>
                </View>
                <View style={styles.inputArea}>
                    <Image source={require('../assets/img/padlock.png')} style={styles.imgInput}/>
                    <Text style={{color: '#2BA84A', marginLeft:4, marginRight: 2}}>|</Text>
                    <TextInput style={styles.inputAccount} placeholder='Password' secureTextEntry={true}/>
                </View>
                <View style={styles.inputArea}>
                    <Image source={require('../assets/img/password.png')} style={styles.imgInput}/>
                    <Text style={{color: '#2BA84A', marginLeft:4, marginRight: 2}}>|</Text>
                    <TextInput style={styles.inputAccount} placeholder='Verify password' secureTextEntry={true}/>
                </View>
                <TouchableOpacity onPress={ this.LoginPage } style={styles.bntLogin}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>SignUp</Text>
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
        marginTop: -100,
        tintColor: '#2BA84A'
    },
    imgInput: {
        width: 28,
        height: 28,
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
    inputArea: {
        width: '75%',
        backgroundColor: '#edede9',
        borderRadius: 24, 
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft:16,
        paddingRight:16,
        marginTop: 8,
        marginBottom: 8
    },
    inputAccount: {
        width: '80%',
        height: 40,
        margin: 5,
        paddingTop: 5,
        paddingBottom: 5,
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