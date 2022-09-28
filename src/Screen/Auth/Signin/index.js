import React, { useContext, useEffect, useState } from 'react';

import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    Alert,
    ImageBackground,
    StatusBar
} from 'react-native';

import axios from "axios";
import * as Utiity from '../../../Utility/inbdex';
import DeviceInfo from 'react-native-device-info';

import { API_BASE_URL } from '../../../Services/url';
import { ActivityIndicator } from 'react-native-paper';

// import { AuthContext } from '../context/AuthContext';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    let deviceId = DeviceInfo.getDeviceId();
    let deviceType = DeviceInfo.getDeviceType();
    const [Loader,setLoader]=useState(false);

    // const { signIn } = React.useContext(AuthContext);

    const loginHandle = async  (email, password) => {
        setLoader(true);
        //signIn();
        let formData = {
            email_id: email,
            password: password,
            device_id: deviceId,
            device_type: deviceType,
        };
        //console.log(formData);
        axios({
            url: `${API_BASE_URL}/signIn`,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then  (res => {
            //console.log("Sign in res..", res)
            if (res.data.status == 1) {
                let userInfo = JSON.stringify(res.data.user_details);
                let result = JSON.parse(userInfo);
                //console.log("result data is ,", result)
                setLoader(false);
                Utiity.setInLocalStorge("userData",result)
                Utiity.setInLocalStorge('userToken', res?.data?.user_details?.user_id  || "1")
                navigation.navigate('DrawerNavigation')
            } else {
                setLoader(false)
                Alert.alert(
                    "Warning",
                    "Sorry, Email or Password Invalid",
                    [
                        { text: "OK" }
                    ]
                );
            }

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
    const registerPage = () => {
        navigation.navigate('Signup')
    }
    const ForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }
    const bgimg = '../../../assets/images/bg_login.jpeg';
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#04487b' hidden={false} />
            <ImageBackground source={require(bgimg)} resizeMode="cover" style={{ flex: 1, alignSelf: 'stretch' }}>
            {Loader?<ActivityIndicator style={{alignSelf:'center',marginTop:'20%'}} size={50} color="#04487b"/>:null}
                <View style={styles.container}>
                    <View style={styles.wrapper}>
                        <TextInput
                            placeholder='Enter email address'
                            value={email}
                            style={[styles.input, styles.fontFamily]}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            placeholder='Enter password'
                            value={password}
                            secureTextEntry
                            style={[styles.input, styles.fontFamily]}
                            onChangeText={text => setPassword(text)}
                        />
                        <TouchableOpacity onPress={() => ForgotPassword()}>
                            <View style={{ flexDirection: 'row', margin: 10, alignSelf: 'center' }}>
                                <Text style={styles.forgotPasswordText}>Password dimenticata</Text>
                            </View>
                        </TouchableOpacity>
                        <Button
                            title="Login"
                            color="#04487b"
                            style={styles.fontFamily}
                            onPress={() => { loginHandle(email, password) }}
                        />
                        <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center' }}>
                            <Text style={styles.registerHintText}>Nuovo uthente?</Text>
                            <TouchableOpacity onPress={() => registerPage()}>
                                <Text style={styles.registerText}>Registrati</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper: {
        width: '80%',
    },
    input: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 14,
    },
    Link: {
        color: 'blue',
    },
    fontFamily: {
        // fontFamily: 'Montserrat-Regular',
    },
    backgroundColor: {
        backgroundColor: '#900'
    },
    registerHintText: {
        fontSize: 14,
        fontWeight: '300',
        color: 'gray'
    },
    registerText: {
        marginLeft: 5,
        color: 'red',
        fontWeight: '900',
        textDecorationLine: 'underline'
    },
    forgotPasswordText: {
        textDecorationLine: 'underline',
        fontSize: 13,
        fontWeight: '400'
    }
});
export default SignIn;