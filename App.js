// import { Navigation } from 'react-native-navigation';
import {Provider} from 'react-redux';
import {StatusBar, View, Platform, NativeModules, StyleSheet, } from 'react-native';

const {StatusBarManager} = NativeModules;
import configureStore from './src/store/configureStore';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
import {createDrawerNavigator, createSwitchNavigator} from 'react-navigation';
import React, {Component} from 'react';


//Screens
import TagEditor from './src/screens/tag-editor/tag-editor';
import Login from './src/screens/login/login';
import Directory from './src/screens/directory/directory';
import Drawer from './src/screens/drawer/CustomDrawer';

//loading screens
import AuthLoadingScreen from './src/auth/AuthLoadingScreen'

const store = configureStore();

const AuthScreens = {
  Login: {
    screen: Login,
    title: 'Login',
  },
};

const screens = {

  Directory: {
    screen: Directory,
    title: 'Directory'
  },
  TagEditor: {
    screen: TagEditor,
    title: 'TagEditor',
  },
};


//Register Screens
const AppStack = createDrawerNavigator(
  screens,
  {
    contentComponent: ({navigation}) => (
      <Drawer navigation={navigation} screens={screens}/>
    ),
  },
);

const AuthStack = createDrawerNavigator(AuthScreens);

const AppStackNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
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
