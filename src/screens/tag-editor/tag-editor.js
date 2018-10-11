'use strict';
import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Dimensions,
  Image,
  Modal,
  Animated,
  Easing,
  TextInput
} from 'react-native';
import { Container, Accordion } from 'native-base';
import Video from 'react-native-video';
import Slider from 'react-native-slider';
import moment from 'moment';
import Orientation from 'react-native-orientation';

import galaxyImage from '../../assets/galaxy.jpg';
import tagImage from '../../assets/tag.png';
import timerImage from '../../assets/timer.png';
import crosshair from '../../assets/crosshair.png';
import chevron from '../../assets/chevron-down.png';
import IconF from 'react-native-vector-icons/FontAwesome';
import Axios from 'axios';


export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    let orientation = props.navigation.getParam('orientation');

    if (orientation === 'portrait') {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscapeRight();
    }

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.videoPlayer = React.createRef();
    this.state = {
      rate: 1,
      vidId:this.props.navigation.getParam('vidId', '0'),
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: true,
      skin: 'custom',
      ignoreSilentSwitch: null,
      isBuffering: false,
      skipButton: [true, false, false, false, false],
      orientation,
      playerSize: {width: 0, height: 0},
      videoHeight: Dimensions.get('window').width / (16 / 9),
      coords: {x: 0, y: 0},
      percentage: {x: 0, y: 0},
      modalVisible: false,
      tagsModalVisible: false,
      tagDetailsModalVisible: false,
      tagActive: false,
      prevTagActive: true,
      tagSeconds: 4,
      tags: [], // Fetch array from tags data when available
      videoDimensions: {width: 0, height: 0},
      videoOrientation: orientation,
      userData: {},
      videoData: {}
    }
  }

  onLoad(data) {
    console.log(data)
    Orientation.getOrientation((err, orientation) => {
      console.log(orientation)
      this.setState({duration: data.duration, videoDimensions: data.naturalSize, videoOrientation: orientation});
    });
  }

  onProgress(data) {
    this.setState({currentTime: data.currentTime});
  }

  onBuffer({ isBuffering }: { isBuffering: boolean }) {
    this.setState({ isBuffering });
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }

  seekVideo(value) {
    let paused = this.state.paused;
    this.videoPlayer.seek(value);

    this.setState({
      currentTime: value
    })

    if (paused === false) {
      this.setState({
        currentTime: value
        // paused: false
      })
    }
  }

  skipToSection(value) {
    let {paused, duration} = this.state;

    let skipValue = duration / 5;
    let skipButton = [false, false, false, false, false];
    skipButton[value] = true;

    switch(value) {
      case 0:
        skipValue = 0;
        break;
      case 1:
        skipValue = skipValue;
        break;
      case 2:
        skipValue = skipValue * 2;
        break;
      case 3:
        skipValue = skipValue * 3;
        break;
      case 4:
        skipValue = skipValue * 4;
        break;
      default:
        skipValue = 0;
        break;
    }

    this.videoPlayer.seek(skipValue);

    if (paused === false) {
      this.setState({
        // paused: false,
        skipButton: skipButton,
        currentTime: skipValue
      })
    } else {
      this.setState({
        paused: true,
        skipButton: skipButton,
        currentTime: skipValue
      })
    }
  }

  renderSkipperButtons() {

    let buttons = [];
    let {duration, currentTime, skipButton} = this.state;

    for (let i = 0; i < 5; i++)
    {
      let skipValue = duration / 5;

      buttons.push(

        <View style={skipButton[i] ? styles.skipperButtonActive : styles.skipperButton} key={'skipper_' + i}>
          <TouchableWithoutFeedback onPress={() => {this.skipToSection(i)}}>
            <View style={skipButton[i] ? styles.skipperGreen : styles.skipperGray}>
              <Text style={styles.skipperTime}>
                {moment.utc(Math.floor(i === 0 ? 0 : skipValue * i)*1000).format('H:mm:ss')}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

      )
    }

    return buttons;

  }

  handlePress(e){
    console.log("handlePress")
    if (this.state.paused && this.state.tagActive) {
      // Handle tagging
      let {locationX, locationY} = e.nativeEvent;
      let {width, height} = this.calculateDimensions();

      let coords = {
        x: locationX,
        y: locationY
      };

      let percentage = {
        x: Math.round((locationX*100)/width * 100) / 100,
        y: Math.round((locationY*100)/height * 100) / 100
      };

      console.log("coords", coords, "percentage", percentage);

      this.setState({
        coords,
        percentage
      })

      //TODO: Add tag marker in coordinate position, show modal for tag entry
    } else {
      // this.setState({paused: !this.state.paused})
    }
  }

  handleTag(e) {
    this.setState({
      tagActive: !this.state.tagActive,
      prevTagActive: !this.state.prevTagActive,
      // paused: !this.state.paused
    })
  }

  tagOptionsModal(e) {
    this.setState({
      modalVisible: true
    })
  }

  toggleTagDetailsModal(e) {
    this.setState({
      tagDetailsModalVisible: true
    })
  }

  measureView(e) {
    let {width, height } = e.nativeEvent.layout;
    console.log(width, height)
    this.setState({
      playerSize: {width, height}
    })
  }

  tagStyle() {
    return  {
      position: 'absolute',
      height: 24,
      resizeMode: 'contain',
      zIndex: 100,
      width: 24,
      right: 8,
      padding: 4,
      top: 36,
    }
  }

  crosshairStyle() {
    if (this.state.tagActive) {
      return  {
        position: 'absolute',
        height: 40,
        resizeMode: 'contain',
        zIndex: 100,
        width: 40,
        top: this.state.coords.y - 20,
        left: this.state.coords.x - 20,
      }
    } else {
      return {
        position: 'absolute',
        display: 'none',
        height: 0
      }
    }

  }

  chevronStyle() {

    console.log(this.state.tagActive)

    let spinValue = new Animated.Value(0);

    // First set up animation
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start();

    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [!this.state.tagActive ? '0deg' : '180deg', '180deg']
    });

    const spinDown = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.tagActive ? '180deg' : '0deg', '0deg']
    });

    if (this.state.tagActive) {
      console.log([!this.state.tagActive ? '0deg' : '180deg', '180deg'])

      return  {
        transform: [{rotate: '180deg'}]
      }
    } else {
      console.log([this.state.tagActive ? '180deg' : '0deg', '0deg'])
      return {
        transform: [{rotate: '0deg'}]
      }
    }

  }

  controlsStyle() {

    let slideValue = new Animated.Value(0);

    // First set up animation
    Animated.timing(
      slideValue,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start();

    // Second interpolate beginning and end values (in this case 0 and 1)
    const slideUp = slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [!this.state.tagActive ? 80 : 0, 0]
    });

    const slideDown = slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.tagActive ? 0 : 80, 80]
    });

    if (this.state.tagActive) {
      return {
        transform: [{translateY: 80}]
      }
    } else {
      return {
        transform: [{translateY: 0}]
      }
    }

  }

  overlayControlsStyle() {
    if (this.state.tagActive) {
      return {position:'relative', width:'100%', top: 0, display: 'none', height: 0}
    } else {
      return {position:'absolute', width:'100%', top: 0 }
    }
  }

  modalStyle() {
    if (this.state.orientation === 'portrait') {
      return {
        height: '50%',
        width: '80%',
        backgroundColor: 'rgba(225,225,225,0.6)',
        borderRadius: 10,
        // marginLeft: '2.5%',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: '25%'
      }
    } else {
      if (this.state.percentage.x > 50) {
        return {
          height: '80%',
          width: '45%',
          backgroundColor: 'rgba(225,225,225,0.6)',
          borderRadius: 10,
          marginLeft: '2.5%',
          justifyContent: 'center',
          marginTop: '5%'
        }
      } else {
        return {
          height: '80%',
          width: '45%',
          backgroundColor: 'rgba(225,225,225,0.6)',
          borderRadius: 10,
          marginLeft: '52.5%',
          justifyContent: 'center',
          marginTop: '5%'
        }
      }
    }

  }

  detailsModalStyle() {
    if (this.state.orientation === 'portrait') {
      return {
        height: '50%',
        width: '80%',
        backgroundColor: 'rgba(180,180,180,0.7)',
        borderRadius: 10,
        // marginLeft: '2.5%',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: '25%'
      }
    } else {
      if (this.state.percentage.x > 50) {
        return {
          height: '80%',
          width: '80%',
          backgroundColor: 'rgba(180,180,180,0.7)',
          borderRadius: 10,
          // marginLeft: '2.5%',
          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: '25%'
        }
      } else {
        return {
          height: '80%',
          width: '45%',
          backgroundColor: 'rgba(180,180,180,0.7)',
          borderRadius: 10,
          marginLeft: '52.5%',
          justifyContent: 'center',
          marginTop: '5%'
        }
      }
    }

  }

  setTagSeconds(value) {
    this.setState({
      tagSeconds: value
    })
  }

  toggleTagsDirectoryModal() {
    this.setState({
      tagsModalVisible: !this.state.tagsModalVisible
    })
  }

  calculateDimensions() {
    let {playerSize, orientation, videoDimensions, videoOrientation } = this.state;

    // Workaround for video where width and height values are saved by camera but determined orientation by gyro
    let width = videoOrientation === "landscape" ? videoDimensions.width : videoDimensions.height;
    let height = videoOrientation === "landscape" ? videoDimensions.height : videoDimensions.width;

    let playerWidth =  playerSize.width;
    let playerHeight =  playerSize.height;

    let widthRatio = width / height;
    let heightRatio = height / width;

    let overlayWidth = 0;
    let overlayHeight = 0;

    // For 1:1 Video Ratio
    if (widthRatio === 1 && (orientation === 'landscape' || orientation === undefined)) {
      overlayWidth = playerHeight;
      overlayHeight = playerHeight;
    } else if (widthRatio === 1 && orientation === 'portrait') {
      overlayWidth = playerWidth;
      overlayHeight = playerWidth;
    } else if (widthRatio > heightRatio) {
      //Video is landscape
      overlayWidth = playerHeight * widthRatio;
      overlayHeight = playerHeight;
    } else if (heightRatio > widthRatio) {
      //Video is portrait
      overlayWidth = playerWidth;
      overlayHeight = playerWidth * heightRatio;
    }

    console.log('video', width, height);
    console.log('video ratio', widthRatio, heightRatio);
    console.log('player', playerWidth, playerHeight);
    console.log('overlay', overlayWidth, overlayHeight);

    return {
      width: overlayWidth,
      height: overlayHeight
    }

  }

  handleTagTypeButton(type) {
    let {tags, currentTime, tagSeconds} = this.state;
    let tagId = Math.random().toString(36).slice(-8);
    let tag = {
      startTime: currentTime,
      endTime: currentTime + tagSeconds,
      tagDuration: tagSeconds,
      tagId,
      type,
      title: "",
      information: "",
      sourceUrl: ""
    };
    tags.push(tag);
    this.setState({modalVisible: false, tagsModalVisible: true, tags});

    let vidId = this.props.navigation.getParam('vidId', '0');
    //Patch video ID
    Axios.patch(`http://13.229.84.38/api/v1/videos/${vidId}`,{
      tags: tags
    }).then((res) => {
      console.log(res);
    }).catch((error) => {
      console.log(error);
    });

  }

  handleEditTag(type) {

    //TODO: Find tagId from tags array and modify data

    // let {tags, currentTime, tagSeconds} = this.state;
    // let tag = {
    //   startTime: currentTime,
    //   endTime: currentTime + tagSeconds,
    //   tagDuration: tagSeconds,
    //   tagId: Math.random().toString(36).slice(-8),
    //   type: type
    // };
    //
    // tags.push(tag)
  }

  componentDidMount() {
    //Lock Orientation to Landscape
    // Orientation.lockToPortrait();
    // Orientation.lockToLandscapeRight();
    // Orientation.addOrientationListener(this._orientationDidChange.bind(this));
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        // We have data!!
        const data = JSON.parse(value);
        this.setState({userData: data});
        axios.get('http://13.229.84.38/api/v1/videos/'+this.state.vidId,
          {
            headers: {
              'x-auth-token': data.authToken,
              'x-user-id': data.userId,
            }
          }).then((response) => {
            if (response.data) {
              this.setState({
                videoData: response.data.data,
                tags: response.data.data.tags
              })
            }

        })
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _orientationDidChange(orientation) {
    this.setState({
      orientation
    })
  }

  componentWillUnmount() {
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange.bind(this));
  }

  _renderHeader = (dataArray, expanded) => {
    return (
      <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center'}}>
        <View style={{flex: 1, justifyContent: 'center',}}>
          <IconF style={{alignSelf: 'center'}} name={'chevron-right'} color={'white'} size={25}/>
        </View>
        <View style={{flex: 9}}>
          <View style={accordionStyle.listStyle}>
            <Text style={accordionStyle.title}>{dataArray.type + " Tag"}</Text>
          </View>
        </View>
      </View>
    );
  };

  _renderContent = (dataArray) => {
    return (
      <View>
        <View style={{
          justifyContent: 'center',
          marginBottom: 20,
          alignSelf: 'center',
          borderWidth: 3,
          borderRadius: 20,
          borderColor: 'white',
          backgroundColor: '#FFF',
          color: '#CCC',
          width: '100%',
          padding: 10,
        }} onClick={this.toggleTagDetailsModal.bind(this)}>
          <Text style={{alignSelf: 'center', color: '#CCC', fontSize: 20}}>TagID: {dataArray.tagId}</Text>
          <Text style={{alignSelf: 'center', color: '#CCC', fontSize: 20}}>Duration: {dataArray.tagDuration}</Text>
          <Text style={{alignSelf: 'center', color: '#CCC', fontSize: 20}}>Type: {dataArray.type}</Text>
        </View>
      </View>
    );
  }


  renderCustomSkin() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
    let {tagActive} = this.state;

    const vidUrl = `https://s3-ap-southeast-1.amazonaws.com/3p-videos/videos/${this.props.navigation.getParam('vidId', '0')}.${this.props.navigation.getParam('fileType', 'MOV')}`;

    return (
      <Container>

        {/*MODAL FOR ADDING TAGS*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          supportedOrientations={['portrait','landscape']}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={this.modalStyle()}>
            <View style={{alignSelf: 'center'}}>

              <TouchableWithoutFeedback onPress={()=>this.setState({modalVisible:false})}>
                <IconF style={{ position:'relative',zIndex:99999,
                  alignSelf: 'flex-end', marginRight: -30}} name={'times'} color={'#8EA2C2'} size={25}/>
              </TouchableWithoutFeedback>

              <Text style={modalStyle.headerTitle}>CHOOSE TAG TYPE</Text>

              <View style={modalStyle.durationContainer}>
                <Image source={timerImage} style={modalStyle.durationTimer} />
                <Text style={modalStyle.durationLabel}>DURATION</Text>
              </View>

              <Slider
                value={4}
                maximumValue={10}
                onValueChange={value => this.setTagSeconds(value)}
                trackStyle={tagSecondSliderStyle.track}
                thumbStyle={tagSecondSliderStyle.thumb}
                minimumTrackTintColor='#FFF'
              />

              <View style={modalStyle.secondsContainer}>
                <View style={modalStyle.defaultSecondsContainer}>
                  <Text style={modalStyle.defaultSeconds}>Default is 4 seconds</Text>
                </View>

                <View style={modalStyle.tagSecondsContainer}>
                  <Text style={modalStyle.tagSeconds}>{this.state.tagSeconds.toFixed(1)} sec</Text>
                </View>
              </View>

              <View style={modalStyle.tagTypes}>
                <View style={modalStyle.tagColumn}>
                  <TouchableWithoutFeedback onPress={this.handleTagTypeButton.bind(this, 'red')}>
                    <View style={modalStyle.redTag} />
                  </TouchableWithoutFeedback>
                  <Text style={modalStyle.tagLabel}>"Buy Now"</Text>
                </View>
                <View style={modalStyle.tagColumn}>
                  <TouchableWithoutFeedback onPress={this.handleTagTypeButton.bind(this, 'blue')}>
                    <View style={modalStyle.blueTag} />
                  </TouchableWithoutFeedback>
                  <Text style={modalStyle.tagLabel}>"Track Music"</Text>
                </View>
                <View style={modalStyle.tagColumn}>
                  <TouchableWithoutFeedback onPress={this.handleTagTypeButton.bind(this, 'green')}>
                    <View style={modalStyle.greenTag} />
                  </TouchableWithoutFeedback>
                  <Text style={modalStyle.tagLabel}>"More Info"</Text>
                </View>
              </View>

            </View>
          </View>
        </Modal>


        {/*MODAL FOR TAG DETAILS*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.tagDetailsModalVisible}
          supportedOrientations={['portrait','landscape']}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={this.detailsModalStyle()}>
            <View style={{alignSelf: 'center'}}>

              <TouchableWithoutFeedback onPress={()=>this.setState({tagDetailsModalVisible:false})}>
                <IconF style={{ position:'relative',zIndex:99999,
                  alignSelf: 'flex-end', marginRight: -30}} name={'times'} color={'#8EA2C2'} size={25}/>
              </TouchableWithoutFeedback>

              <View style={{width: '50%'}}>

                <Text style={modalStyle.headerTitle}>TAG INFORMATION</Text>

                <View style={modalStyle.tagTypes}>
                  <View style={modalStyle.tagColumn}>
                    <TouchableWithoutFeedback onPress={this.handleTagTypeButton.bind(this, 'red')}>
                      <View style={modalStyle.redTag} />
                    </TouchableWithoutFeedback>
                    <Text style={modalStyle.tagLabel}>"Buy Now"</Text>
                  </View>
                  <View style={modalStyle.tagColumn}>
                    <TouchableWithoutFeedback onPress={this.handleTagTypeButton.bind(this, 'blue')}>
                      <View style={modalStyle.blueTag} />
                    </TouchableWithoutFeedback>
                    <Text style={modalStyle.tagLabel}>"Track Music"</Text>
                  </View>
                  <View style={modalStyle.tagColumn}>
                    <TouchableWithoutFeedback onPress={this.handleTagTypeButton.bind(this, 'green')}>
                      <View style={modalStyle.greenTag} />
                    </TouchableWithoutFeedback>
                    <Text style={modalStyle.tagLabel}>"More Info"</Text>
                  </View>
                </View>

                <View style={{backgroundColor: '#FFF', borderRadius: 20}}>
                  <Text style={{fontSize: 15}}>CONFIRM</Text>
                </View>

              </View>

              <View style={{width: '50%'}}>
                <TextInput
                  style={styles.inputBox}
                  onChangeText={(projectTitle) => this.setState({projectTitle})}
                  value={this.state.projectTitle}
                  placeholder={'Project Title'}
                  placeholderTextColor={'#a4a4a4'}
                />

              </View>


            </View>
          </View>
        </Modal>


        {/*MODAL FOR TAG DIRECTORY*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.tagsModalVisible}
          supportedOrientations={['portrait','landscape']}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={tagDirectory.modalStyle}>

            {/*CLOSE TAG MODAL*/}
            <TouchableWithoutFeedback onPress={()=>this.setState({tagsModalVisible:false})}>
              <IconF style={{
                right: -5, top: 5}} name={'times'} color={'#8EA2C2'} size={25}/>
            </TouchableWithoutFeedback>

            <View style={tagDirectory.header}>
              <Image style={tagDirectory.headerIcon} source={tagImage}/>
              <Text style={tagDirectory.headerTitle}>TAG DIRECTORY</Text>
            </View>

            <View style={{flex: 9}}>
              <Accordion
                dataArray={this.state.tags}
                style={{borderColor: 'transparent'}}
                contentStyle={{borderColor: 'transparent'}}
                headerStyle={styles.listStyle}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
              />
            </View>

          </View>
        </Modal>

        {/*MAIN LAYOUT*/}
        <ImageBackground source={galaxyImage}  style={{width: '100%', height: '100%'}}>
          <View style={{flex: 1}}>
            <View style={{flex:1, height:Dimensions.get('window').width}}>



              {/*OVERLAY TOUCHABLE FOR ADDING TAGS*/}
              <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
                <View style={[
                  {
                    backgroundColor: 'rgba(255,0,0,0)',
                    position: 'absolute',
                    alignSelf: 'center',
                    zIndex: 51
                  },
                  this.calculateDimensions()
                ]}
                >
                  {/*CROSSHAIR ELEMENT*/}
                  <TouchableWithoutFeedback onPress={(e) => {this.tagOptionsModal(e)}} >
                    <Image style={this.crosshairStyle()} source={crosshair}/>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>

                {/*TOUCHABLE FOR GETTING SIZE OF VIDEO*/}
                <TouchableWithoutFeedback style={styles.videoContainerFullScreen} onLayout={(e) => this.measureView(e)}>
                    <Video
                      ref={ref => (this.videoPlayer = ref)}
                      source={{uri: vidUrl}}
                      style={styles.fullScreen}
                      rate={this.state.rate}
                      paused={this.state.paused}
                      volume={this.state.volume}
                      muted={this.state.muted}
                      ignoreSilentSwitch={this.state.ignoreSilentSwitch}
                      resizeMode={this.state.resizeMode}
                      onLoad={this.onLoad}
                      onBuffer={this.onBuffer}
                      onProgress={this.onProgress}
                      onEnd={() => { }}
                      repeat={true}
                      onLayout={(e) => { console.log(e.nativeEvent.layout)}}
                    />
                </TouchableWithoutFeedback>

              </View>

            </View>

            {/*RIGHTSIDE CONTROLS CONTAINER*/}
            <View style={this.overlayControlsStyle()}>
              <TouchableWithoutFeedback onPress={(e) => {this.handleTag(e)}} >
                <Image style={this.tagStyle()} source={tagImage}/>
              </TouchableWithoutFeedback>

              {/*CLOSE BUTTON*/}
              <TouchableWithoutFeedback onPress={(e) => {
                this.props.navigation.navigate('Directory');
                Orientation.lockToPortrait();
              }} >
                <IconF style={{ position:'absolute',
                  left: 7,
                  padding: 4,
                  top: 36,}} name={'times'} color={'white'} size={25}/>
              </TouchableWithoutFeedback>

              {/*TAG LIST DIRECTORY*/}
              <TouchableWithoutFeedback onPress={(e) => {this.toggleTagsDirectoryModal(e)}} >
                <IconF style={{ position:'absolute',
                  right: 7,
                  padding: 4,
                  top: 72,}} name={'list'} color={'white'} size={25}/>
              </TouchableWithoutFeedback>
            </View>


            {/*VIDEO SLIDER CONTROLS*/}
            <Animated.View style={[styles.controlsContainer, this.controlsStyle()]}>
              <TouchableWithoutFeedback onPress={(e) => {this.handleTag(e)}} >
                <View style={styles.slidePuller}>
                  <Animated.Image style={[styles.slideChevron, this.chevronStyle()]} source={chevron}/>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.skipperContainerBarTop}>
              </View>
              <Text style={textStyles.videoTime} pointerEvents="none">
                {moment.utc(Math.floor(this.state.currentTime)*1000).format('HH:mm:ss')} / {moment.utc(Math.floor(this.state.duration)*1000).format('HH:mm:ss')}
              </Text>
              <Slider
                value={this.state.currentTime}
                maximumValue={this.state.duration}
                onValueChange={value => this.seekVideo(value)}
                trackStyle={sliderStyle.track}
                thumbStyle={sliderStyle.thumb}
                minimumTrackTintColor='#77B95B'
              />
              <View style={styles.skipperContainerBarBottom}>
              </View>

              <View style={styles.skipperLandScapeContainer}>
                <View style={styles.skipperButtonContainer}>

                  {this.renderSkipperButtons()}

                </View>
              </View>
            </Animated.View>

        </ImageBackground>
      </Container>
    );
  }

  render() {
    return this.renderCustomSkin();
  }
}

const accordionStyle = StyleSheet.create({
  listStyle: {
    borderBottomColor: "#fff",
    alignSelf: 'center',
    width: '90%',
    color: "white",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'HelveticaNeue',
    fontWeight: 'bold'
  },
});

const tagDirectory = StyleSheet.create({
  modalStyle: {
    height: '100%',
    width: '50%',
    backgroundColor: 'rgba(46,44,76,0.9)',
    borderRadius: 0,
    marginLeft: '50%',
    marginTop: '2.5%',
    fontFamily: 'GillSans'
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    fontFamily: 'HelveticaNeue'
  },
  headerIcon: {
    height: 24,
    width: 24,
    marginRight: 10,
    padding: 4,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

const sliderStyle = StyleSheet.create({
  track: {
    height: 30,
    borderRadius: 1,
    backgroundColor: '#77B95B',
  },
  thumb: {
    width: 10,
    height: 50,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  }
});

const tagSecondSliderStyle = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 1,
    backgroundColor: '#FFF',
  },
  thumb: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderRadius: 50,
    borderColor: '#FFFFFF',
    backgroundColor: '#9EA5A4',
  }
});

const modalStyle = StyleSheet.create({
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 5
  },
  durationContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  durationTimer: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  durationLabel: {
    fontSize: 18,
    color: '#FFF'
  },
  secondsContainer: {
    flex: 0,
    flexDirection: 'row',
  },
  defaultSecondsContainer: {
    flex: 1,
  },
  defaultSeconds: {
    fontSize: 12,
    color: '#FFF',
  },
  tagSecondsContainer: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center'
  },
  tagSeconds: {
    textAlign: 'center',
    fontSize: 12,
    color: '#FFF',
    backgroundColor: '#9EA5A4',
    borderWidth: 1,
    width: '60%',
    borderColor: 'rgba(0,0,0,0.4)',
    alignSelf: 'center',
    borderRadius: 5,
  },
  tagTypes: {
    marginTop: 20,
    flex: 0,
    flexDirection: 'row',
  },
  tagColumn: {
    flex: 1,
    width: '33%',
  },
  tagLabel: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  redTag: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#D11313',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5
  },
  blueTag: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#3D359B',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5
  },
  greenTag: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#399B35',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5
  }
});

const textStyles = StyleSheet.create({
  videoTime: {
    alignSelf: 'center',
    fontSize: 14,
    color: "white",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
    paddingTop: 66,
    zIndex: 10,
    position: 'absolute',
  },
  headerTitle: {
    alignSelf: 'center',
    fontSize: 20,
    color: "white",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
    paddingTop: 15,
    zIndex: 10,
    position: 'absolute',
  },
});

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  videoContainer: {
    flex: 1,
    height: Dimensions.get('window').width / (16 / 9),
    backgroundColor: 'rgba(255,0,0,0)',
  },
  videoContainerFullScreen: {
    position: 'absolute',
    zIndex: 50,
    height: '90%',
    top:0,
    backgroundColor: 'rgba(255,0,0,0)',
  },
  previewScreen: {
    flex: 1,
    width:'100%',
    height: Dimensions.get('window').width / (16 / 9)
  },
  fullScreen: {
    position: 'absolute',
    height:'100%',
    width:'100%',
    zIndex: 0,
    top:0,
  },
  controlsContainer: {
    flex:1,
    backgroundColor: "transparent",
    borderRadius: 5,
    bottom: 0,
    position:'absolute',
    width: "100%",
    zIndex:99999,
    opacity: 1,
  },
  slidePuller: {
    backgroundColor: '#554358',
    right: 0,
    width: 50,
    height: 40,
    top: 20,
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  slideChevron: {
    height: 15,
    width: 24,
    marginTop: 5
  },
  skipperContainerBarTop: {
    top: 7,
    backgroundColor: '#554358',
    height: 10,
    width: '100%',
    zIndex: -1
  },
  skipperContainerBarBottom: {
    top: -7,
    backgroundColor: '#554358',
    height: 10,
    width: '100%',
    zIndex: -1
  },
  skipperLandScapeContainer: {
    top: -19,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  skipperButtonContainer: {
    width: '60%',
    height: 30,
    flex: 0,
    flexDirection: 'row',
  },
  skipperButton: {
    flex: 1,
    width: '20%',
    top: 10,
    backgroundColor: 'transparent',
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: 5,
    paddingBottom: 5,
  },
  skipperButtonActive: {
    flex: 1,
    width: '20%',
    top: 10,
    backgroundColor: '#554358',
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  skipperGreen: {
    flex: 1,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#77B95B',
    borderRadius: 50,
    borderColor: '#B9F5A0',
    borderWidth: 3,
    borderStyle: 'solid',
  },
  skipperGray: {
    flex: 1,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#AAA',
    borderRadius: 50
  },
  skipperTime: {
    alignSelf: 'center',
    color: '#FFFFFF',
  },

  controlsFullScreen: {
    display: 'none',
    height: 0
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: "white",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  dividerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputBox: {
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
});