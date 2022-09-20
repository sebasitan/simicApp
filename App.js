
import React,{useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawNavigator from './src/Navigation/DrawerNavigation';
import MainStack1 from './src/Navigation/StackNavigation';
import SplashScreen from 'react-native-splash-screen';
import StackAuthNavigator from './src/Navigation/StackAuthNavigator';
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