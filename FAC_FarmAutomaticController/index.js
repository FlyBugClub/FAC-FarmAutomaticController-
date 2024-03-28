// import { AppRegistry } from "react-native";
// import React, { Component } from "react";
// import App from './App'
// import Login from './Views/Login'
// import Splash from './Views/Splash'

// class Index extends Component{
//     constructor(props) {
//         super(props)
//         this.state = { currentScreen: 'Splash'}
//         setTimeout(() => {
//             console.log("Do some tasks in 3 seconds");
//             this.setState({ currentScreen: 'Login'})
//         }, 3000)
//     }
//     render() {
//         const{ currentScreen } = this.state
//         let mainScreen = currentScreen === 'Splash' ? <Splash/> : <Login/>
//         return mainScreen
//     }
// }
// AppRegistry.registerComponent('ReactNativeProject', () => Index)