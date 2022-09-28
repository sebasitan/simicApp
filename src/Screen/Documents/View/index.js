import React, { Component, useEffect, useState } from 'react';
import {
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
import Ionicons from 'react-native-vector-icons/Ionicons';

import RNFetchBlob from 'rn-fetch-blob';

const DocumentView = ({navigation, route}) => {
  
  let item = route?.params?.itemId;
  const [userToken, setUserToken] = useState(null);
  const [loader,setLoader] = React.useState(false);

  const downloadDocument = async () => {
    
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
          //console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error','Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        Alert.alert('Error','Something went wrong. please try again.');
      }
    }

  }

  const downloadFile = () => {
    let date = new Date();
    let FILE_URL = item?.documents;
    if(FILE_URL !=''){
      let file_ext = getFileExtention(FILE_URL);
      file_ext = '.' + file_ext[0];
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir+'/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,   
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        //console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      });
    }else{
      Alert.alert('Error','Something went wrong. please try again.');
    }

  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
  };
  //console.log(item);
  return(
    <View style={[ styles.container ]}>
    {loader?
    <ActivityIndicator size={50}/>:null}
    <View style={{ marginTop: 20 }}>
      
      <View style={{ backgroundColor: '#f8f8ff', paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 10 }}>
      
      <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
        <Title style={[ styles.regularFont, { fontSize: 14 }]}>Tipo documento: </Title>
        <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.document_type === 1 ? 'Transport Document': 'Formulary'}</Text>
      </View>
      <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
        <Title style={[ styles.regularFont, { fontSize: 14 }]}>Numero del documento: </Title>
        <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.shop_assistant}</Text>
      </View>
      <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
        <Title style={[ styles.regularFont, { fontSize: 14 }]}>Numero DDT / Formulario: </Title>
        <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.ddt_number}</Text>
      </View>
      <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
        <Title style={[ styles.regularFont, { fontSize: 14 }]}>Numero commessa: </Title>
        <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.order_no}</Text>
      </View>
      { item?.documents !='' ? <>
      
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, borderTopColor: '#EEE', borderTopWidth: 1, paddingTop: 8 }}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={downloadDocument}>
              <Ionicons name="md-document-text" color='#04487b' size={16}></Ionicons><Text style={{ marginLeft: 4, color: '#04487b', fontSize: 13 }}>Scarica documento</Text>
        </TouchableOpacity>
      </View>
      
      </> : null }
      
    </View>
  </View>
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

export default DocumentView;