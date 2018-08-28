'use strict';
import React, {
  Component
} from 'react';

import {
  AlertIOS,
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Dimensions,
  Image,
  Modal
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content } from 'native-base';
import Video from 'react-native-video';
import Slider from 'react-native-slider';
import moment from 'moment';
import ImageZoom from 'react-native-image-pan-zoom';
import Orientation from 'react-native-orientation';

import galaxyImage from '../../assets/galaxy.jpg';
import dividerImage from '../../assets/divider.png';
import titleDividerImage from '../../assets/title-divider.png';
import editImage from '../../assets/edit.png';
import tagImage from '../../assets/tag.png';
import crosshair from '../../assets/crosshair.png';
import NavBar from '../../components/Navbar/Navbar';
import IconF from 'react-native-vector-icons/FontAwesome';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    Orientation.lockToLandscapeRight();
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.videoPlayer = React.createRef();
    this.state = {
      rate: 1,
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
      orientation: 'PORTRAIT',
      playerSize: {},
      videoHeight: Dimensions.get('window').width / (16 / 9),
      coords: {x: 0, y: 0},
      percentage: {x: 0, y: 0},
      modalVisible: false,
      tagActive:false,
     }
  }

  onLoad(data) {
    console.log('On load fired!');
    this.setState({duration: data.duration});
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

    if (paused === false) {
      this.setState({
        paused: false
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
        paused: false,
        skipButton: skipButton
      })
    } else {
      this.setState({
        paused: true,
        skipButton: skipButton
      })
    }
  }

  renderSkipperButtons() {

    let buttons = [];
    let {duration, currentTime, skipButton} = this.state;

    for (let i = 0; i < 5; i++)
    {
      let skipValue = duration / 5;

      // switch(i) {
      //   case 0:
      //     skipValue = 0;
      //     break;
      //   case 1:
      //     skipValue = skipValue;
      //     break;
      //   case 2:
      //     skipValue = skipValue * 2;
      //     break;
      //   case 3:
      //     skipValue = skipValue * 3;
      //     break;
      //   case 4:
      //     skipValue = skipValue * 4;
      //     break;
      //   default:
      //     skipValue = 0;
      //     break;
      // }

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
    if (this.state.paused && this.state.tagActive) {
      // Handle tagging
      let {locationX, locationY} = e.nativeEvent;
      let {width, height} = this.state.playerSize;

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
      this.setState({paused: !this.state.paused})
    }
  }

  handleTag(e) {
    this.setState({
      tagActive: !this.state.tagActive,
      paused: !this.state.paused
    })
  }

  handleCrosshair(e) {
    this.setState({
      modalVisible: true
    })
  }

  measureView(e) {
    let {width, height } = e.nativeEvent.layout;
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
      top: 0 + 36,
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

  componentDidMount() {
    //Lock Orientation to Landscape
    // Orientation.lockToPortrait();
    // Orientation.lockToLandscapeRight();
    // Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }

  _orientationDidChange(orientation) {
    this.setState({
      orientation
    })
  }

  componentWillUnmount() {
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange.bind(this));
  }

  renderCustomSkin() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
    let {orientation} = this.state;
    return (
      <Container>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          supportedOrientations={['portrait','landscape']}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={modalStyle.mainView}>
            <View style={{alignSelf: 'center'}}>
              <Text>CHOOSE TAG TYPE</Text>
              <TouchableWithoutFeedback onPress={()=>this.setState({modalVisible:false})}>
                <Text>Close</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>

        <ImageBackground source={galaxyImage}  style={{width: '100%', height: '100%'}}>
          <View style={{flex: 1}}>
            <View style={{flex:1,height:Dimensions.get('window').width}}>
              <TouchableWithoutFeedback style={ styles.videoContainerFullScreen} onPress={(evt) => {this.handlePress(evt)}}
                                        onLayout={(e) => this.measureView(e)}>
                  <Video
                    ref={ref => (this.videoPlayer = ref)}
                    source={{uri: "https://s3-ap-southeast-1.amazonaws.com/3p.touch/videos/bunny.mp4"}}
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
                  />
              </TouchableWithoutFeedback>

            </View>
            <View style={{position:'absolute', width:'100%',top:0, display:this.state.tagActive ? 'none' : 'flex'}}>
              <TouchableWithoutFeedback onPress={(e) => {this.handleTag(e)}} >
                <Image style={this.tagStyle()} source={tagImage}/>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={(e) => {
                this.props.navigation.navigate('Directory');
                Orientation.lockToPortrait();
              }} >
                <IconF style={{ position:'absolute',
                  left: 7,
                  padding: 4,
                  top: 36,}} name={'times'} color={'white'} size={25}/>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={(e) => {this.handleCrosshair(e)}} >
                <IconF style={{ position:'absolute',
                  right: 7,
                  padding: 4,
                  top: 72,}} name={'list'} color={'white'} size={25}/>
              </TouchableWithoutFeedback>
            </View>

            <TouchableWithoutFeedback onPress={(e) => {this.handleCrosshair(e)}} >
              <Image style={this.crosshairStyle()} source={crosshair}/>
            </TouchableWithoutFeedback>

            <View style={[styles.controls,{display:this.state.tagActive ? 'none': 'flex'}]}>
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
              <View style={styles.skipperContainer}>

              </View>

              <View style={styles.skipperButtonContainer}>

                {this.renderSkipperButtons()}

              </View>
            </View>
          </View>

        </ImageBackground>
      </Container>
    );
  }

  render() {
    return this.renderCustomSkin();
  }
}


const sliderStyle = StyleSheet.create({
  track: {
    height: 36,
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

const modalStyle = StyleSheet.create({
  mainView: {
    height: '80%',
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '5%'
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
    paddingTop: 15,
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
    height: Dimensions.get('window').width / (16 / 9)
  },
  videoContainerFullScreen: {
    position: 'absolute',
    zIndex: 50,
    height: '90%',
    width: '100%',
    top:0,
    backgroundColor:'white'
  },
  previewScreen: {
    flex: 1,
    width:'100%',
    height: Dimensions.get('window').width / (16 / 9)
  },
  fullScreen: {
    position: 'absolute',
    height:'100%%',
    width:'100%',
    zIndex: 50,
    top:0,
  },
  skipperContainer: {
    top: -4,
    backgroundColor: '#554358',
    height: 15,
    width: '100%',
    zIndex: -1
  },
  skipperButtonContainer: {
    top: -15,
    width: '100%',
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
  controls: {
    flex:1,
    backgroundColor: "transparent",
    borderRadius: 5,
    bottom: 0,
    position:'absolute',
    width: "100%",
    opacity:.5
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
  }
});
//
// const sliderStyle = StyleSheet.create({
//   track: {
//     height: 36,
//     borderRadius: 1,
//     backgroundColor: '#77B95B',
//   },
//   thumb: {
//     width: 10,
//     height: 50,
//     borderRadius: 1,
//     backgroundColor: '#FFFFFF',
//   }
// });
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//   },
//   fullScreen: {
//     flex: 1,
//     flexDirection: 'row',
//     top: -80,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
//   controls: {
//     backgroundColor: "transparent",
//     borderRadius: 5,
//     position: 'absolute',
//     top: 280,
//     left: 0,
//     right: 0,
//   },
//   progress: {
//     flex: 1,
//     flexDirection: 'row',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   innerProgressCompleted: {
//     height: 20,
//     backgroundColor: '#cccccc',
//   },
//   innerProgressRemaining: {
//     height: 20,
//     backgroundColor: '#2C2C2C',
//   },
//   generalControls: {
//     flex: 1,
//     flexDirection: 'row',
//     overflow: 'hidden',
//     paddingBottom: 10,
//   },
//   skinControl: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   rateControl: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   volumeControl: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   videoTime: {
//     alignSelf: 'center',
//     fontSize: 14,
//     color: "white",
//     paddingLeft: 2,
//     paddingRight: 2,
//     lineHeight: 12,
//     paddingTop: 15,
//     zIndex: 10,
//     position: 'absolute',
//   },
//   resizeModeControl: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   ignoreSilentSwitchControl: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   controlOption: {
//     alignSelf: 'center',
//     fontSize: 11,
//     color: "white",
//     paddingLeft: 2,
//     paddingRight: 2,
//     lineHeight: 12,
//   },
//   nativeVideoControls: {
//     top: 184,
//     height: 300
//   }
// });

