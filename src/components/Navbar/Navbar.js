import React, {Component} from 'react';
import {Container, Header, Left, Body, Right, Button, Title,} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet} from 'react-native'

export default class Navbar extends Component {
  render() {
    return (

      <Header transparent>
        <Left>
          <Button transparent>
            <Icon name='bars' color={'white'} size={30} onPress={()=>{this.props.navigation.openDrawer()}}/>
          </Button>
        </Left>
        <Body>
        <Title style={{color: 'white', fontSize: 25, fontFamily: 'HelveticaNeue'}}>Directory</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name='cog' color={'white'} size={30} onPress={()=>{this.props.navigation.goBack()}}/>
          </Button>
        </Right>
      </Header>
    );
  }
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomColor: "#95c717",
  },
  title: {
    color: "#fd9644",
  }

})