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
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

import Orientation from 'react-native-orientation';

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

import {Accordion} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';

const screenWidth = Dimensions.get('window').width;

var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  mediaType: 'video'
};


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

  componentDidMount() {

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
      <TouchableWithoutFeedback key={'90a'} onPress={() => {
        this.pickVideo();
      }}>
        <View key={'90a'} style={{
          margin: screenWidth * .03,
          width: screenWidth * .39,
          height: 100,
          backgroundColor: '#9ab7ff',
          borderRadius: 5,
          justifyContent: 'center'
        }}>
          <Icon name={'plus'} size={30} color={'white'} style={{alignSelf: 'center'}}/>
        </View>
      </TouchableWithoutFeedback>);

    let vids = dataArray.content.map((vid, index) => {
      return (
        <TouchableWithoutFeedback key={index} onPress={() => {
          this.props.navigation.navigate('TagEditor')
        }}>
          <Image source={vid.image} key={index} style={{
            margin: screenWidth * .03,
            width: screenWidth * .39,
            height: 100,
            backgroundColor: '#9ab7ff',
            borderRadius: 5
          }}>

          </Image>
        </TouchableWithoutFeedback>
      )
    });

    vids = [addCompo, ...vids];

    return (
      <View>
        <View style={{alignItems: 'center', flexDirection: 'row', width: '90%', flexWrap: 'wrap', alignSelf: 'center'}}>
          {vids}
        </View>
        <View style={{
          justifyContent: 'center',
          marginBottom: 20,
          alignSelf: 'center',
          borderWidth: 3,
          borderRadius: 20,
          borderColor: 'white',
          width: '80%',
          padding: 10,
        }}>
          <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}> <Icon name={'globe'}
                                                                                   size={30}/> GLOBAL</Text>
        </View>
      </View>
    );
  }

  _keyExtractor = (item, index) => item.id;

  _orientationDidChange(orientation) {
    this.setState({
      orientation
    })
  }

  pickVideo() {
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
      }
      else {
        let source = {uri: response.uri};

        const file = {
          // `uri` can also be a file system path (i.e. file://)
          uri: response.uri,
          name: response.fileName || 'sample',
          type: "image/png"
        };

        const options = {
          keyPrefix: "videos/",
          bucket: "3p-videos",
          region: "ap-southeast-1",
          accessKey: "",
          secretKey: "",
          successActionStatus: 201
        };

        RNS3.put(file, options).then(response => {

          if (response.status !== 201) {
            throw new Error("Failed to upload image to S3");
            return;
          };

          alert("uploaded");

        });


        this.setState({
          avatarSource: source
        });
      }
    });
  }

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

