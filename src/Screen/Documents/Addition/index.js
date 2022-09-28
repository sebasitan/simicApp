import React, { Component, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert
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
  dropDownConatiner:{
    borderWidth:1,
    marginHorizontal:25,
    marginTop:15,
    borderRadius:5,
    padding:5,
},
  saveContainer: {
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#04487b',
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
  }
});
const DocumentAddition = ({ navigation }) => {
  const [documentType, setDocumentType] = React.useState('');
  const [jobnumber, setJobNumber] = React.useState('');
  const [ddtNumber, setDDTNumber] = React.useState('');
  const [orderNumber, setOrderNumber] = React.useState('');
  const [protocol, setProtocol] = React.useState('');
  const [toDate, setToDate] = React.useState();
  const [description, setDescription] = React.useState('');
  const [document, setDocument] = React.useState('');
  const [cerNumber, setCerNumber] = React.useState('');
  const [supplierName, setSupplierName] = React.useState('');

  const [documentList, setDocumentList] = React.useState([{ label: 'Transport Document', value: 1 }, { label: 'Formulary', value: 2 }]);
  
  const [companyList, setCompanyList] = React.useState([]);
  const [companyId, setCompanyId] = React.useState('');
  const [userType, setUserType] = React.useState();
  const [userId, setUserId] = React.useState();
  const [open, setDateOpen] = useState(false)
  const [reportingdate, setReportingDate] = React.useState(new Date());

  useEffect(() => {
    getUserInfomation();
  }, [])

  const getUserInfomation = async () => {
    const userRecords = await Utility.getFromLocalStorge('userData');
    //console.log(userRecords);
    setUserType(userRecords?.user_type);
    if (userRecords?.user_type === "99") {
      companyApi();
    }else{
      setCompanyId(userRecords.company_id);
    }
    //console.log(userRecords);
    setUserId(userRecords?.user_id);
  }
  const companyApi = () => {
    //console.log("sdf");
    axios({
      url: `${API_BASE_URL}getCompany`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      var prevCategoryList = res?.data?.company_list.map(car => ({ value: car?.id, label: car?.company_name }));
      setCompanyList(prevCategoryList);
      //console.log(prevCategoryList);
    }).catch(e => {
      Alert.alert(
        "Warning",
        "Somthing went wrong, Try Again",
        [
          { text: "OK" }
        ]
      );
    });
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
          setDocument(res?.data?.picture)
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
  }
  const saveDocument = () => {
    //console.log(companyId);
    if( documentType !='' && supplierName !='' && jobnumber !='' && ddtNumber !='' && description !='' && companyId !='' && document !=''){
      let formData = {
        user_id: userId,
        document_type: documentType,
        supplier_name: supplierName,
        shop_assistant: jobnumber,
        ddt_number: ddtNumber,
        order_no: orderNumber,
        description: description,
        documents: document,
        document_date: moment(toDate)
        .format('YYYY-MM-DD') + moment(toDate)
        .format(' hh:mm:ss'),
        protocol: protocol,
        cercode: cerNumber,
        company_id: companyId,
      };
      //navigation.navigate('Documenti');
      //console.log(formData);
      axios({
        url: `${API_BASE_URL}AddDocument`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        alert("Document Added Succesffuly");
        //setLoader(false);
        if(res?.data?.status) {
          navigation.navigate('Documenti');
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
          onChangeText={(text) => setJobNumber(text)}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput 
          placeholder='Numero DDT' 
          style={{ width: '90%', alignSelf: 'center' }}
          placeholderTextColor="black"
          pointerEvents="none"
          mode="outlined"
          theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }} 
          onChangeText={(e) => setDDTNumber(e)}></TextInput>
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
            onChangeText={(e) => setCerNumber(e)}></TextInput>
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
          onChangeText={(e) => setOrderNumber(e)}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput
          style={{ width: '90%', alignSelf: 'center' }}
          placeholderTextColor="black"
          pointerEvents="none"
          mode="outlined"
          theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
          placeholder='Numero protocollo'
          keyboardType='numeric'
          onChangeText={(e) => setProtocol(e)}></TextInput>
        </View>
         <View style={styles.inputConatiners}>
            <TextInput
              style={{ width: '90%', alignSelf: 'center' }}
              pointerEvents="none"
              mode="outlined"
              // style={{height:47}}
              label="Data documento"
              value={moment(toDate).format('DD-MM-YYYY HH:mm')}
              placeholder="Data da"
              theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
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
          onChangeText={(e)=>setDescription(e)}></TextInput>
        </View>
        
        <View style={styles.inputConatiners}>
          <TextInput placeholder='Fornitore Name' 
          style={{ width: '90%', alignSelf: 'center' }}
          placeholderTextColor="black"
          pointerEvents="none"
          mode="outlined"
          theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }} 
          onChangeText={(e)=>setSupplierName(e)}></TextInput>
        </View>
        <View style={{ flexDirection: 'column', marginTop: 10, marginBottom: 10, alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => AddDocumentImage()}>
            <Text>Allegato</Text>
            <Ionicons name="camera" color='#04487b' size={16}></Ionicons>
          </TouchableOpacity>
        </View>
        {userType == 99 ?<>
        <View style={styles.dropDownConatiner}>
          <Dropdown
            style={{ marginLeft: 10 }}
            placeholderStyle={{ color: 'black' }}
            selectedTextStyle={{ color: 'black' }}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={companyList}
            maxHeight={200}
            search
            labelField="label"
            valueField="value"
            placeholder="Nome azienda"
            searchPlaceholder="Search..."
            onChange={item => {
              setCompanyId(item?.value)
            }}
          />
        </View></> : null }
        <TouchableOpacity style={styles.saveContainer} onPress={() => saveDocument()}>
          <View>
            <Text style={{ color: 'white' }}>Save</Text>
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

export default DocumentAddition;