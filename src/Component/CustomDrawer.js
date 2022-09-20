import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
//import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Utility from '../Utility/inbdex';

import { useNavigation } from '@react-navigation/native';

const CustomDrawer = (props) => {
  const [loginData,setLoginData]=React.useState();
  useEffect(()=>{
    getUserInfo()
  },[])
  const getUserInfo=async()=>{
    const  userToken =await Utility.getFromLocalStorge('userData');
    //console.log("drawer data?",userToken)
    setLoginData(userToken);
  }
  let bgimg = '../assets/images/bg_main.jpg';
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <ImageBackground
          source={require(bgimg)}
          resizeMode="cover" style={{ flex: 1, alignSelf: 'stretch' }}>
        <DrawerContentScrollView {...props}>
          <View style={{ flex : 1, flexDirection: 'row', justifyContent: 'flex-start', padding: 10, margin: 10 }}>
              <View>
              <Image
                  source={{uri:loginData?.profile_image_url}}
                  style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
                />
              </View>
              <View style={{ alignSelf: 'center'}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      fontFamily: 'Montserrat-Regular',
                      marginBottom: 5,
                      marginHorizontal:10,
                    }}>
                    {loginData?.user_name}
                  </Text>
              </View>
          </View>
          <View style={{ flex : 1}}>
            <DrawerItemList {...props} />
          </View>
          <View>
          <DrawerItem
                    icon={({ color, size }) =>(
                      <Ionicons 
                          name="ios-log-out-outline" 
                          size={25} 
                          color='#FFF' 
                      />
                  )}
                  label="Disconnettersi"
                  onPress={() => { Utility.signOut(); navigation.navigate('Signin'); }}
                  inactiveTintColor = '#FFF'
              />
          </View>
      </DrawerContentScrollView>
      </ImageBackground>
    </View>
  );
};

export default CustomDrawer;