import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Button,
  ScrollView, AsyncStorage,
} from 'react-native';

import {BarChart, Grid, YAxis, XAxis, LineChart} from 'react-native-svg-charts';
import {G} from 'react-native-svg';
import DateTimePicker from 'react-native-modal-datetime-picker'

import {Component} from "react";
import React from "react";
import moment from 'moment';
import galaxyImage from '../../assets/galaxy.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../../components/Navbar/Navbar';
import CountryButton from '../../components/globals/CountryButton';
import ChartPeriodButton from '../../components/globals/ChartPeriodButton';
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

const API_URL = 'http://13.229.84.38';

export default class Directory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: {},
      videoIds: [],
      selectedCountry: 'USA',
      selectedChartPeriod: 'Hourly',
      countries: ['USA', 'UK', 'MEX', 'AUS', 'PH'],
      chartPeriods: ['Hourly', 'Daily', 'Weekly', 'Monthly'],
      showDateSelectionModal: false,
      isFromDTVisible: false,
      isToDTVisible: false,
      fromDate: new Date(),
      toDate: new Date(),
      userData: {}
    }
  }

  componentDidMount() {
    this._retrieveData();
  }

  _retrieveData = async (vidId = null) => {
    try {
      const value = await AsyncStorage.getItem('userData');
      const ids = await AsyncStorage.getItem('video_ids_globals');
      const parsedIds = JSON.parse(ids);

      if (parsedIds && parsedIds.length > 0) this.setState({videoIds: parsedIds});

      const videoId = vidId || this.props.navigation.getParam('videoId', '0');

      if (value !== null) {
        // We have data!!
        const data = JSON.parse(value);
        this.setState({userData: data});
        axios.get(`${API_URL}/api/v1/videos/${videoId}`,
          {
            headers: {
              'x-auth-token': data.authToken,
              'x-user-id': data.userId,
            }
          }).then((response) => {
          const video = response.data.data;
          this.setState({video}, () => {
            this.setState({videoId});
          });
          // Alert.alert(JSON.stringify(video), vidId)
        }).catch(onReject => {

        })
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  onNextClick = () => {
    const {videoIds, video} = this.state;
    // Get current videoId
    const videoId = video._id;
    // locate videoId index from videoIds
    const idIndex = videoIds.indexOf(videoId);
    // handle possible out-of-bounds bug
    if (idIndex !== videoIds.length - 1) {
      this._retrieveData(videoIds[idIndex + 1])
    }
  }

  onPreviousClick = () => {
    const {videoIds, video} = this.state;
    // Get current videoId
    const videoId = video._id;
    // locate videoId index from videoIds
    const idIndex = videoIds.indexOf(videoId);
    // handle possible out-of-bounds bug
    if (idIndex - 1 >= 0) {
      this._retrieveData(videoIds[idIndex - 1])
    }
  }

  getTemporaryChartData = () => {
    return [100, 124, 150, 86, 35, 10]
  }

  getChartData = () => {
    this.setState({showDateSelectionModal: false}, () => {

    });
  }

  showChartPeriods = () => {
    return this.state.chartPeriods.map(period => {
      return (
        <ChartPeriodButton
          key={period}
          periodText={period}
          selectedChartPeriod={this.state.selectedChartPeriod}
          onChartPeriodSelect={() => this.setActiveChartPeriod(period)}
        />
      )
    })
  }

  showCountryButtons = () => {
    return this.state.countries.map(country => {
      return (
        <CountryButton
          key={country}
          countryText={country}
          selectedCountry={this.state.selectedCountry}
          onCountrySelect={() => this.setActiveCountry(country)}
        />
      )
    })
  }

  setActiveCountry = (country) => {
    this.setState({selectedCountry: country});
  }

  setActiveChartPeriod = (period) => {
    this.setState({selectedChartPeriod: period});
  }

  // FROM DATE selection
  _showFromDatePicker = () => this.setState({isFromDTVisible: true});

  _hideFromDatePicker = () => this.setState({isFromDTVisible: false});

  _handleFromDatePicked = (date) => {
    this.setState({ fromDate: date }, () => {
      this._hideFromDatePicker();
    })
  };

  // TO DATE selection
  _showToDatePicker = () => this.setState({isToDTVisible: true});

  _hideToDatePicker = () => this.setState({isToDTVisible: false});

  _handleToDatePicked = (date) => {
    this.setState({ toDate: date }, () => {
      this._hideToDatePicker();
    });
  };

  render() {
    const {props} = this;
    const {video, fromDate, toDate} = this.state;
    const fill = 'rgb(134, 65, 244)';
    const data = this.getTemporaryChartData();

    const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
    const formattedToDate = moment(toDate).format('YYYY-MM-DD');

    const headerFromDate = moment(fromDate).format('MMM DD');
    const headerToDate = moment(toDate).format('MMM DD');

    return (
      <ImageBackground source={galaxyImage} style={{width: '100%', flex: 1}}>
        <NavBar title={"Globals"} {...props}/>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          width: '90%',
          alignSelf: 'center'
        }}>
          <Text style={{color: '#8EA2C2', fontSize: 15, fontWeight: 'bold'}}>{headerFromDate} - {headerToDate}</Text>
          <TouchableWithoutFeedback onPress={() => this.setState({showDateSelectionModal: true})}>
            <View>
              <Icon style={{color: '#8EA2C2'}} name={'calendar'} size={20}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-between',
          alignSelf: 'center',
          marginTop: 20
        }}>
          <TouchableOpacity onPress={this.onPreviousClick}>
            <Icon style={{color: '#8EA2C2'}} name={'chevron-left'} size={30}/>
          </TouchableOpacity>
          <Text style={{color: '#8EA2C2', fontSize: 25, fontWeight: 'bold'}}>{video ? video.title : 'Mock Video'}</Text>
          <TouchableOpacity onPress={this.onNextClick}>
            <Icon style={{color: '#8EA2C2'}} name={'chevron-right'} size={30}/>
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor: '#fff', height: 200, flexDirection: 'row', flex: 1, marginTop: 20}}>
          <YAxis
              data={data}
              contentInset={{top: 20, bottom: 20}}
              svg={{
                fill: 'grey',
                fontSize: 10,
              }}
              numberOfTicks={6}
              formatLabel={value => `${value}`}
          />
          <BarChart
            style={{flex: 1, marginLeft: 20}}
            spacingInner={0.3}
            data={data}
            svg={{fill}}
            contentInset={{top: 20, bottom: 20}}
            numberOfTicks={6}
          >
            <Grid/>
          </BarChart>
        </View>

        <View style={{
          alignSelf: 'center',
          width: '90%',
          justifyContent: 'space-between',
          marginTop: 20,
          flexDirection: 'row'
        }}>
          {this.showChartPeriods()}
        </View>

        <View style={{height: 1, backgroundColor: '#8EA2C2', width: '90%', alignSelf: 'center', marginTop: 20}}/>

        <ScrollView horizontal={true} style={{
          alignSelf: 'center',
          width: '90%',
          height: 60,
          marginTop: 20,
          flexGrow: 0,
          flexDirection: 'row'
        }}>

          {this.showCountryButtons()}

        </ScrollView>

        <View style={{
          alignSelf: 'center',
          width: '90%',
          justifyContent: 'space-between',
          marginTop: 20,
          flexDirection: 'row'
        }}>
          <View style={{
            marginLeft: 10,
            marginRight: 10,
            flex: 1,
            borderWidth: 1,
            borderColor: 'white',
            padding: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#fff'
          }}>
            <Text style={{textAlign: 'center', color: 'white'}}>Watch Time</Text>
          </View>
          <View style={{
            marginLeft: 10,
            marginRight: 10,
            flex: 1,
            borderWidth: 1,
            borderColor: 'white',
            padding: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#fff'
          }}>
            <Text style={{textAlign: 'center', color: 'white'}}>View</Text>
          </View>

        </View>
        <View style={{
          alignSelf: 'center',
          width: '90%',
          justifyContent: 'space-between',
          marginTop: 20,
          flexDirection: 'row'
        }}>
          <View style={{
            marginLeft: 10,
            marginRight: 10,
            flex: 1,
            borderWidth: 1,
            borderColor: 'white',
            padding: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#fff'
          }}>
            <Text style={{textAlign: 'center', color: 'white'}}>Clickthrough</Text>
          </View>
          <View style={{
            marginLeft: 10,
            marginRight: 10,
            flex: 1,
            borderWidth: 1,
            borderColor: 'white',
            padding: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#fff'
          }}>
            <Text style={{textAlign: 'center', color: 'white'}}>Pause Duration</Text>
          </View>

        </View>

        <Modal
          animationType="slide"
          transparent
          visible={this.state.showDateSelectionModal}
          onRequestClose={() => {
            return null
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalStyle}>
              <Text style={styles.addTitle}>SELECT DATE</Text>
              <View style={{
                alignSelf: 'center', width: '70%'
              }}>
                <Text>From:</Text>
                <TouchableOpacity style={styles.dateSelectionButton} onPress={this._showFromDatePicker}>
                  <Text style={{textAlign: 'center', color: 'white'}}>{formattedFromDate}</Text>
                </TouchableOpacity>
              </View>

              <View style={{
                alignSelf: 'center', width: '70%', marginTop: 10
              }}>
                <Text>To:</Text>
                <TouchableOpacity style={styles.dateSelectionButton} onPress={this._showToDatePicker}>
                  <Text style={{textAlign: 'center', color: 'white'}}>{formattedToDate}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <View style={styles.addButton}>
                  <Button
                    onPress={() => {
                      this.getChartData()
                    }}
                    title="ADD"
                    color="#051c40"
                    style={{backgroundColor: 'red'}}
                  />
                </View>
                <View style={styles.addButton}>
                  <Button
                    onPress={() => {
                      this.setState({showDateSelectionModal: false})
                    }}
                    title="CANCEL"
                    color="#051c40"
                    style={{backgroundColor: 'red'}}
                  />
                </View>
              </View>
              <DateTimePicker
                isVisible={this.state.isFromDTVisible}
                onConfirm={this._handleFromDatePicked}
                onCancel={this._hideFromDatePicker}
              />

              <DateTimePicker
                isVisible={this.state.isToDTVisible}
                onConfirm={this._handleToDatePicked}
                onCancel={this._hideToDatePicker}
              />
            </View>

          </View>

        </Modal>
      </ImageBackground>
    )
  }

}


const styles = StyleSheet.create({
  countryActive: {
    backgroundColor: '#8B64FF',
    marginLeft: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
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
  dateSelectionButton: {
    backgroundColor: '#8B64FF',
    paddingTop: 10,
    paddingBottom: 10
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

