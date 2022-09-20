import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  StatusBar,
  Switch,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native';
import {
    Avatar,
    Title,
    Paragraph,
    Modal
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SettingScreen = ({navigation}) => {
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [passwordModal,setPasswordModel]=useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    useEffect( () => { (
        async() => { 
            let userToken = await AsyncStorage.getItem('userToken');
            let userDatajosn = await AsyncStorage.getItem('userData');
            setUserToken(userToken);
            if(userToken !=null){
                setUserData(JSON.parse(userDatajosn));
            }
        } 
        ) ();
    });
    const showModal = () => setPasswordModel(true);
    const hideModal = () => setPasswordModel(false);
    const containerStyle = {backgroundColor: 'white',borderRadius:10,margin:10,paddingBottom:10};
    const signOut=()=>{
      navigation.navigate('Signin');
    }
    return(
        <View style={styles.container}>
            <StatusBar backgroundColor='#04487b' hidden={false} />
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, alignContent:'space-between' }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="ios-notifications-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Notifiche</Paragraph>
                  </View>
                  <Switch
                      trackColor={{ false: "#767577", true: "#04487b" }}
                      thumbColor={isEnabled ? "#B31817" : "#f4f3f4"}
                      ios_backgroundColor="#04487b"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      style={{ alignSelf: 'flex-end'}}
                    />
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, alignContent:'space-between' }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="ios-key-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Modifica Password</Paragraph>
                  </View>
                  <TouchableOpacity onPress={()=>setPasswordModel(!passwordModal)}>
                      <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity onPress={() =>  signOut()}
               >
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, alignContent:'space-between' }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="ios-exit-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Disconnettersi</Paragraph>
                  </View>
                  <TouchableOpacity onPress={() => { signOut() }}>
                      <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
                  </TouchableOpacity>
                </View>
                </TouchableOpacity>
            </View>
            <Modal visible={passwordModal} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <View>
              <View style={styles.chnmagePasswordConatiner}>
                <Text style={{color:'white',textAlign:'center',padding:10}}>Cambia password</Text>
                {/* <Ionicons name="ios-chevron-forward-sharp" style={{marginLeft}} size={25} color='#777'/> */}
              </View>
              <View style={styles.inputTextConatiner}>
              <Ionicons name="ios-key-outline" size={25} color='#333' style={{top:10}}/>
                <TextInput placeholder='vacchia password' placeholderTextColor="black"></TextInput>
              </View>
              <View style={styles.inputTextConatiner}> 
              <Ionicons name="ios-key-outline" size={25} color='#333' style={{top:10}}/>
                <TextInput placeholder='Nuova password' placeholderTextColor="black"></TextInput>
              </View>
              <View style={styles.inputTextConatiner}>
              <Ionicons name="ios-key-outline" size={25} color='#333' style={{top:10}}/>
                <TextInput placeholder='Conferma password' placeholderTextColor="black"></TextInput>
              </View>
              <TouchableOpacity onPress={()=>setPasswordModel(!passwordModal)}>
              <View style={styles.inviaConatiner}>
                <Text style={{color:'white'}}>Invia</Text>
              </View>
              </TouchableOpacity>
          </View>
        </Modal>
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
    inviaConatiner:{
        backgroundColor:'#04487b',
        alignSelf:'center',
        paddingHorizontal:15,
        borderRadius:5,
        paddingVertical:5,
        marginTop:20
    },
    chnmagePasswordConatiner:{
      backgroundColor:'#04487b',
      flexDirection:'row',
      justifyContent:'center',
      borderTopLeftRadius:10,
      borderTopRightRadius:10,
    },
    inputTextConatiner:{
      borderWidth:.5,
      borderColor:'black',
      flexDirection:'row',
    },
    fontFamily: {
      // fontFamily : 'Montserrat-Regular'
    }
});

export default SettingScreen;