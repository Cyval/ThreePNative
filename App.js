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
  View,
  ImageBackground
} from 'react-native';

import Video from 'react-native-video';
import Slider from 'react-native-slider';
import moment from 'moment';

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
    this.videoPlayer.seek(value)

    if (paused === false) {
      this.setState({
        paused: false
      })
    }
  }

  renderSkinControl(skin) {
    const isSelected = this.state.skin == skin;
    const selectControls = skin == 'native' || skin == 'embed';
    return (
      <TouchableOpacity onPress={() => { this.setState({
        controls: selectControls,
        skin: skin
      }) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {skin}
        </Text>
      </TouchableOpacity>
    );
  }

  renderRateControl(rate) {
    const isSelected = (this.state.rate == rate);

    return (
      <TouchableOpacity onPress={() => { this.setState({rate: rate}) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {rate}x
        </Text>
      </TouchableOpacity>
    )
  }

  renderResizeModeControl(resizeMode) {
    const isSelected = (this.state.resizeMode == resizeMode);

    return (
      <TouchableOpacity onPress={() => { this.setState({resizeMode: resizeMode}) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {resizeMode}
        </Text>
      </TouchableOpacity>
    )
  }

  renderVolumeControl(volume) {
    const isSelected = (this.state.volume == volume);

    return (
      <TouchableOpacity onPress={() => { this.setState({volume: volume}) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {volume * 100}%
        </Text>
      </TouchableOpacity>
    )
  }

  renderIgnoreSilentSwitchControl(ignoreSilentSwitch) {
    const isSelected = (this.state.ignoreSilentSwitch == ignoreSilentSwitch);

    return (
      <TouchableOpacity onPress={() => { this.setState({ignoreSilentSwitch: ignoreSilentSwitch}) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {ignoreSilentSwitch}
        </Text>
      </TouchableOpacity>
    )
  }

  renderCustomSkin() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <ImageBackground source={require('./galaxy.jpg')}  style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.fullScreen} onPress={() => {this.setState({paused: !this.state.paused})}}>
            <Video
              ref={ref => (this.videoPlayer = ref)}
              source={require('./bunny.mp4')}
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
              onEnd={() => { AlertIOS.alert('Done!') }}
              repeat={true}
            />
          </TouchableOpacity>

          <View style={styles.controls}>
            {/*<View style={styles.generalControls}>*/}
              {/*<View style={styles.skinControl}>*/}
                {/*{this.renderSkinControl('custom')}*/}
                {/*{this.renderSkinControl('native')}*/}
                {/*{this.renderSkinControl('embed')}*/}
              {/*</View>*/}
            {/*</View>*/}
            {/*<View style={styles.generalControls}>*/}
              {/*/!*<View style={styles.rateControl}>*!/*/}
                {/*/!*{this.renderRateControl(0.5)}*!/*/}
                {/*/!*{this.renderRateControl(1.0)}*!/*/}
                {/*/!*{this.renderRateControl(2.0)}*!/*/}
              {/*/!*</View>*!/*/}

              {/*/!*<View style={styles.volumeControl}>*!/*/}
                {/*/!*{this.renderVolumeControl(0.5)}*!/*/}
                {/*/!*{this.renderVolumeControl(1)}*!/*/}
                {/*/!*{this.renderVolumeControl(1.5)}*!/*/}
              {/*/!*</View>*!/*/}

              {/*/!*<View style={styles.resizeModeControl}>*!/*/}
                {/*/!*{this.renderResizeModeControl('cover')}*!/*/}
                {/*/!*{this.renderResizeModeControl('contain')}*!/*/}
                {/*/!*{this.renderResizeModeControl('stretch')}*!/*/}
              {/*/!*</View>*!/*/}
            {/*</View>*/}
            {/*<View style={styles.generalControls}>*/}
              {/*{*/}
                {/*(Platform.OS === 'ios') ?*/}
                  {/*<View style={styles.ignoreSilentSwitchControl}>*/}
                    {/*{this.renderIgnoreSilentSwitchControl('ignore')}*/}
                    {/*{this.renderIgnoreSilentSwitchControl('obey')}*/}
                  {/*</View> : null*/}
              {/*}*/}
            {/*</View>*/}
            <Text style={styles.videoTime}>
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

            {/*<View style={styles.trackingControls}>*/}
              {/*<View style={styles.progress}>*/}
                {/*<View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />*/}
                {/*<View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />*/}
              {/*</View>*/}
            {/*</View>*/}
          </View>
        </View>
      </ImageBackground>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  fullScreen: {
    flex: 1,
    flexDirection: 'row',
    top: -80,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    backgroundColor: "transparent",
    borderRadius: 5,
    position: 'absolute',
    top: 280,
    left: 0,
    right: 0,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingBottom: 10,
  },
  skinControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
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
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ignoreSilentSwitchControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: "white",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  nativeVideoControls: {
    top: 184,
    height: 300
  }
});
