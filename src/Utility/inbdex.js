import {Platform, Alert} from 'react-native';
import {Dimensions, PixelRatio} from 'react-native';
// import * as titles from '../constants/title';
export var deviceHeight = Dimensions.get('window').height;
export var deviceWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPageLimit = () => {
  return 10;
};

export const isFieldEmpty = (text) => {
  if (text == '') {
    return true;
  }
  return false;
};
export const passwordPattern = (password) => {
  const reg = /.*[0-9]+.*/i;
  if (reg.test(password) === true) {
    return true;
  }
  return false;
};

export const isValidEmail = (email) => {
  var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (reg.test(email) != true) {
    return true;
  }
  return false;
};

export let isValidOtp = (otp) => {
  if (otp.length < 4) {
    return false;
  }
  return true;
};

export const isValidPhoneNumber = (phoneNo) => {
  if (phoneNo.length < 8) {
    return false;
  }
  return true;
};

export const isValidComparedPassword = (newpassword, confirmPassword) => {
  if (newpassword != confirmPassword) {
    return true;
  }
  return false;
};
export const getOS = () => {
  if (Platform.OS === 'ios') {
    return 'ios';
  }
  return 'android';
};

export const showAlert = (message) => {
  Alert.alert(
    titles.APP_NAME,
    message,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
  );
};

export const showAlertWithCallBack = (msg, onOkClick) => {
  Alert.alert(
    '',
    msg,
    [
      {
        text: 'OK',
        onPress: () => {
          console.log(' CLICK CALLED ');
          onOkClick();
        },
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const setInLocalStorge = async (key, token) => {
  try {
    console.log(token);
    await AsyncStorage.setItem(key, JSON.stringify(token));
    //console.log('setInLocalStorge', res);
  } catch (err) {
    Alert.alert(
        "Warning",
        "Sorry, Email or Password Invalid",
        [
            { text: "OK" }
        ]
    );
  }
};

export const getFromLocalStorge = async (key: String) => {
  try {
    const token = await AsyncStorage.getItem(key);
    return token ? JSON.parse(token) : null;
  } catch (err) {
    console.log('getFromLocalStorge Error', err);
  }
};

export const removeAuthKey = async (key: String) => {
  try {
    let res = await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log('removeToken Error', err);
  }
};

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  } catch (err) {
    console.log('removeToken Error', err);
  }
  
};

export const widthPercentageToDP = (widthPercent) => {
  // console.log("Vikas ne dia  width check kar ",widthPercent)
  const screenWidth = Dimensions.get('window').width;
  // console.log("device width",screenWidth);
  const elemWidth = parseFloat(widthPercent);
  // console.log("bad ka width",PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100))
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
export const heightPercentageToDP = (heightPercent) => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
export const AuthToken = async (key: String) => {
  try {
    const token = await AsyncStorage.getItem(key);
    return token ? JSON.parse(token) : null;
  } catch (err) {
    console.log('authToken Error', err);
  }
};