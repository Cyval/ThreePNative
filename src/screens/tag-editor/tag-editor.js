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
  Dimensions
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content } from 'native-base';
import Video from 'react-native-video';
import Slider from 'react-native-slider';
import moment from 'moment';
import ImageZoom from 'react-native-image-pan-zoom';

import galaxyImage from '../../../galaxy.jpg';
import NavBar from '../../components/Navbar/Navbar';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.videoPlayer = React.createRef();
  }
  state = {
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
    skipButton: [true, false, false, false, false]
  };

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

  handlePress(evt){
    console.log(`x coord = ${evt.nativeEvent.locationX}`);
    this.setState({paused: !this.state.paused})
  }

  renderCustomSkin() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <Container>
        <ImageBackground source={galaxyImage}  style={{width: '100%', height: '100%'}}>
          <NavBar title={'Reebook'} {...this.props}/>

          <View style={{flex: 1}} >

              <TouchableWithoutFeedback style={styles.videoContainer} onPress={(evt) => {this.handlePress(evt)}}>
                {/*<ImageZoom cropWidth={Dimensions.get('window').width}*/}
                           {/*cropHeight={272}*/}
                           {/*imageWidth={Dimensions.get('window').width}*/}
                           {/*imageHeight={272}*/}
                           {/*minScale={1}*/}
                           {/*onClick={()=>this.setState({paused: !this.state.paused})}*/}
                {/*>*/}
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
                {/*</ImageZoom>*/}
              </TouchableWithoutFeedback>


            <View style={styles.controls}>
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
//
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
  },
  fullScreen: {
    flex: 1,
    width:'100%'
  },
  skipperContainer: {
    top: -5,
    backgroundColor: '#554358',
    height: 15,
    width: '100%',
    zIndex: -1
  },
  skipperButtonContainer: {
    top: -15,
    width: '100%',
    height: 60,
    flex: 1,
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
    top: -30,
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: "white",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
});
