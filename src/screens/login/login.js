import {
  AlertIOS,
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ImageBackground,
  Image,
  TextInput,
} from 'react-native';

import { Container } from 'native-base'
import { Button } from 'react-native-elements'
import {Component} from "react";
import React from "react";

import galaxyImage from '../../../galaxy.jpg';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }



  render() {
    return (
      <ImageBackground source={galaxyImage} style={{width: '100%', flex:1}}>
        <View style={{flex:2, justifyContent:'flex-end'}}>
          <Image style={styles.logo}/>
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
                value={""}
                placeholder='Username'
                placeholderTextColor='white'
              />
              <TextInput
                style={styles.textInputLogin}
                value={""}
                placeholder='Password'
                placeholderTextColor='white'
                secureTextEntry={true}
              />
            </View>
            <View style={{flex:1}}>
              <Button
                style={styles.signInButton}
                onPress={()=>{}}
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
    backgroundColor:'red',
    flex:1,
    marginTop:10,
    marginBottom:10,
    width:200,
    alignSelf:'center'
  }
});