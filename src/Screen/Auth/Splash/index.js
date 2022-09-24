import React from 'react';
import {View,Text, ActivityIndicator, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Splash=({navigation})=>{
    const [loader,setLoader]=React.useState(false)
    React.useEffect(() => {
        setLoader(true)
        setTimeout(() => {
          AsyncStorage.getItem('userToken').then((value) =>
            navigation.replace(
              value === null ? "Signin" : "DrawerNavigation"
            ),
          );setLoader(false)
        }, 2000);
      }, []);

      let bgimg = '../../../assets/images/splash.webp';
    return(
        <View style={{flex: 1}}>
        <ImageBackground
          source={require(bgimg)}
          resizeMode="cover" style={{ flex: 1, alignSelf: 'stretch' }}>
          </ImageBackground>
        </View>
    
    )
}
export default Splash;