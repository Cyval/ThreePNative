// import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';
import {StatusBar, View, Platform, NativeModules, StyleSheet} from 'react-native';

const {StatusBarManager} = NativeModules;
import configureStore from './src/store/configureStore';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import React, {Component} from 'react';


//Screens
import TagEditor from './src/screens/tag-editor/tag-editor';
import Login from './src/screens/login/login';
import Directory from './src/screens/directory/directory';
import Drawer from './src/screens/drawer/CustomDrawer';

const store = configureStore();

const screens = {
  Directory: {
    screen: Directory,
    title: 'Directory'
  },
  Login: {
    screen: Login,
    title: 'Login',
  },
  TagEditor: {
    screen: TagEditor,
    title: 'TagEditor',
  },
};
//Register Screens
const AppStackNavigator = createDrawerNavigator(
  screens,
  {
    contentComponent: ({navigation}) => (
      <Drawer navigation={navigation} screens={screens}/>
    ),
  },
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>

          <StatusBar
            backgroundColor="blue"
            barStyle="dark-content"
          />

          <AppStackNavigator/>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 18 : 0,
    backgroundColor: "rgba(255,255,255,.7)",
  }

})
