import React, {Component} from 'react';
import _ from 'lodash';
import {
  Modal,
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Easing,
  Platform,
  ActivityIndicator
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoute: 0,
    };
  }
  onItemPress(item) {
    const {navigation} = this.props;
    navigation.navigate(item.key);
  }

  renderDrawerItem() {
    const {screens} = this.props;
    const {activeRoute} = this.state;

    if (screens) {
      let navDataArray = [];

      _.map(screens, function (val, key) {
        if (!val.isHidden) {
          val.key = key;
          navDataArray.push(val);
        }
      });

      let navItemList = <FlatList
        data={navDataArray}
        renderItem={({item}) =>
          <TouchableOpacity
            key={item.title}
            style={
              (activeRoute === item.title)
                ? [styles.navItem, {backgroundColor: '#fd9543'}]
                : styles.navItem
            }
            onPress={() => {
              // route.navigate(item)
              this.props.navigation.navigate(item.title);
            }}
          >


            <Text
              style={
                (activeRoute === item.title)
                  ? [styles.itemText, {color: 'white'}]
                  : styles.itemText
              }
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        }
      />;

      return navItemList;
    }
    return null;
  }

  componentWillReceiveProps(nextProps) {
    const {index, routes} = nextProps.navigation.state;
    const activeRouteIndex = index;
    const activeRoute = routes[activeRouteIndex].routeName;
    this.setState({activeRoute: activeRoute});
  }

  render() {
    return (
      <View style={styles.sideDrawerContainer}>
        <View style={{flex: 1}}>
          <View style={styles.sideDrawerheader}>

          </View>
          <View style={{flex: 7}}>
            {this.renderDrawerItem(this.props.navigation)}
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              key={'logout'}
              onPress={()=>{
                this.props.navigation.navigate('Login');
              }}
            >
              <Text style={{alignSelf:'center'}}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sideDrawerContainer: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  navItem: {
    alignItems: 'center',
    paddingLeft: 20,
    width: 320,
    flex: 1,
    flexDirection: 'row',
    height: 60,
  },
  itemText: {
    paddingLeft: 20,
  },
  sideDrawerheader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flex: 1,
    height: null,
    width: 200,
    resizeMode: 'contain',
    margin: 10,
    marginLeft: 0,
  }
});

export default DrawerContent;