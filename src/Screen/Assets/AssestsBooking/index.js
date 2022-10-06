import React, { useEffect,useState } from "react";

import {View,Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList} from 'react-native';

import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import { TextInput, Title } from "react-native-paper";

import moment from 'moment';

import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { API_BASE_URL } from '../../../Services/url';
import DatePicker from 'react-native-date-picker'
import * as Utility from '../../../Utility/inbdex';
import NoDataFound from "../../../Component/NoDataFound";
const styles=StyleSheet.create({
    mainConatiner:{
    },
    inputConatiner:{
        margin:10,
    },
    saveButton:{
        alignSelf:'center',
        backgroundColor:'#04487b',
        padding:5,
        borderRadius:10,
        marginTop:20,
        // marginHorizontal:10,
    },
    saveButtonText:{
        marginHorizontal:20,
        marginVertical:5,
        color:'white'
    },
    dropDownConatiner:{
        borderWidth:1,
        marginHorizontal:25,
        marginTop:15,
        borderRadius:5,
        padding:5,
    },
    formAction:{
        padding:10,
        borderColor:'#04487b',
        borderWidth:1,
        alignItems:'center',
        width:100
      },
      formAction1:{
        padding:10,
        backgroundColor:'#04487b',
        borderColor:'#04487b',
        borderWidth:1,
        width:100,
        alignItems:'center',
        
    
      },
      formActionText1:{
        color:'white'
      },
      formActionText:{
        color:'black'
      }
})
const AssetsBooking=({navigation,route})=>{
    const {item,booking}=route?.params;
    const [toDate,setToDate]=React.useState();
    const [activeSheet,setActiveSheet]=React.useState('Form')
    const [fromDate,setFromDate]=React.useState();
    const [descrption,setDescrption]=React.useState('');
    const [category,setCategory]=React.useState();
    const [categoryList,setCategoryList]=React.useState([])
    const [userId,setUserId]=React.useState();
    const [loader,setLoader]=React.useState(false);
    const [open, setDateOpen] = useState(false)
    const [secondDateOpen,setSecondDateOpen]=React.useState(false);
    const [reportingdate,setReportingDate]=React.useState(new Date());
    const [secondReportingDate,setSecondReportingDate]=React.useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
    const [fromdatetext, setFromDateText] = React.useState(false);
    const [todatetext, setToDateText] = React.useState(false);
    const isFocused = useIsFocused();
    React.useEffect(()=>{
        getUserdetails()
    },[isFocused])
    const getUserdetails=async()=>{
        let id=await Utility.getFromLocalStorge('userToken');
        setUserId(id);
        callLocationApi(id)
    }
    const callLocationApi=(id)=>{
        axios({
            url: `${API_BASE_URL}locationlist/${id}?page=1`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
          //console.log(" assets location  list.",res?.data?.location_list)
          var prevCatList = res?.data?.location_list.map(car => ({ value: car?.location_id, label: car?.location_name }));
          setCategoryList(prevCatList)
          if(res.data.status == 1){
          }else{
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
    const assetsAdded=()=>{
        setLoader(true)
          let formData = {
            user_id:userId,
            asset_id:item?.item_id,
            date_from:moment(reportingdate)
            .format('DD/MM/YYYY') + moment(reportingdate)
            .format(' hh:mm') ,
            date_to:moment(secondReportingDate)
            .format('DD/MM/YYYY') + moment(secondReportingDate)
            .format(' hh:mm'),
            use:category,
            description:descrption
          }
          axios({
            url: `${API_BASE_URL}asset_booking`,
            method: 'POST',
            data: formData,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }).then(res => {
            //console.log("vikas asset_booking page..",res)
            setLoader(false)
            //console.log("vikas asset_booking page..",res)
            if(res.data.status == 1){
              alert("Assets Booking Successfully")
              //navigation.goBack()
              navigation.navigate('DrawerNavigation')
            }else{
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
      const openLocalDatePkr = () => {
        setDateOpen(true)
    };
    const econdDatePkr=()=>{
        setSecondDateOpen(true)
    }
    const ItemSeparatorView = () => {
        return (
          // Flat List Item Separator
          <View
            style={{
              height: 10,
              width: '100%',
              backgroundColor: 'transparent',
            }}
          />
        );
      };
      const ItemView = ({ item }) => {
        //console.log("Booking list view object",item)
        return (
          <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10, marginLeft: 10, marginRight: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between'}}>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20 }}>Nome articolo: </Title>{item?.asset_name}</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20 }}>Nome posizione: </Title>{item?.location_use}</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Data da: </Title>{item?.date_from}</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Descrizione: </Title>{item?.description}</Text>
                    </View>
                </View>
            </View>
        </View>
          
        );
      };

    return(
        <View style={{ flex: 1, flexGrow: 1}}>
            
            <View style={{flexDirection:'row',alignSelf:'center',marginTop:10,borderRadius:20}}>
              <TouchableOpacity onPress={()=>setActiveSheet('List')}>
                <View style={activeSheet==="List"?[styles.formAction1,{borderTopLeftRadius:20,borderBottomLeftRadius:20}]:[styles.formAction,{borderTopLeftRadius:20,borderBottomLeftRadius:20}]}>
                  <Text style={activeSheet==="List"?styles.formActionText1:styles.formActionText}>List</Text></View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setActiveSheet('Form')}>
                <View style={activeSheet==="Form"?[styles.formAction1,{borderTopRightRadius:20,borderBottomRightRadius:20}]:[styles.formAction,{borderTopRightRadius:20,borderBottomRightRadius:20}]}
                ><Text style={activeSheet==="Form"?styles.formActionText1:styles.formActionText} >Form</Text></View>
              </TouchableOpacity>
            </View>
        {activeSheet==="List"? <>
        <Text style={{alignSelf:'center',fontSize:18,marginTop:10, fontFamily: 'Montserrat-Regular'}}>Prenotazione articolo</Text>
{booking?.length === 0 ? <NoDataFound title="No Data Found"/> :
        <FlatList
        data={booking}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
        style={{ marginTop: 20 }}
      />
       }

</>:
<>
   
            <View style={styles.inputConatiner}>
              <TextInput
                  style={{ width: '90%', alignSelf: 'center' }}
                  pointerEvents="none"
                  mode="outlined"
                  // style={{height:47}}
                  label="Data da"
                  value={moment(toDate).format('DD-MM-YYYY HH:mm')}
                  placeholder="Data da"
                  theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#04487b' } }}
                  maxLength={10}
                  keyboardType='default'
                  onTouchStart={() => openLocalDatePkr()}
                  right={<TextInput.Icon name="calendar" />}
              />
              { fromdatetext == true ? <Text style={{ marginLeft: 15, fontFamily: 'Montserrat-Regular', marginTop: 10, color: '#000000' }}> { moment(reportingdate, 'ddd DD-MMM-YYYY, hh:mm A').format('DD-MM-YYYY hh:mm A') } </Text> : null }
            </View>
            <View style={styles.inputConatiner}>
              <TextInput
                  style={{ width: '90%', alignSelf: 'center' }}
                  pointerEvents="none"
                  mode="outlined"
                  // style={{height:47}}
                  label="Data a"
                  value={moment(fromDate).add(1, 'day').endOf('day').format('DD-MM-YYYY HH:mm')}
                  placeholder="Data a"
                  theme={{ colors: { primary: '#99e8e4', underlineColor: 'yellow', accent: '#99e8e4' } }}
                  maxLength={10}
                  keyboardType='default'
                  onTouchStart={() => econdDatePkr()}
                  right={<TextInput.Icon name="calendar" />}
              />

              { todatetext == true ? <Text style={{ marginLeft: 15, fontFamily: 'Montserrat-Regular', marginTop: 10, color: '#000000' }}> { moment(secondReportingDate, 'ddd DD-MMM-YYYY, hh:mm A').format('DD-MM-YYYY hh:mm A') } </Text> : null }
            </View>
            <View style={styles.inputConatiner}>
            <TextInput
                            style={{ width: '90%', alignSelf: 'center' }}
                            pointerEvents="none"
                            mode="outlined"
                            // style={{height:47}}
                            label="Descrizione"
                            value={descrption}
                            placeholder="Descrizione"
                            theme={{ colors: { primary: '#99e8e4', underlineColor: 'yellow', accent: '#99e8e4' } }}
                            keyboardType='default'
                            onChangeText={newText => setDescrption(newText)}
                        />
            </View>
            <View style={styles.dropDownConatiner}>
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
                        placeholder="Posizione"
                        searchPlaceholder="Search..."
                        value={categoryList}
                        onChange={item => {
                            //console.log("Booking posistion is..",item)
                            setCategory(item?.value)
                            // setCategory(item)
                        }}
                    />
                </View>
            <TouchableOpacity onPress={()=>assetsAdded()} style={styles.saveButton}>
            <View>
                <Text style={styles.saveButtonText}>Save</Text>
            </View>
            </TouchableOpacity>
            <DatePicker
                        modal
                        //minDate={new Date()}
                        minimumDate={new Date()}
                        open={open}
                        date={reportingdate}
                        onConfirm={(date) => {
                            setDateOpen(false);
                            setToDate(date);
                            setReportingDate(date);
                            setFromDateText(true);
                        }}
                        onCancel={() => {
                            setDateOpen(false)
                        }}
                    />
                      <DatePicker
                        modal
                        //minDate={new Date()}
                        minimumDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
                        open={secondDateOpen}
                        date={secondReportingDate}
                        onConfirm={(date) => {
                          //console.log(date);
                            setSecondDateOpen(false)
                            //setFromDate(date);
                            setSecondReportingDate(date);
                            setToDateText(true);
                        }}
                        onCancel={() => {
                            setSecondDateOpen(false)
                        }}
                    />
                    </>}
            
        </View>
    )
}
export default AssetsBooking;