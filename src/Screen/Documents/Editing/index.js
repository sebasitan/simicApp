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
} from 'react-native';
import { TextInput, Title } from "react-native-paper";
import ImagePicker from 'react-native-image-crop-picker';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
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

  const AddDocumentImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      const formData = new FormData();
      formData.append('item_image', { type: image.mime, uri: image.path, name: image.path.split("/").pop() });
      axios({
        url: `${API_BASE_URL}item_image`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        if (res?.data?.status == 1) {
          setDocumentName(res?.data?.picture)
          alert("Document Image Added successfully")
        } else {
          alert("Document Image not uploaded")
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
        .format('YYYY-MM-DD') + moment(toDate)
        .format(' hh:mm:ss'),
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

  let documentid = itemId?.document_type === 1 ? 1 : 2;

  return (
    
    <View style={{ flex: 1, marginTop: 20 }}>
      <ScrollView>
        <View style={styles.dropDownConatiner}>
          <Dropdown
            style={{ marginLeft: 10 }}
            placeholderStyle={{ color: 'black' }}
            selectedTextStyle={{ color: 'black' }}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={documentList}
            maxHeight={200}
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
            placeholder='Tornitore name' 
            style={{ width: '90%', alignSelf: 'center' }}
            placeholderTextColor="black"
            pointerEvents="none"
            mode="outlined"
            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
            onChangeText={(e)=>setSupplierName(e)} 
            value={supplierName}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <Text>Allegato</Text>
          {imageurl ? <Image source={{uri:imageurl}} style={{height:50,width:50}}/> : ''}
            <TouchableOpacity onPress={() => AddDocumentImage()}>
              <Ionicons name="camera" color='#04487b' size={16}></Ionicons>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.saveContainer} onPress={() => saveDocument()}>
          <View>
            <Text style={{ color: 'white' }}>Update</Text>
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          minDate={new Date()}
          minimumDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
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