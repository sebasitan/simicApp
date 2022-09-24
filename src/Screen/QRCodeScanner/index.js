import React, { Component, useEffect, useState } from 'react';
import {
    AppRegistry,
    Linking,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    TouchableOpacity,
    Platform,
    PermissionsAndroid
} from 'react-native';

import {
    Title,
    Paragraph,
} from 'react-native-paper';

import axios from "axios";

import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Utility from '../../Utility/inbdex';

import { API_BASE_URL } from '../../Services/url';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRCodeScreen = ({navigation, route}) => {

    const [userId,setUserId]=React.useState('');
    
    useEffect( () => {
        (
          async() => { 
            getUserInfo();
          }
        ) ();
    },[]);

    const getUserInfo = async() =>{
        let userData = await Utility.getFromLocalStorge('userToken');
        setUserId(userData);
    }

    const onSuccess = (e) => {

        if(userId !=''){
            let formData = {
                user_id: userId,
                qr_code: e.data,
            }
            axios({
                url: `${API_BASE_URL}/qrCheck`,
                method: 'POST',
                data: formData,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                if( res?.data?.status == 1){
                    let itemId = res?.data?.item_id;
                    //console.log(itemId);
                    navigation.navigate('AssetViewScreen', {
                        itemid: itemId,
                        userid: userId
                    })
                }else{
                    Alert.alert(
                        "Warning",
                        "Somthing went wrong, Try Again",
                        [
                          { text: "OK" }
                        ]
                    );
                }   
            }).catch(e => {
                Alert.alert(
                  "Warning",
                  "Somthing went wrong, Try Again",
                  [
                    { text: "OK" }
                  ]
                );
            });
        }

    };

    return(
        <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        reactivate={true}
        //topContent={}
        //bottomContent={}
      />
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection: "column",
        paddingLeft: 15,
        paddingRight: 15,
    },
    regularFont: {
      fontFamily : 'Montserrat-Regular'
    },
    primaryColor: {
      color: '#04487b'
    }
});

export default QRCodeScreen;