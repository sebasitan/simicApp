import React from 'react';
import {View,Text, ActivityIndicator} from 'react-native';
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
    return(
        <View style={{alignSelf:'center',justifyContent:'center',marginTop:"50%"}}>
        <ActivityIndicator size={50} color="red"/>
        </View>
    
    )
}
export default Splash;