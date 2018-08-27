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
  TouchableWithoutFeedback
} from 'react-native';

import {Component} from "react";
import React from "react";
import galaxyImage from '../../assets/galaxy.jpg';
import {Header, Container, Left, Right, Button, Title, Body} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../../components/Navbar/Navbar';
import addSub from '../../assets/add-sub.png';
import List from '../../components/directory/list';

import sample from '../../assets/sample.png';
import sample1 from '../../assets/sample1.png';
import sample2 from '../../assets/sample2.png';

import {Accordion} from "native-base";

export default class Directory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          title: 'Reebook',
          content: [
            {image: sample, id: "1"},
            {image: sample1, id: "2"},
            {image: sample2, id: "3"},
          ],
        },
        {title: 'Nike', content: [],},
        {title: 'Addidas', content: [],},
        {title: 'Under Armor', content: [],},
        {title: 'Gucci', content: [],},
        {title: 'Lacoste', content: [],},
        {title: 'New Balance', content: [],},
      ]
    }
  }

  _renderHeader = (dataArray, expanded) => {
    return (
      <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center'}}>
        <View style={{flex: 1, justifyContent: 'center',}}>
          <Icon style={{alignSelf: 'center'}} name={'chevron-right'} color={'white'} size={25}/>
        </View>
        <View style={{flex: 9}}>
          <View style={styles.listStyle}>
            <Text style={styles.title}>{dataArray.title}</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderContent = (dataArray) => {

    const addCompo = (
      <View key={'90a'} style={{margin: '5%', width: "40%", height: 100, backgroundColor: '#9ab7ff', borderRadius: 5, justifyContent:'center'}}>
        <Icon name={'plus'} size={30} color={'white'} style={{alignSelf:'center'}}/>
      </View>
   )

    let vids = dataArray.content.map((vid,index) => {
      return (
        <TouchableWithoutFeedback key={index} onPress={() => {
          this.props.navigation.navigate('TagEditor')
        }}>
          <Image source={vid.image} key={index} style={{margin: '5%', width: "40%", height: 100, backgroundColor: '#9ab7ff', borderRadius: 5}}>

          </Image>
        </TouchableWithoutFeedback>
      )
    });

    vids = [addCompo, ...vids];

    return (
      <View>
        <View style={{flexDirection: 'row', width: '90%', flexWrap: 'wrap', alignSelf: 'center'}}>
          {vids}
        </View>

      </View>
    );
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
          <Accordion
            dataArray={this.state.list}
            style={{borderColor: 'transparent'}}
            contentStyle={{borderColor: 'transparent'}}
            headerStyle={styles.listStyle}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
          />
        </View>
      </ImageBackground>
    )
  }

}

const styles = StyleSheet.create({
  listStyle: {
    borderBottomColor: "#fff",
    paddingBottom: 10,
    alignSelf: 'center',
    borderBottomWidth: 2,
    width: '90%',
    marginBottom: 20,
    color: "white"
  },
  title: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold'
  }

})

