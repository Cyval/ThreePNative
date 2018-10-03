import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  TextInput,
  Button,
  AsyncStorage,
} from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';
import RNThumbnail from 'react-native-thumbnail';


import {Component} from "react";
import React from "react";
import galaxyImage from '../../assets/galaxy.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../../components/Navbar/Navbar';
import addSub from '../../assets/add-sub.png';
import IconFilm from '../../assets/iconfilm.png';

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
      progress: 0,
      url: 'http://13.229.84.38',
      activeProject: '',
      orientation: '',
      confirmation: false,
      projectModal: false,
      deleteProjectConfirmation:false
    }

  }

  componentDidMount() {
    this._retrieveData();
  }


  deleteProject(){
    axios.delete(`${this.state.url}/api/v1/projects/${this.state.activeProject}`).then(response => {
      if (response.data === true) {
        this._retrieveData();
        this.setState({projectModal: false})
      }
    })
  }


  addProject() {

    let bodyFormData = new FormData();

    bodyFormData.append('userId', this.state.userData.userId);
    bodyFormData.append('projectName', this.state.projectTitle);

    console.log(bodyFormData);

    axios.post(`${this.state.url}/api/v1/projects/add`, {
      userId: this.state.userData.userId,
      projectName: this.state.projectTitle
    }).then(response => {
      if (response.data === true) {
        this._retrieveData();
        this.setState({modalVisible: false})
      }
    })
  }

  _renderHeader = (dataArray) => {
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


  deleteVideo(id) {
    axios.delete(`${this.state.url}/api/v1/videos/${id}`).then(response => {
      if (response.data === true) {
        this._retrieveData();
        this.setState({confirmation: false})
      }
    })
  }

  _renderContent = (dataArray) => {

    const addCompo = (
      <TouchableWithoutFeedback key={'90a'} onPress={() => {
        this.setState({modalVisibleVideo: true, activeProject: dataArray._id})
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
          this.props.navigation.navigate('TagEditor', {
            vidId: vid.id,
            fileType: vid.fileType,
            orientation: vid.orientation
          })
        }}>
          <View>
            <Image
              source={{uri: `https://s3-ap-southeast-1.amazonaws.com/3p-videos/videos-thumbs/${vid.id}`}}
              key={index}
              defaultSource={IconFilm}
              style={{
                margin: screenWidth * .03,
                width: screenWidth * .39,
                height: 100,
                backgroundColor: 'white',
                borderRadius: 5,
                resizeMode: 'cover'
              }}/>
            <TouchableWithoutFeedback onPress={() => {
              this.setState({confirmation: true, deleteId: vid.id})
            }}>
              <View style={styles.removeButton}>

                <Icon style={{alignSelf: 'center'}} color={'black'} name={'times'} size={20}/>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )
    });

    vids = [addCompo, ...vids];

    return (
      <View>
        <View style={{alignItems: 'center', flexDirection: 'row', width: '90%', flexWrap: 'wrap', alignSelf: 'center'}}>

          <View style={{justifyContent: 'center', width:'100%', marginBottom:30}}>
            <TouchableWithoutFeedback onPress={() => {
              this.setState({projectModal:true, activeProject: dataArray._id, activeProjectName: dataArray.projectName});
            }}>
              <View style={{flexDirection:'row',justifyContent: 'center', alignSelf: 'flex-end', color:'white', textAlign:'justify'}} >
                <Text style={{ color:'white', textAlign:'justify', fontWeight:'bold'}}  > settings </Text>
                <Icon name={'cog'} size={20} color={'white'}/>
              </View>

            </TouchableWithoutFeedback>
          </View>
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
          <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
            <Icon name={'globe'} size={30}/> GLOBAL
          </Text>
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
        console.log(result);

        let orientation = ''

        if (result.height > result.width) {
          orientation = 'portrait';
        } else {
          orientation = 'landscape';
        }

        this.setState({videoUri: result.path, orientation});
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

    const {source, videoTitle, videoUri, userData} = this.state;

    const sourceName = source.fileName.split(".");
    const fileType = sourceName[sourceName.length - 1];
    let type = "";

    switch (fileType) {
      case 'MOV':
        type = 'video/quicktime';
      case 'mp4':
        type = 'video/mp4';
      case 'wmv':
        type = 'video/x-ms-wmv';
      case 'ts':
        type = 'video/MP2T';
    }

    axios({
      url: 'http://13.229.84.38/api/v1/request-upload', headers: {
        'x-auth-token': userData.authToken,
        'x-user-id': userData.userId,
      }, method: 'post'
    }).then((response) => {
      console.log(userData, response);
      this.setState({modalVisibleVideo: false, loadingModal: true});

      const {data} = response;

      const optionsThumb = {
        keyPrefix: "videos-thumbs/",
        bucket: data.bucket,
        region: data.region,
        accessKey: data.AccessKeyId,
        secretKey: data.SecretAccessKey,
        successActionStatus: 201,
        sessionToken: data.SessionToken
      };

      const options = {
        keyPrefix: "videos/",
        bucket: data.bucket,
        region: data.region,
        accessKey: data.AccessKeyId,
        secretKey: data.SecretAccessKey,
        successActionStatus: 201,
        sessionToken: data.SessionToken
      };

      axios({
        url: `${this.state.url}/api/v1/videos/add`,
        data: {
          title: videoTitle,
          projectId: this.state.activeProject,
          fileType: fileType,
          orientation: this.state.orientation
        },
        method: 'post'
      }).then((response) => {
        console.log(response);
        if (response.data === false) {
          alert('error')
        }

        const file = {
          uri: source.uri,
          name: `${response.data}.${fileType}`,
          type
        };

        const thumb = {
          uri: videoUri,
          name: response.data,
          type: 'image/png'
        };


        RNS3.put(file, options)
          .then((e) => {
            console.log(e)

          }).progress((e) => {
          let progress = e.loaded / e.total;
          if (progress === 1) {
            RNS3.put(thumb, optionsThumb)
              .progress((e) => {
                let progress = e.loaded / e.total;

                if (progress === 1) {
                  this.setState({loadingModal: false});
                  this._retrieveData();
                }
              });
          }
        });
      });

    })
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        // We have data!!
        const data = JSON.parse(value);
        this.setState({userData: data});
        axios.get('http://13.229.84.38/api/v1/projects',
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
            return null
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
          onRequestClose={() => {
            return null
          }}>
          <View style={styles.modalContainer}>

            <View style={styles.modalStyle}>
              <TouchableWithoutFeedback onPress={() => {
                this.setState({modalVisibleVideo: false})
              }}>
                <View>
                  <Icon style={{alignSelf: 'flex-end', marginRight: 10}} color={'white'} name={'times'} size={30}/>
                </View>
              </TouchableWithoutFeedback>

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
          visible={this.state.loadingModal}   onRequestClose={() => {
          return null
        }}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.7)'}}>
            <Text style={{color: 'white', fontSize: 40, marginBottom: 20}}>Uploading Video Please Wait...</Text>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.projectModal}   onRequestClose={() => {
          return null
        }}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.7)'}}>
            <View style={{
              justifyContent: 'center',
              backgroundColor: 'white',
              height: '50%',
              width: '70%',
              borderRadius: 10,
              padding: 20
            }}>
              <View>
                <Text style={{textAlign:'center', fontSize:30}}>{this.state.activeProjectName}</Text>
              </View>

              <Button
                onPress={() => {
                  this.setState({deleteProjectConfirmation:true, projectModal: false});
                }}
                title="Delete Project"
                color="#051c40"
                style={{backgroundColor: 'red'}}
              />
              <Button
                onPress={() => {
                  this.setState({projectModal: false})
                }}
                title="EXIT"
                color="#051c40"
                style={{backgroundColor: 'red'}}
              />
            </View>
          </View>
        </Modal>
        <AwesomeAlert
          show={this.state.confirmation}
          showProgress={false}
          title="Delete Video"
          message="are you sure you want to delete "
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.setState({confirmation:false});
          }}
          onConfirmPressed={() => {
            this.deleteVideo(this.state.deleteId);
            this.setState({confirmation:false});
          }}
        />
        <AwesomeAlert
          show={this.state.deleteProjectConfirmation}
          showProgress={false}
          title="Delete Project"
          message="are you sure you want to delete the project all videos will be lost"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.setState({ projectModal: true, deleteProjectConfirmation:false});
          }}
          onConfirmPressed={() => {
            this.deleteProject();
            this.setState({ deleteProjectConfirmation:false});
          }}
        />
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
  },
  removeButton: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    position: 'absolute',
    right: 1,
    borderRadius: 30 / 2,
    justifyContent: 'center'
  }
});

