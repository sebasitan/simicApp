import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity, Alert, ActivityIndicator
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
const Addition = ({ navigation }) => {
  const [name, setName] = React.useState('');
  const [descrption, setDrescription] = React.useState('');
  const [userType, setUserType] = React.useState();
  const [userId, setUserId] = React.useState();
  const [companyList, setCompanyList] = React.useState([]);
  const [companyValue, setCompanyValue] = React.useState('');
  const [superCategoryList, setSuperCategoryList] = React.useState([])
  const [superCategoryValue, setSuperCategoryVaule] = React.useState('');
  const [loader,setLoader]=React.useState(false)

  useEffect(() => {
    getUserInfomation()
  }, [])

  const getUserInfomation = async () => {
    const userRecords = await Utility.getFromLocalStorge('userData');
    setUserId(userRecords?.user_id);
    setUserType(userRecords?.user_type);
    if (userRecords?.user_type === "99") {
      companyApi();
    } else {
      //console.log(userRecords.company_id);
      //getSuperCategoryList(userRecords.company_id);
      getSimpleCategoryLis(userRecords?.user_id);
      setCompanyValue(userRecords.company_id);
    }
    
  }
  const companyApi = () => {
    axios({
      url: `${API_BASE_URL}getCompany`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
     // console.log("company1..", res?.data)
      //console.log("company.", res?.data?.company_list)
      var prevCategoryList = res?.data?.company_list.map(car => ({ value: car?.id, label: car?.company_name }));
      setCompanyList(prevCategoryList)
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
  const getSimpleCategoryLis = (id) => {
    //console.log(userId);
    axios({
      url: `${API_BASE_URL}getSiteList/${id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      //console.log("sdf");
     // console.log(" assets Catergory on Edit page.", res?.data?.site_list)
      var prevCategoryList = res?.data?.site_list.map(car => ({ value: car?.id, label: car?.site_name }));
      //console.log(prevCategoryList);
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
  const getSuperCategoryList = (id) => {
   
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
    setLoader(true);

    if(companyValue != '' && name != ''){
      let formData = {
        user_id: userId,
        location_name: name,
        description: descrption,
        company_id: companyValue,
        site_id: superCategoryValue,
      };
      axios({
        url: `${API_BASE_URL}addLocation`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        }).then(res => {
        //console.log("", res?.data)
        if (res?.data?.status) {
          alert("Location Added Succesffuly");
          setLoader(false);
          navigation.navigate('Tutte le posizioni');
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
    }else{
      Alert.alert(
        "Warning",
        "Location name and company name must be filled",
        [
          { text: "OK" }
        ]
      );
    }
    
  }
  return (
    <View style={{ flex: 1 }}>
      {loader &&
      <ActivityIndicator size={50} color="blue"/>}
      {/* <HomeHeader backButton={true} navigation={navigation} title="Aggiungi luogo" /> */}
      <View style={{ marginTop: 20 }}></View>
      <View style={style.inputConatiner}>
        <TextInput placeholder='Nome' placeholderTextColor="black" value={name} onChangeText={(e) => setName(e)}></TextInput>
      </View>
      <View style={style.inputConatiner}>
        <TextInput placeholder='Descrizione' value={descrption} placeholderTextColor="black" onChangeText={(e) => setDrescription(e)}></TextInput>
      </View>
      {userType === "99" ?
        <>
          <View style={style.inputConatiner}>
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
              // value={previousCarList}
              onChange={item => {
                // setCategory(item)
                setCompanyValue(item?.value);
                getSuperCategoryList(item?.value)

              }}
            />
          </View>
          <View style={style.inputConatiner}>
            <Dropdown
              style={{ marginLeft: 10 }}
              placeholderStyle={{ color: 'black' }}
              selectedTextStyle={{ color: 'black' }}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={superCategoryList}
              maxHeight={200}
              search
              labelField="label"
              valueField="value"
              placeholder="Nome sito"
              searchPlaceholder="Search..."
              // value={previousCarList}
              onChange={item => {
                // setCategory(item)s
                setSuperCategoryVaule(item?.value)
              }}
            />
          </View>
        </> :
        <View style={style.inputConatiner}>
          <Dropdown
            style={{ marginLeft: 10 }}
            placeholderStyle={{ color: 'black' }}
            selectedTextStyle={{ color: 'black' }}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={superCategoryList}
            maxHeight={200}
            search
            labelField="label"
            valueField="value"
            placeholder="Nome sito"
            searchPlaceholder="Search..."
            // value={previousCarList}
            onChange={item => {
              setSuperCategoryVaule(item?.value)
            }}
          />
        </View>}
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
export default Addition;