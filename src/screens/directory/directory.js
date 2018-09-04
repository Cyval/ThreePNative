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
  Dimensions,
  Modal,
  TextInput,
  Button,
  AsyncStorage
} from 'react-native';

import RNThumbnail from 'react-native-thumbnail';

import Orientation from 'react-native-orientation';

import {Component} from "react";
import React from "react";
import galaxyImage from '../../assets/galaxy.jpg';
import {Header, Container, Left, Right, Title, Body} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../../components/Navbar/Navbar';
import addSub from '../../assets/add-sub.png';
import List from '../../components/directory/list';

import sample from '../../assets/sample.png';
import sample1 from '../../assets/sample1.png';
import sample2 from '../../assets/sample2.png';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

import {Accordion} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import {RNS3} from 'react-native-aws3';
import axios from 'axios';

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

import CameraIcon from '../../assets/camera-icon.png'


export default class Directory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      modalVisible: false,
      modalVisibleVideo: false,
      userData: {},
      videoUri: '',
      loadingModal: false,
      progress:0,
    }

  }

  componentDidMount() {
    this._retrieveData();
  }


  addProject() {

    let bodyFormData = new FormData();

    bodyFormData.append('userId', this.state.userData.userId);
    bodyFormData.append('projectName', this.state.projectTitle);

    console.log(bodyFormData);

    axios.post('http://13.251.103.54/api/v1/projects/add', {
      userId: this.state.userData.userId,
      projectName: this.state.projectTitle
    }).then(response => {
      console.log(response)

      if (response.data === true) {
        this._retrieveData();
        this.setState({modalVisible: false})
      }
    })
  }

  _renderHeader = (dataArray, expanded) => {
    return (
      <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center'}}>
        <View style={{flex: 1, justifyContent: 'center',}}>
          <Icon style={{alignSelf: 'center'}} name={'chevron-right'} color={'white'} size={25}/>
        </View>
        <View style={{flex: 9}}>
          <View style={styles.listStyle}>
            <Text style={styles.title}>{dataArray.projectName}</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderContent = (dataArray) => {

    const addCompo = (
      <TouchableWithoutFeedback key={'90a'} onPress={() => {
        this.setState({modalVisibleVideo: true})
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

    let vids = dataArray.videos.map((vid, index) => {
      return (
        <TouchableWithoutFeedback key={index} onPress={() => {
          this.props.navigation.navigate('TagEditor')
        }}>
          <Image source={{uri: vid.image}} key={index} style={{
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


      RNThumbnail.get(response.uri).then((result) => {
        console.log(result.path);

        this.setState({videoUri: result.path});
      });

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

        this.setState({
          source: response
        });
      }
    });
  }


  uploadVideo() {

    const {source, videoTitle, videoUri} = this.state;

    const sourceName = source.fileName.split(".");
    let type = "";

    switch(sourceName[sourceName.length - 1]){
      case 'MOV': type = 'video/quicktime';
      case 'mp4': type = 'video/mp4';
      case 'wmv': type = 'video/x-ms-wmv';
      case 'ts': type = 'video/MP2T';
    }

    const file = {
      uri: source.uri,
      name: videoTitle,
      type
    };

    const thumb = {
      uri: videoUri,
      name: videoTitle,
      type:'image/png'
    };

    const optionsThumb = {
      keyPrefix: "videos-thumbs/",
      bucket: "3p-videos",
      region: "ap-southeast-1",
      accessKey: "",
      secretKey: "",
      successActionStatus: 201
    };

    const options = {
      keyPrefix: "videos/",
      bucket: "3p-videos",
      region: "ap-southeast-1",
      accessKey: "",
      secretKey: "",
      successActionStatus: 201
    };

    this.setState({modalVisibleVideo: false, loadingModal: true})

    RNS3.put(file, options)
      .progress((e) => {
        let progress = e.loaded / e.total;
        if(progress === 1){
          RNS3.put(thumb, optionsThumb)
            .progress((e) => {
              let progress = e.loaded / e.total;
              if(progress === 1){
                this.setState({loadingModal: false})
              }
            });
        }
      });


  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        // We have data!!
        const data = JSON.parse(value);
        this.setState({userData: data});
        axios.get('http://13.251.103.54/api/v1/projects',
          {
            headers: {
              'x-auth-token': data.authToken,
              'x-user-id': data.userId,
            }
          }).then((response) => {
          const list = response.data.data;
          this.setState({list});
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  toggleProjectModal = (status) => {
    this.setState({projectTitle: '', modalVisible: status})
  };

  render() {
    const {props} = this;
    return (
      <ImageBackground source={galaxyImage} style={{width: '100%', flex: 1}}>
        <NavBar title={"Directory"} {...props}/>
        <View style={{flex: 1, width: '100%', padding: 20}}>
          <TouchableWithoutFeedback onPress={() => {
            this.toggleProjectModal(true)
          }}>
            <Image source={addSub} style={{width: 30, height: 30, alignSelf: 'flex-end'}}/>
          </TouchableWithoutFeedback>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalStyle}>
              <Text style={styles.addTitle}>ADD PROJECT</Text>
              <TextInput
                style={styles.addProjectInput}
                onChangeText={(projectTitle) => this.setState({projectTitle})}
                value={this.state.projectTitle}
                placeholder={'Project Title'}
                placeholderTextColor={'#a4a4a4'}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.addButton}>
                  <Button
                    onPress={() => {
                      this.addProject()
                    }}
                    title="ADD"
                    color="#051c40"
                    style={{backgroundColor: 'red'}}
                  />
                </View>
                <View style={styles.addButton}>
                  <Button
                    onPress={() => {
                      this.setState({modalVisible: false})
                    }}
                    title="CANCEL"
                    color="#051c40"
                    style={{backgroundColor: 'red'}}
                  />
                </View>
              </View>

            </View>

          </View>

        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibleVideo}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalStyle}>
              <Text style={styles.addTitle}>ADD VIDEO</Text>
              <TextInput
                style={styles.addVideoInput}
                onChangeText={(videoTitle) => this.setState({videoTitle})}
                value={this.state.text}
                placeholder={'Video Title'}
                placeholderTextColor={'#a4a4a4'}
              />
              <TouchableWithoutFeedback onPress={() => {
                this.pickVideo()
              }}>
                <View style={{width: '90%', height: 200, backgroundColor: '#051c40', alignSelf: 'center'}}>
                  <Image source={this.state.videoUri === "" ? CameraIcon : {uri: this.state.videoUri}}
                         style={{width: '100%', height: 200}}/>
                </View>
              </TouchableWithoutFeedback>

              <View style={styles.addButton}>
                <Button
                  onPress={() => {
                    this.uploadVideo()
                  }}
                  title="CONFIRM"
                  color="#051c40"
                  style={{backgroundColor: 'red'}}
                />
              </View>
            </View>
          </View>

        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.loadingModal}>
          <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,.7)'}}>
            <Text style={{color:'white', fontSize:40, marginBottom:20}}>Uploading Video Please Wait...</Text>
          </View>
        </Modal>
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
  },
  modalStyle: {
    height: 'auto',
    width: '90%',
    backgroundColor: 'rgba(225,225,225,0.7)',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center'

  },
  addTitle: {
    marginTop: 20,
    color: 'white',
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addProjectInput: {
    backgroundColor: '#051c40',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
    width: '90%',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  addVideoInput: {
    backgroundColor: '#051c40',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
    width: '90%',
    textAlign: 'left',
    alignSelf: 'center',
    marginBottom: 20,
    paddingLeft: 10
  },
  addButton: {
    backgroundColor: 'white',
    marginBottom: 20,
    width: '40%',
    alignSelf: 'center',
    borderRadius: 10,
    margin: '5%'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }

})

