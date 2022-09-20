import React, { Component, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';
import HomeHeader from '../../../Component/HomeHeader';
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
    fontFamily: 'Poppins-Regular'
  },
  saveContainer: {
    backgroundColor: '#04487b',
    alignSelf: 'center',
    padding: 10,
    width: 100,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10
  },
  inputConatiners: {
    margin: 10,
    borderWidth: .5,
    padding: 10,
    borderRadius: 10,
  }
});
const Editiing = ({ navigation,route }) => {
  const {itemId}=route?.params;
  console.log("item details on edit page is>>>.",itemId)

  const [category, setCategory] = React.useState(itemId?.document_type);
  const [name, setName] = React.useState();
  const [toDate, setToDate] = React.useState();
  const [descrption, setDrescription] = React.useState()
  const [categoryList, setCategoryList] = React.useState([{ label: 'Transport Document', value: 1 }, { label: 'Formulary', value: 2 }]);
  const [ddtNumber, setDDTNumber] = React.useState(itemId?.ddt_number);
  const [cerNumber, setCerNumber] = React.useState(itemId?.cercode);
  const [orderName, setOrderName] = React.useState(itemId?.order_no);
  const [protocol, setProctocol] = React.useState();
  const [documentName, setDocumentName] = React.useState();
  const [description, setDescription] = React.useState();
  const [tornitorname, setTornitorName] = React.useState(itemId?.supplier_name);
  const [companyCode, setCompanyCode] = React.useState();
  const [companyList, setComnpanyList] = React.useState([]);
  const [userType, setUserType] = React.useState();
  const [userId, setUserId] = React.useState();
  const [open, setDateOpen] = useState(false)
  const [reportingdate, setReportingDate] = React.useState(new Date());
  const [loader,setLoader]=React.useState(false);
  const [image,setImage]=React.useState(itemId?.documents);


  useEffect(() => {
    getUserInfomation()
  }, [])

  const getUserInfomation = async () => {
    const userRecords = await Utility.getFromLocalStorge('userData');
    console.log("user REcords...", userRecords)
    setUserType(userRecords?.user_type);
    if (userRecords?.user_type === 1) {
      companyApi()
    }
    setUserId(userRecords?.user_id)
  }
  const companyApi = () => {
    axios({
      url: `${API_BASE_URL}get_cat_list`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      console.log(" assets Catergory on Edit page.", res?.data?.company_list)
      var prevCategoryList = res?.data?.company_list.map(car => ({ value: car?.id, label: car?.company_name }));
      setComnpanyList(prevCategoryList)
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
      console.log("Addition image is..>>", image?.path);
      // setImage(image?.path)
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
        console.log(" assets location on Edit page.", res?.data)
        if (res?.data?.status == 1) {
          setDocumentName(res?.data?.picture)
          alert("Assets Image Added successfully")
        } else {
          alert("Your asset image not uploaded")
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
    setLoader(true)
    let formData = {
      user_id: 62,
      supplier_name:tornitorname ,
      shop_assistant: tornitorname,
      ddt_number: ddtNumber,
      order_no: orderName,
      description: description,
      documents: documentName,
      document_type: category,
      document_date: '12 /12/ 2020',
      protocol: protocol,
      cercode: cerNumber,
      company_id: companyCode || '',
    }
    console.log("aessets addition form...", formData)
    axios({
      url: `${API_BASE_URL}updateDocument`,
      method: 'POST',
      data: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      console.log("", res?.data)
      if (res?.data?.status) {
        navigation.navigate('DrawerNavigation','DocumentsListing')
      }
      alert("Document Added Succesffuly");
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

  }
  const openLocalDatePkr = () => {
    setDateOpen(true)
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* <HomeHeader navigation={navigation} backButton={true} title="Aggiungi nuova documento" /> */}
        <View style={styles.inputConatiners}>
          <Dropdown
            style={{ marginLeft: 10 }}
            placeholderStyle={{ color: 'black' }}
            selectedTextStyle={{ color: 'black' }}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={categoryList}
            maxHeight={200}
            search
            value={category}
            labelField="label"
            valueField="value"
            placeholder="Tipo documemto"
            searchPlaceholder="Search..."
            onChange={item => {
              setCategory(item?.value)
            }}
          />
        </View>
        <View style={styles.inputConatiners}>
          <TextInput placeholder='Numero commessa' placeholderTextColor="black" onChangeText={(text) => setName(text)} value={name} ></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput placeholder='Numero DDT' placeholderTextColor="black" onChangeText={(e) => setDDTNumber(e)} value={ddtNumber}></TextInput>
        </View>
        {category === 2 && (
          <View style={styles.inputConatiners}>
            <TextInput placeholder="CER Number" placeholderTextColor="black" onChangeText={(e) => setCerNumber(e)} value={cerNumber}></TextInput>
          </View>
        )
        }
        <View style={styles.inputConatiners}>
          <TextInput placeholder='Numero ordine' placeholderTextColor="black" onChangeText={(e) => setOrderName(e)} value={orderName}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput placeholder='Numero protocollo' placeholderTextColor="black" onChangeText={(e) => setProctocol(e)} value={setProctocol}></TextInput>
        </View>
        {/* <View style={styles.inputConatiners}>
            <TextInput
                            style={{ width: '90%', alignSelf: 'center' }}
                            pointerEvents="none"
                            mode="outlined"
                            // style={{height:47}}
                            label="Data documento"
                            value={moment(toDate).format('DD-MM-YYYY HH:mm')}
                            placeholder="Data da"
                            theme={{ colors: { primary: '#99e8e4', underlineColor: 'yellow', accent: '#99e8e4' } }}
                            maxLength={10}
                            keyboardType='default'
                            onTouchStart={() => openLocalDatePkr()}
                            right={<TextInput.Icon name="calendar" />}
                        />
                        </View> */}
        <View style={styles.inputConatiners}>
          <TextInput placeholder='Descrizione' placeholderTextColor="black" onChangeText={(e)=>setDescription(e)} value={setDescription}></TextInput>
        </View>
        <View style={styles.inputConatiners}>
        <Text>Allegato</Text>
          {image && <Image source={{uri:image}} style={{height:50,width:50}}/>}
          <TouchableOpacity onPress={() => AddDocumentImage()}>
            <Ionicons name="camera" color='#04487b' size={16}></Ionicons>
          </TouchableOpacity>
        </View>
        <View style={styles.inputConatiners}>
          <TextInput placeholder='Tornitore name' placeholderTextColor="black" onChangeText={(e)=>setTornitorName(e)} value={tornitorname}></TextInput>
        </View>
        <TouchableOpacity style={styles.saveContainer} onPress={() => saveDocument()}>
          <View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Update</Text>
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
            console.log("Return date choose may...", date)

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

export default Editiing;