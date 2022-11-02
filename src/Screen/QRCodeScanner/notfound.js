import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

const QRCodeNotFound = ({navigation, route}) => {

    const [qrcode,setQrcode]=React.useState(route?.params?.qr_code);
    //console.log(qrcode);
    const confirmCreateItem = (qrcode) => {
        //navigation.navigate('AssetAddition');
        navigation.navigate('QRCodeItemAdd', {
            qrcode: qrcode,
        });
    }

    
    return(
        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[ styles.regularFont, { fontSize: 20, color: '#222' } ]}>oggetto non trovato!</Text>
            <TouchableOpacity style={{ backgroundColor: '#04487b', paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, marginTop: 20 }} onPress= { () => confirmCreateItem(qrcode) } ><Text style={[ styles.regularFont, { color: '#FFF'} ]}>Crea nuovo oggetto</Text></TouchableOpacity>
        </View>
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

export default QRCodeNotFound;