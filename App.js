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


const store = configureStore();

const screens = {
  Login: {
    screen: Login,
    title: 'Login',
  },
  TagEditor: {
    screen: TagEditor,
    title: 'Tag Editor',
  }
};
//Register Screens
const AppStackNavigator = createDrawerNavigator(
  screens,
);


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <View style={styles.statusBarBackground}>
            <StatusBar
              backgroundColor="blue"
              barStyle="dark-content"
            />
          </View>
          <AppStackNavigator/>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 18 : 0, //this is just to test if the platform is iOS to give it a height of 18, else, no height (Android apps have their own status bar)
    backgroundColor: "rgba(255,255,255,.7)",
  }

})
