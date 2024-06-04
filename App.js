//import API
import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StackNavigator from "./components/StackNavigation";
import BottomTabNavigator from "./components/BottomTabNavigation";
import DrawerNavigator from "./components/DrawerNavigation";

//Firebase

//test
import SignInScreen from './authentication/SignIn';

//const
const stackNav = createStackNavigator();
const bottomTab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
