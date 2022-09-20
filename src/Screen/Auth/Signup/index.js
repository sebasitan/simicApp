import React, {useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    ImageBackground,
    Alert
  } from 'react-native';
const RegisterScreen = ({navigation}) => {
    const [ name, setName ] = useState(null);
    const [ email, setEmail ] = useState(null);
    const [ password, setPassword ] = useState(null);
    const [ phone, setPhone ] = useState(null);
    const  bgimg = '../../../assets/images/bg_login.jpeg';
    const RegisterActionCall=()=>{
        Alert.alert("REgister Action call")
    }
    return (
        <View style={styles.container}>
              <ImageBackground source={require(bgimg)} resizeMode="cover" style={{ flex: 1, alignSelf: 'stretch' }}>
            <View style={styles.wrapper}>
                <TextInput 
                    placeholder='Nome Uthente' 
                    value={name} 
                    style={styles.input} 
                    onChangeText = { text => setName(text) }
                />
                <TextInput 
                    placeholder='Email' 
                    value={email} 
                    style={styles.input} 
                    onChangeText = { text => setEmail(text) }
                />
                <TextInput 
                    placeholder='Numero di telefono' 
                    value={phone} 
                    style={styles.input} 
                    onChangeText = { text => setPhone(text) }
                />
                <TextInput 
                    placeholder='Password' 
                    value={password} 
                    secureTextEntry 
                    style={styles.input} 
                    onChangeText = { text => setPassword(text) }
                />
                <TextInput 
                    placeholder='Conferma Password' 
                    value={password} 
                    secureTextEntry 
                    style={styles.input} 
                    onChangeText = { text => setPassword(text) }
                />
                <Button title={'Registrati'}   color="#04487b"  onPress={RegisterActionCall}/>
                <View style={{ flexDirection : 'row', marginTop: 20,alignSelf:'center'}}>
                    <Text style={styles.text}>Torna Indietro </Text>
                    <TouchableOpacity onPress={ () => navigation.navigate('Signin') }>
                        <Text style={{ color: 'red',textDecorationLine:'underline',fontWeight:'700'}} >Login</Text>
                    </TouchableOpacity>
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
        alignSelf:'center',
        marginTop:"65%"
    },
    input : {
        marginBottom : 12,
        borderWidth : 1,
        borderColor : '#bbb',
        borderRadius: 10,
        paddingHorizontal: 14,
    },
    Link : {
        color: 'blue',
    },
    text : {
        fontFamily: 'Poppins-Regular',
    }
});
export default RegisterScreen;