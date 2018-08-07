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

import { Component } from "react";
import React from "react";
import galaxyImage from '../../../galaxy.jpg';
import { Header, Container, Left, Right,Button , Title, Body} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../../components/Navbar/Navbar'


export default class Directory extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {props} = this;
    return(
      <ImageBackground source={galaxyImage} style={{width: '100%', flex:1}}>
        <NavBar title={"Directory"} {...props}/>
        <View>

        </View>
      </ImageBackground>
    )
  }

}

const styles = StyleSheet.create({

});

