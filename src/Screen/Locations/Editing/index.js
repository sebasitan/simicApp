import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity, Alert
} from 'react-native';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';
import { Dropdown } from 'react-native-element-dropdown';
import HomeHeader from '../../../Component/HomeHeader';
import * as Utility from '../../../Utility/inbdex';
const style = StyleSheet.create({
  inputConatiner: { borderWidth: 1, alignSelf: 'center', width: '90%', margin: 10, borderRadius: 5, padding: 5 },
  saveContainer: {
    backgroundColor: '#04487b',
    alignSelf: 'center',
    padding: 10,
    width: 100,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10
  }
})
const Editiing = ({ navigation, route }) => {
  const { item } = route?.params;
  const [name, setName] = React.useState();
  const [descrption, setDrescription] = React.useState()
  const [userType, setUserType] = React.useState();
  const [userId, setUserId] = React.useState();
  const [companyValue, setCompanyValue] = React.useState('');
  const [sitefieldval, setSitefieldval] = React.useState('');
  const [superCategoryList, setSuperCategoryList] = React.useState([])
  const [superCategoryValue, setSuperCategoryVaule] = React.useState();
  const [categoryValue, setCategoryValue] = React.useState();
  const [loader, setLoader] = React.useState(false)

  useEffect(() => {
    getUserInfomation();
  }, []);

  const getLocationDetials = (userId, usertype) => {
    let formData = {
      user_id: userId,
      location_id: item?.location_id,
    }
    axios({
      url: `${API_BASE_URL}locationView`,
      method: 'POST',
      data: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      setLoader(false)
      //console.log(usertype);
      if (res.data.status == 1) {
        let itemdetail = JSON.stringify(res?.data?.location_details);
        let itemdetailjson = JSON.parse(itemdetail);
        if(usertype == 99){
          getSuperCategoryList(itemdetailjson?.company_id);
        }else{
          getSimpleCategoryList(userId);
        }
        //console.log(itemdetailjson);
        setName(itemdetailjson?.location_name);
        setDrescription(itemdetailjson?.description)

        setSitefieldval(itemdetailjson?.site_id);
        setCompanyValue(itemdetailjson?.company_id);

      } else {
        Alert.alert(
          "Warning",
          "Somthing went wrong, Try Again",
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
  const getUserInfomation = async () => {
    const userRecords = await Utility.getFromLocalStorge('userData');
    setUserType(userRecords?.user_type);
    setUserId(userRecords?.user_id);
    getLocationDetials(userRecords?.user_id, userRecords?.user_type);
  }

  const getSimpleCategoryList = (id) => {
    axios({
      url: `${API_BASE_URL}getSiteList/${id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      //console.log(" assets Catergory on Edit page.", res?.data?.site_list)
      var prevCategoryList = res?.data?.site_list.map(car => ({ value: car?.id, label: car?.site_name }));
      setSuperCategoryList(prevCategoryList);
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
  const getSuperCategoryList = (id) => {
    //alert(id);
    axios({
      url: `${API_BASE_URL}getsuperSiteList/${id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      //console.log(" super category page.", res?.data?.site_list)
      var prevCategoryList = res?.data?.site_list.map(car => ({ value: car?.id, label: car?.site_name }));
      setSuperCategoryList(prevCategoryList)
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
  const addLocation = () => {
    setLoader(true)
    let formData = {
      user_id: userId,
      location_name: name,
      description: descrption,
    }
    //console.log("aessets addition form...", formData)
    axios({
      url: `${API_BASE_URL}locationUpdate/${item?.location_id}`,
      method: 'POST',
      data: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      console.log("", res?.data)
      if (res?.data?.status == 1) {
        navigation.navigate('Tutte le posizioni');
      }
      alert("Location Updated Succesffuly");
      setLoader(false);
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
    // alert("Location added successfully")
  }
  return (
    <View style={{ flex: 1 }}>
      {/* <HomeHeader backButton={true} navigation={navigation} title="Aggiungi luogo" /> */}
      <View style={{ marginTop: 20 }}></View>
      <View style={style.inputConatiner}>
        <TextInput placeholder='Nome' placeholderTextColor="black" value={name} onChangeText={(e) => setName(e)}></TextInput>
      </View>
      <View style={style.inputConatiner}>
        <TextInput placeholder='Descrizione' value={descrption} placeholderTextColor="black" onChangeText={(e) => setDrescription(e)}></TextInput>
      </View>
      
      <TouchableOpacity onPress={() => addLocation()}>
        <View style={style.saveContainer}>
          <Text style={{ color: 'white' }}>Save</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

};

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
  }
});
export default Editiing;