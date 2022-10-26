
import React,{useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import StackAuthNavigator from './src/Navigation/StackNavigation';
import {LogBox} from "react-native";

LogBox.ignoreLogs([
  "ViewPropTypes will be removed",
  "ColorPropType will be removed",
  "Require cycle:"
]);

const App= ()=>{
  useEffect(()=>{
    SplashScreen.hide();
  },[])
  return(
    <NavigationContainer >
      <StackAuthNavigator/>
    </NavigationContainer>
  )
}
export default App;