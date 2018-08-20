import React, {Component} from 'react';
import {Container, Header, Left, Body, Right, Button, Title,} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, Image} from 'react-native'
import cog from '../../assets/cog.png';
import elip from '../../assets/elip.png';
import Orientation from "react-native-orientation";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT'
    }
  }

  _orientationDidChange(orientation) {
    this.setState({
      orientation
    })
  }

  componentDidMount() {
    //Lock Orientation to Portrait
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }


  componentWillUnmount() {
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange.bind(this));
  }

  render() {
    let {orientation} = this.state;

    return (
      <Header transparent
              style={orientation === 'PORTRAIT' ? styles.portraitHeader : styles.hideHeader}
      >
        <Left>
          <Button transparent onPress={()=>{this.props.navigation.openDrawer()}}>
            <Image source={elip} style={{width:30,height:30,resizeMode:'contain'}}/>
          </Button>
        </Left>
        <Body>
        <Title style={{color: 'white', fontSize: 25, fontFamily: 'HelveticaNeue'}}>{this.props.title}</Title>
        </Body>
        <Right>
          <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
            <Image source={cog} style={{width:30,height:30}}/>
          </Button>
        </Right>
      </Header>
    );
  }
}

{/*<Icon name='bars' color={'white'} size={30} onPress={()=>{this.props.navigation.openDrawer()}}/>*/}
{/*<Icon name='cog' color={'white'} size={30} onPress={()=>{this.props.navigation.goBack()}}/>*/}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomColor: "#95c717",
  },
  title: {
    color: "#fd9644",
  },
  portraitHeader: {
    height: 'auto'
  },
  hideHeader: {
    display: 'none',
    height: 0
  },

})