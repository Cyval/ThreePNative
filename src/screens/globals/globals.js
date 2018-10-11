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
  ScrollView,
} from 'react-native';

import {BarChart, Grid, YAxis, XAxis, LineChart} from 'react-native-svg-charts';

import AwesomeAlert from 'react-native-awesome-alerts';


import {Component} from "react";
import React from "react";
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


export default class Directory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      selectedCountry: 'USA',
      selectedChartPeriod: 'Hourly',
      countries: ['USA', 'UK', 'MEX', 'AUS', 'PH'],
      chartPeriods: ['Hourly', 'Daily', 'Weekly', 'Monthly']
    }
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
    this.setState({ selectedCountry: country});
  }

  setActiveChartPeriod = (period) => {
    this.setState({ selectedChartPeriod: period });
  }

  render() {
    const {props} = this;
    const fill = 'rgb(134, 65, 244)';
    const data = [100, 124, 150, 86, 35, 10];

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
          <Text style={{color: '#8EA2C2', fontSize: 15, fontWeight: 'bold'}}>Jun 4 - Aug 10</Text>
          <Icon style={{color: '#8EA2C2'}} name={'calendar'} size={20}/>
        </View>
        <View style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-between',
          alignSelf: 'center',
          marginTop: 20
        }}>
          <Icon style={{color: '#8EA2C2'}} name={'chevron-left'} size={30}/>
          <Text style={{color: '#8EA2C2', fontSize: 25, fontWeight: 'bold'}}>Sample Video</Text>
          <Icon style={{color: '#8EA2C2'}} name={'chevron-right'} size={30}/>
        </View>

        <View style={{backgroundColor: '#fff', height: 200, flexDirection: 'row', flex: 1, marginTop: 20}}>
          <YAxis
            data={ data }
            contentInset={ { top: 20, bottom: 20} }
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={ 6 }
            formatLabel={ value => `${value}` }
          />
          <BarChart
            animate
            style={{ flex: 1, marginLeft: 20 }}
            spacingInner={0.3}
            data={ data }
            svg={{ fill }}
            contentInset={{ top: 20, bottom: 20 }}
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
          { this.showChartPeriods() }
          {/*<Text style={{*/}
            {/*padding: 5,*/}
            {/*backgroundColor: '#8B64FF',*/}
            {/*color: 'white',*/}
            {/*borderRadius: 10,*/}
            {/*overflow: 'hidden',*/}
            {/*borderWidth: 2,*/}
            {/*borderColor: 'white'*/}
          {/*}}>Hourly</Text>*/}
          {/*<Text style={{*/}
            {/*padding: 5,*/}
            {/*backgroundColor: '#8EA2C2',*/}
            {/*color: 'white',*/}
            {/*borderRadius: 10,*/}
            {/*overflow: 'hidden',*/}
            {/*borderWidth: 2,*/}
            {/*borderColor: '#8EA2C2'*/}
          {/*}}>Daily</Text>*/}
          {/*<Text style={{*/}
            {/*padding: 5,*/}
            {/*backgroundColor: '#8EA2C2',*/}
            {/*color: 'white',*/}
            {/*borderRadius: 10,*/}
            {/*overflow: 'hidden',*/}
            {/*borderWidth: 2,*/}
            {/*borderColor: '#8EA2C2'*/}
          {/*}}>Weekly</Text>*/}
          {/*<Text style={{*/}
            {/*padding: 5,*/}
            {/*backgroundColor: '#8EA2C2',*/}
            {/*color: 'white',*/}
            {/*borderRadius: 10,*/}
            {/*overflow: 'hidden',*/}
            {/*borderWidth: 2,*/}
            {/*borderColor: '#8EA2C2'*/}
          {/*}}>Monthly</Text>*/}
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

          { this.showCountryButtons() }

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

