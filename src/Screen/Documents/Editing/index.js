import React, { Component, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import { TextInput, Title } from "react-native-paper";
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from 'rn-fetch-blob';
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'Montserrat-Regular'
  },
  saveContainer: {
    backgroundColor: '#04487b',
    fontFamily: 'Montserrat-Regular',
    alignSelf: 'center',
    padding: 10,
    width: 100,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20
  },
  inputConatiners: {
    margin:10,
  },
  dropDownConatiner:{
    borderWidth:1,
    marginHorizontal:25,
    marginTop:15,
    borderRadius:5,
    padding:5,
},
loading: {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F5FCFF88',
  zIndex: 1
}
});
const DocumentEditing = ({ navigation,route }) => {

  const {itemId}=route?.params;

  const [documentType, setDocumentType] = React.useState(itemId?.document_type);
  const [documentId, setDocumentId] = React.useState(itemId?.id);
  const [jobnumber, setJobNumber] = React.useState(itemId?.shop_assistant);
  const [ddtNumber, setDDTNumber] = React.useState(itemId?.ddt_number);
  const [toDate, setToDate] = React.useState(itemId?.document_date);
  const [description, setDescription] = React.useState(itemId?.description);

  const [documentList, setDocumentList] = React.useState([{ label: 'Transport Document', value: 1 }, { label: 'Formulary', value: 2 }]);
  
  const [cerNumber, setCerNumber] = React.useState(itemId?.cercode);
  const [orderNumber, setOrderNumber] = React.useState(itemId?.order_no);
  const [protocol, setProctocol] = React.useState(itemId?.protocol);
  const [supplierName, setSupplierName] = React.useState(itemId?.supplier_name);
  const [companyId, setCompanyId] = React.useState(itemId?.company_id);
  const [userType, setUserType] = React.useState();
  const [userId, setUserId] = React.useState();
  const [open, setDateOpen] = useState(false)
  const [reportingdate, setReportingDate] = React.useState(new Date());
  const [loader,setLoader]=React.useState(false);
  const [imageurl,setImageUrl]=React.useState(itemId?.documents);
  const [documentName,setDocumentName]=React.useState(itemId?.documents_image);
  
  useEffect(() => {
    getUserInfomation();
  }, []);

  const getUserInfomation = async () => {
    const userRecords = await Utility.getFromLocalStorge('userData');
    setUserType(userRecords?.user_type);
   
    setUserId(userRecords?.user_id)
  }

  const AddDocumentFile = async () => {
    
    try {
        const res = await DocumentPicker.pick({
          // Provide which type of file you want user to pick
          type: [DocumentPicker.types.allFiles],
          // There can me more options as well
          // DocumentPicker.types.allFiles
          // DocumentPicker.types.images
          // DocumentPicker.types.plainText
          // DocumentPicker.types.audio
          // DocumentPicker.types.pdf
        });
        
        if(res.length > 0 ){
            setLoader(true);

            let formData = new FormData();
            let filedata = JSON.parse(JSON.stringify(res))[0];
            formData.append('item_image', { type: filedata.type, uri: filedata.uri, name: filedata.name.split("/").pop() });
            
            axios({
                url: `${API_BASE_URL}item_image`,
                method: 'POST',
                data:formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                //console.log(" assets location on Edit page.", res?.data)
                if(response?.data?.status==1){
                    setDocumentName(response?.data?.picture)
                    alert("File Uploaded");
                }else if(response?.data?.status==2){
                  let msg = response?.data?.message;
                  let regex = /(<([^>]+)>)/ig;
                  let fls_msg = msg.replace(regex, '');
                  alert(fls_msg);
                }else{
                    alert("File Not Uploaded")
                }
                setLoader(false);
            }).catch(e => {
                setLoader(false);
                Alert.alert(
                    "Warning",
                    "Somthing went wrong, Try Again",
                    [
                        { text: "OK" }
                    ]
                );
            });
        }
    } catch (err) {

        setLoader(true);
      
        setDocument('');

        if (DocumentPicker.isCancel(err)) {
          alert('Canceled');
        } else {
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
        setLoader(false);
    }
    
}

  const saveDocument = () => {
    setLoader(true);
    if( documentType !='' && supplierName !='' && jobnumber !='' && ddtNumber !='' && description !='' && companyId !=''){
      let formData = {
        user_id: userId,
        document_id: documentId,
        document_type: documentType,
        supplier_name:supplierName ,
        shop_assistant: jobnumber,
        ddt_number: ddtNumber,
        order_no: orderNumber,
        description: description,
        documents: documentName,
        document_date: moment(toDate)
        .format('YYYY-MM-DD'),
        protocol: protocol,
        cercode: cerNumber,
        company_id: companyId || '',
      }
      //console.log("document edit...", formData)
      axios({
        url: `${API_BASE_URL}updateDocument`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        //console.log("", res?.data)
        if (res?.data?.status) {
          navigation.navigate('Documenti');
        }
        alert("Document Updated Succesffuly");
        setLoader(false)
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
    }else{
      Alert.alert(
        "Warning",
        "Document Type, Document, Job Number, Supplier Name, DDT Number, Company and Description must be filled",
        [
          { text: "OK" }
        ]
      );
    }
  
  }
  const openLocalDatePkr = () => {
    setDateOpen(true)
  };

  const downloadDocument = async(url) => {

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
            downloadFile(url);
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

const downloadFile = (url) => {
    let date = new Date();
    var FILE_URL = url;
    //console.log(FILE_URL);
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
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

  let documentid = itemId?.document_type == 1 ? 1 : 2;
  //console.log(documentid);
  return (
    
    <View style={{ flex: 1, marginTop: 20 }}>
      {loader ? <View style={styles.loading}><ActivityIndicator size={50}></ActivityIndicator></View> : null }
      <ScrollView>
        <View style={styles.dropDownConatiner}>
          <Text>Tipo documemto</Text>
          <Dropdown
            style={{ marginLeft: 10 }}
            placeholderStyle={{ color: 'black' }}
            selectedTextStyle={{ color: 'black' }}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={documentList}
            maxHeight={400}
            search
            value={documentid}
            labelField="label"
            valueField="value"
            placeholder="Tipo documemto"
            searchPlaceholder="Search..."
            onChange={item => {
              setDocumentType(item?.value)
            }}
          />
        </View>
        <View style={styles.inputConatiners}>
          <TextInput
            label='Numero commessa' 
            placeholder='Numero commessa' 
            style={{ width: '90%', alignSelf: 'center' }}
            placeholderTextColor="black"
            pointerEvents="none"
            mode="outlined"
            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }} 
            onChangeText={(text) => setJobNumber(text)} 
            value={jobnumber}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput
            label='Numero DDT'
            placeholder='Numero DDT'
            style={{ width: '90%', alignSelf: 'center' }}
            placeholderTextColor="black"
            pointerEvents="none"
            mode="outlined"
            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
            onChangeText={(e) => setDDTNumber(e)} 
            value={ddtNumber}></TextInput>
        </View>
        {documentType === 2 && (
          <View style={styles.inputConatiners}>
            <TextInput
              label='CER Number'
              placeholder="CER Number"
              style={{ width: '90%', alignSelf: 'center' }}
              placeholderTextColor="black"
              pointerEvents="none"
              mode="outlined"
              theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
              onChangeText={(e) => setCerNumber(e)} 
              value={cerNumber}></TextInput>
          </View>
        )
        }
        <View style={styles.inputConatiners}>
          <TextInput
            label='Numero ordine'
            placeholder='Numero ordine'
            style={{ width: '90%', alignSelf: 'center' }}
            placeholderTextColor="black"
            pointerEvents="none"
            mode="outlined"
            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
            onChangeText={(e) => setOrderNumber(e)} 
            value={orderNumber}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput
            label='Numero protocollo'
            placeholder='Numero protocollo'
            style={{ width: '90%', alignSelf: 'center' }}
            placeholderTextColor="black"
            pointerEvents="none"
            mode="outlined"
            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
            onChangeText={(e) => setProctocol(e)} 
            value={protocol}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
            <TextInput
                style={{ width: '90%', alignSelf: 'center' }}
                pointerEvents="none"
                mode="outlined"
                label="Data documento"
                value={moment(toDate).format('DD-MM-YYYY HH:mm')}
                placeholder="Data da"
                theme={{ colors: { primary: '#99e8e4', underlineColor: 'yellow', accent: '#99e8e4' } }}
                maxLength={10}
                keyboardType='default'
                onTouchStart={() => openLocalDatePkr()}
                right={<TextInput.Icon name="calendar" />}
            />
        </View>
        <View style={styles.inputConatiners}>
          <TextInput
            label='Descrizione'
            placeholder='Descrizione'
            style={{ width: '90%', alignSelf: 'center' }}
            placeholderTextColor="black"
            pointerEvents="none"
            mode="outlined"
            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
            onChangeText={(e)=>setDescription(e)}
            value={description}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput
            label='Fornitore'
            placeholder='Fornitore' 
            style={{ width: '90%', alignSelf: 'center' }}
            placeholderTextColor="black"
            pointerEvents="none"
            mode="outlined"
            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
            onChangeText={(e)=>setSupplierName(e)} 
            value={supplierName}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TouchableOpacity style={{ marginLeft: 30, marginRight: 30, marginTop: 10, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderRadius: 5, paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, borderColor: '#DDD' }} onPress={() => AddDocumentFile()}>
            <Text>Allegato</Text>
              <Ionicons name="document-text" color='#04487b' size={28}></Ionicons>
              <Text style={{ fontSize: 12, color:'red'}}>JPG, PNG, PDF, DOCX, XLS: 5MB</Text>
          </TouchableOpacity>
          { imageurl ? <>
          <TouchableOpacity style={{ marginLeft: 20, alignItems: 'center'}} onPress={()=>downloadDocument(imageurl)}>
              <Text style={{ color: '#04487b'}}>{ documentName }</Text>
          </TouchableOpacity>
          </> : null }
        </View>
        <TouchableOpacity style={styles.saveContainer} onPress={() => saveDocument()}>
          <View>
            <Text style={{ color: 'white' }}>Update</Text>
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          mode='date'
          //minDate={new Date()}
          //minimumDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
          open={open}
          date={reportingdate}
          onConfirm={(date) => {
            setDateOpen(false)
            setToDate(date);
            setReportingDate(date)
          }}
          onCancel={() => {
            setDateOpen(false)
          }}
        />
      </ScrollView>
    </View>
  );
};

export default DocumentEditing;