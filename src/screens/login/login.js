import {
  AlertIOS,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  AsyncStorage,
  ImageBackground,
  Image,
  TextInput,
} from 'react-native';

import { Container, Header, Left, Right, Icon, Body, Title, } from 'native-base'
import { Button } from 'react-native-elements'
import {Component} from "react";
import React from "react";
import Axios from 'axios';

import galaxyImage from '../../assets/galaxy.jpg';
import Logo from '../../assets/logo.png';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email:'testaccount1@3ptouchmedia.com',
      password:'3ptouchtest'
    }
  }


  login = () => {
    const {email, password} = this.state;
    Axios.post('http://13.251.103.54/api/v1/login',{
      email,
      password
    }).then((res)=>{
      const userData = res.data.data;
      AsyncStorage.setItem('userData',JSON.stringify(userData), ()=>{
        this.props.navigation.navigate('Directory');
      });
    }).catch(function (error) {
      console.log(error);
    });
  };

  render() {
    return (
      <ImageBackground source={galaxyImage} style={{width: '100%', flex:1}}>
        <View style={{flex:2, justifyContent:'flex-end'}}>
          <Image source={Logo} style={styles.logo}/>
          <View style={{alignSelf:'center'}}>
            <Text style={{color:'white'}}>Product Editor (Admin)</Text>
            <Text style={{color:'white'}}>Ver 0.0.x</Text>
          </View>

        </View>
        <View style={{flex:3}}>
          <View style={styles.loginFormContainer}>
            <View style={{flex:1}}>
              <Text style={styles.signIn}>SIGN IN</Text>
              <Text style={styles.signInBottom}>Use your 3P Touch Account</Text>
            </View>
            <View style={{flex:1}}>
              <TextInput
                style={styles.textInputLogin}
                value={this.state.email}
                placeholder='Username'
                placeholderTextColor='white'
                onChange={(value) => this.setState({username:value})}
              />
              <TextInput
                style={styles.textInputLogin}
                value={this.state.password}
                placeholder='Password'
                placeholderTextColor='white'
                secureTextEntry={true}
                onChange={(value) => this.setState({password:value})}
              />
            </View>
            <View style={{flex:1}}>
              <Button
                style={styles.signInButton}
                onPress={this.login}
                title="SIGN IN"
                color="black"
                backgroundColor="#fff"
                borderRadius={10}
                accessibilityLabel="Learn more about this purple button"
              />
            </View>

          </View>
        </View>
        <View style={{flex:1}}>

        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  loginFormContainer:{
    backgroundColor:'rgba(255,255,255,.5)',
    flex:1,
    width:'70%',
    alignSelf:'center',
    borderRadius:8,
    marginTop:10
  },
  signIn:{
    color:'white',
    fontWeight:'bold',
    alignSelf:'center',
    marginTop:15,
    fontSize:30
  },
  signInBottom:{
    color:'white',
    alignSelf:'center',
    marginTop:10
  },
  textInputLogin:{
    height: 40,
    backgroundColor: '#8EA2C2',
    marginBottom:10,
    width:'90%',
    alignSelf:'center',
    paddingLeft:5,
    color:'white'
  },
  signInButton:{
    backgroundColor:'white',
    borderRadius:10,
    elevation: 5
  },
  logo:{
    resizeMode:'contain',
    flex:1,
    marginTop:10,
    marginBottom:10,
    width:200,
    alignSelf:'center'
  }
});