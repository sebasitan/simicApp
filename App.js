
import React,{useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import StackAuthNavigator from './src/Navigation/StackNavigation';
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