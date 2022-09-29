import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert
} from 'react-native';
import axios from "axios";
import { API_BASE_URL } from '../../../Services/url';
const ForgotPassword = ({navigation}) => {
    const [ email, setEmail ] = useState(null);

    const forgotHandle = (email) =>{
        let formData = {
            email_id : email,
        };
        console.log(formData);
        axios({
            url: `${API_BASE_URL}/forgotPassword`,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            console.log(res.data);
            if(res.data.status == 1){
                let message = JSON.stringify(res.data.message);
                Alert.alert(
                    "message",
                    message,
                    [ { text: "OK" } ]
                );
            }else{
                let message = JSON.stringify(res.data.message);
                Alert.alert(
                    "Warning",
                    message,
                    [ { text: "OK" } ]
                );
            }
        }).catch(e => {
            Alert.alert(
                "Warning",
                "Somthing went wrong, Try Again",
                [ { text: "OK" } ]
            );
        });
    }
    const loginPage=()=>{
        navigation.navigate('Signin')
    }
    const bgimg = '../../../assets/images/bg_login.jpeg';
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#04487b' hidden={false} />
            <ImageBackground source={require(bgimg)} resizeMode="cover" style={{ flex: 1, alignSelf: 'stretch' }}>
                <View style={styles.container}>
                    <View style={styles.wrapper}>
                        <TextInput 
                            placeholder='Email' 
                            value={email} 
                            style={[styles.input, styles.fontFamily ]}
                            onChangeText = { text => setEmail(text) }
                        />
                        <Button
                            title="Invia"
                            color="#04487b"
                            style={styles.fontFamily}
                            onPress={ () => { forgotHandle(email) } }
                        />
                        <View style={{ flexDirection : 'row', marginTop: 20,alignSelf:'center'}}>
                            <Text style={styles.registerHintText}>Torna Indietro?</Text>
                            <TouchableOpacity onPress={()=>loginPage()}>
                            <Text style={styles.registerText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    wrapper : {
        width : '80%',
    },
    input : {
        marginBottom : 12,
        borderWidth : 1,
        borderColor : '#bbb',
        borderRadius: 5,
        paddingHorizontal: 14,
    },
    Link : {
        color: 'blue',
    },
    fontFamily :{
        fontFamily: 'Montserrat-Regular',
    },
    backgroundColor : {
        backgroundColor : '#900'
    },
    registerHintText:{
        fontSize:14,
        fontWeight:'300',
        color:'gray'
    },
    registerText:{
        marginLeft:5,
        color:'red',
        fontWeight:'900',
        textDecorationLine:'underline'
    },
    forgotPasswordText:{
        textDecorationLine:'underline',
        fontSize:13,
        fontWeight:'400'
    }
});
export default ForgotPassword;