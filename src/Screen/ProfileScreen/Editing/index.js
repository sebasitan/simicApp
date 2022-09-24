import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

import {
    Avatar,
    Title,
    Paragraph,
    ActivityIndicator,
} from 'react-native-paper';

import ImagePicker from 'react-native-image-crop-picker';

import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Utility from '../../../Utility/inbdex';
import axios from 'axios';
import { API_BASE_URL } from '../../../Services/url';

const ProfileEditing = ({ navigation, route }) => {
    //console.log(route?.params?.email_id);
    const [userData,setUserData]=React.useState(route?.params);
    const [username, setUsername]=React.useState('');
    const [userphone, setUserphone]=React.useState('');
    const [useremail, setUseremail]=React.useState('');
    const [userimg, setUserimg]=React.useState('');
    const [loader,setLoader]=React.useState(false);

    const updateprofile = () => {
        
        let formData = {
            user_name: username !='' ? username : userData?.user_name,
            mobile_no: userphone !='' ? userphone : userData?.mobile_no,
            profile: userimg !='' ? userimg : userData?.profile_image,
            user_id: userData?.user_id
        };
        //console.log(formData);
        axios({
            url: `${API_BASE_URL}profileUpdate`,
            method: 'POST',
            data: formData,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }).then(res => {
            alert("Profile Updated Succesffuly");
            //setLoader(false);
            if(res?.data?.status) {
              navigation.navigate('Profilo');
            }
          }).catch(e => {
            //setLoader(false)
            Alert.alert(
                  "Warning",
                  "Somthing went wrong, Try Again",
                  [
                    { text: "OK" }
                  ]
            );
        });
    };

    const AddprofileImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
          }).then(image => {
            const formData = new FormData();
            formData.append('profile_image', { type: image.mime, uri: image.path, name: image.path.split("/").pop() });
            axios({
              url: `${API_BASE_URL}profile_image`,
              method: 'POST',
              data: formData,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            }).then(res => {
                console.log(res);
              if (res?.data?.status == 1) {
                setUserimg(res?.data?.picture)
                alert("Image Added successfully")
              } else {
                alert("Image not uploaded")
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
        });
    };

    return(
        <View style={styles.container}>
            <StatusBar backgroundColor='#04487b' hidden={false} />
            {loader?
            <ActivityIndicator size={50}/>:null}
            <View style={{ flex: 1, marginTop: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    { userData?.profile_image_url !='' ? <Avatar.Image source={{ uri: userData?.profile_image_url }} avatarStyle={{ borderWidth: 0 }}/> : <Avatar.Image source={require('../../../assets/images/user.png')} /> }
                </View>
                <View style={{ flexDirection: 'column', marginTop: 20 }}>
                    <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="ios-person-circle-outline" size={20} color='#333'/>
                        <Title style={[styles.fontFamily, { fontSize: 15, marginLeft: 5 } ]}>Nome Utente</Title>
                    </View>
                    <View style={styles.inputConatiner}>
                        <TextInput
                            style={{ marginLeft: 10 }}
                            placeholder="Nome Utente"
                            defaultValue={userData?.user_name}
                            placeholderTextColor="black"
                            onChangeText={newText => setUsername(newText)}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 20 }}>
                    <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="md-call-sharp" size={20} color='#333'/>
                        <Title style={[styles.fontFamily, { fontSize: 15, marginLeft: 5 } ]}>Numero di telefono</Title>
                    </View>
                    <View style={styles.inputConatiner}>
                        <TextInput
                            style={{ marginLeft: 10 }}
                            placeholder="Numero di telefono"
                            defaultValue={userData?.mobile_no}
                            placeholderTextColor="black"
                            onChangeText={newText => setUserphone(newText)}
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 20 }}>
                    <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="mail" size={20} color='#333'/>
                        <Title style={[styles.fontFamily, { fontSize: 15, marginLeft: 5 } ]}>Email</Title>
                    </View>
                    <View style={styles.inputConatiner}>
                        <TextInput
                            style={{ marginLeft: 10 }}
                            placeholder="Email"
                            value={userData?.email_id}
                            placeholderTextColor="black"
                            onChangeText={newText => setUseremail(newText)}
                            editable={false} 
                            selectTextOnFocus={false}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'column', marginTop: 10, marginBottom: 10, alignSelf: 'center'}}>
                    <TouchableOpacity onPress={() => AddprofileImage()}>
                        <Text>Cambia immagine</Text>
                        <Ionicons name="camera" color='#04487b' size={16}></Ionicons>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ flexDirection: 'column', marginTop: 10, alignItems: 'center' }}>
                    <Button color='#04487b' style={[styles.fontFamily]} title="Salva" onPress={() => updateprofile()}/>
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
    },
    inputConatiner: { borderWidth: 1, alignSelf: 'center', width: '90%', borderRadius: 5 },
});

export default ProfileEditing;