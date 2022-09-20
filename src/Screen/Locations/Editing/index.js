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
  inputConatiner: {
    borderWidth: .5,
    padding: 10,
    marginTop: 10,
    margin: 10,
    borderRadius: 10
  },
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
  console.log("location edit >>>", item)
  const [category, setCategory] = React.useState();
  const [name, setName] = React.useState();
  const [descrption, setDrescription] = React.useState()
  const [userType, setUserType] = React.useState();
  const [userId, setUserId] = React.useState();
  const [companyList, setCompanyList] = React.useState([]);
  const [companyValue, setCompanyValue] = React.useState();
  const [superCategoryList, setSuperCategoryList] = React.useState([])
  const [superCategoryValue, setSuperCategoryVaule] = React.useState();
  const [categoryList, setCategoryList] = React.useState([]);
  const [categoryValue, setCategoryValue] = React.useState();
  const [loader, setLoader] = React.useState(false)
  const [locationdetails, setLocationDetials] = React.useState();

  useEffect(() => {
    getUserInfomation()

  }, [])
  const getLocationDetials = (userId) => {
    let formData = {
      user_id: userId,
      location_id: item?.location_id,
    }
    console.log("aessets addition form...", formData)
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
      console.log("vikas view page..", res?.data)
      if (res.data.status == 1) {
        let itemdetail = JSON.stringify(res?.data?.location_details);
        let itemdetailjson = JSON.parse(itemdetail);
        setName(itemdetailjson?.location_name);
        setDrescription(itemdetailjson?.description)
        setCompanyValue(itemdetailjson?.site_id);
        setSuperCategoryVaule(itemdetailjson?.site_id);
        setCategoryValue(itemdetailjson?.site_id)
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
    console.log("user REcords...", userRecords)
    setUserType(userRecords?.user_type);
    if (userRecords?.user_type === "99") {
      companyApi()
    } else {
      getSimpleCategoryLis();
    }
    setUserId(userRecords?.user_id)
    getLocationDetials(userRecords?.user_id)
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
      console.log("company1..", res?.data)
      console.log("company.", res?.data?.company_list)
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
  const getSimpleCategoryLis = () => {
    axios({
      url: `${API_BASE_URL}getSiteList/${userId}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      console.log(" assets Catergory on Edit page.", res?.data?.site_list)
      var prevCategoryList = res?.data?.site_list.map(car => ({ value: car?.id, label: car?.site_name }));
      setCategoryList(prevCategoryList)
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
    alert(id);
    axios({
      url: `${API_BASE_URL}getsuperSiteList/${id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      console.log(" super category page.", res?.data?.site_list)
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
      site_id: categoryValue || superCategoryValue,
      company_id: companyValue
    }
    console.log("aessets addition form...", formData)
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
      if (res?.data?.status) {
        navigation.navigate('tutte le')
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
              placeholder="Company List"
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
              placeholder="categoryList"
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
            data={categoryList}
            maxHeight={200}
            search
            labelField="label"
            valueField="value"
            placeholder="categoryList"
            searchPlaceholder="Search..."
            // value={previousCarList}
            onChange={item => {
              setCategory(item)
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
export default Editiing;