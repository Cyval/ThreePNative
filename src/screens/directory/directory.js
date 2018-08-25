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
  FlatList
} from 'react-native';

import {Component} from "react";
import React from "react";
import galaxyImage from '../../assets/galaxy.jpg';
import {Header, Container, Left, Right, Button, Title, Body} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../../components/Navbar/Navbar';
import addSub from '../../assets/add-sub.png';
import List from '../../components/directory/list';


export default class Directory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {name: 'Reebook', id:'1'},
        {name: 'Nike', id:'2'},
        {name: 'Addidas', id:'3'},
        {name: 'Under Armor', id:'4'},
        {name: 'Gucci', id:'5'},
        {name: 'Lacoste', id:'6'},
        {name: 'New Balance', id:'7'},
      ]
    }
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    const {props} = this;
    return (
      <ImageBackground source={galaxyImage} style={{width: '100%', flex: 1}}>
        <NavBar title={"Directory"} {...props}/>
        <View style={{flex: 1, width: '100%', padding: 20}}>
          <Image source={addSub} style={{width: 30, height: 30, alignSelf: 'flex-end'}}/>
        </View>
        <View style={{flex: 9}}>
          <FlatList
            data={this.state.list}
            keyExtractor={this._keyExtractor}
            renderItem={({item}) => <List redirect={this.props.navigation.navigate} {...item}/>}
          />
        </View>
      </ImageBackground>
    )
  }

}

const styles = StyleSheet.create({});

