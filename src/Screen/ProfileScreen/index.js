import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  TouchableOpacity
} from 'react-native';

import {
    Avatar,
    Title,
    Paragraph,
    ActivityIndicator,
} from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Utility from '../../Utility/inbdex';
import axios from 'axios';
import { API_BASE_URL } from '../../Services/url';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const ProfileScreen = ({navigation}) => {
  
    const [userid,setUserId]=React.useState();
    const [userDetilas,setUserDetails]=React.useState()
    const [userData,setUserData]=React.useState();
    const [loader,setLoader]=React.useState(false);
    const isFocused = useIsFocused();

    useEffect( () => {
        getUserInfor()
    },[isFocused]);
    
    const getUserInfor=async()=>{
        let userId=await Utility.getFromLocalStorge('userToken')
        setUserId(userId)
        getCalluserdetailsApi(userId)
    }
    const getCalluserdetailsApi=(userId)=>{
        setLoader(true)
        let formData = {
            user_id: userId,
           
        }
        //console.log("aessets addition form...", formData)
        axios({
            url: `${API_BASE_URL}profileView`,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log("vikas profile view", res?.data?.user_details)
            setLoader(false)
            setUserData(res?.data?.user_details)
        }).catch(e => {
            setLoader(false)
            Alert.alert(
                "Warning",
                "Somthing went wrong, Try Again",
                [
                    { text: "OK" }
                ]
            );
        });
    }

    const modifyprofile = (data) => {
        //console.log(data);
        navigation.navigate('ProfileEditing', data);
    };

    return(
        <View style={styles.container}>
            <StatusBar backgroundColor='#04487b' hidden={false} />
            {loader?
            <ActivityIndicator size={50}/>:null}
            <View style={{ flex: 1, marginTop: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    { userData?.profile_image_url !='' ? <Avatar.Image source={{ uri: userData?.profile_image_url }} avatarStyle={{ borderWidth: 0 }}/> : <Avatar.Image source={require('../../assets/images/user.png')} /> }
                </View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', marginTop: 20 }}>
                    <Ionicons name="ios-person-circle-outline" size={30} color='#333'/>
                    <View style={{ marginLeft: 10 }}>
                        <Paragraph style={styles.fontFamily }>Nome Utente</Paragraph>
                        <Title style={[styles.fontFamily, { fontSize: 12 } ]} >{ userData?.user_name }</Title>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingTop: 10}}>
                    <Ionicons name="md-call-sharp" size={25} color='#333'/>
                    <View style={{ marginLeft: 10 }}>
                        <Paragraph style={styles.fontFamily }>Numero di telefono</Paragraph>
                        <Title style={[styles.fontFamily, { fontSize: 12 } ]} >{ userData?.mobile_no }</Title>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 10}}>
                    <Ionicons name="mail" size={25} color='#333'/>
                    <View style={{ marginLeft: 10 }}>
                        <Paragraph style={styles.fontFamily }>Email</Paragraph>
                        <Title style={[styles.fontFamily, { fontSize: 12 } ]} >{ userData?.email_id }</Title>
                    </View>
                </View>
                <TouchableOpacity style={{ flexDirection: 'column', marginTop: 10, alignItems: 'center' }}>
                    <Button color='#04487b' style={[styles.fontFamily]} title="Modifica" onPress={() => modifyprofile(userData)} />
                </TouchableOpacity>
            </View>
        </View>
    );
} 

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection: "column",
        paddingLeft: 15,
        paddingRight: 15,
    },
    itemStyle: {
        padding: 10,
    },
    viewStyle: {
      justifyContent: 'center',
      flex: 1,
      marginTop: 40,
      padding: 16,
    },
    textStyle: {
      padding: 10,
    },
    textInputStyle: {
      height: 40,
      borderWidth: 1,
      borderColor: '#009688',
      backgroundColor: '#FFFFFF',
    },
    fontFamily: {
        fontFamily : 'Montserrat-Regular'
    }
});

export default ProfileScreen;