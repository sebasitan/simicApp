import React from "react";

import {View,Text, StyleSheet, TouchableOpacity, Alert, FlatList} from 'react-native';

import { useIsFocused} from '@react-navigation/native';

import { TextInput, Title } from "react-native-paper";

import moment from 'moment';

import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import NoDataFound from "../../../Component/NoDataFound";
import CalendarPicker from 'react-native-calendar-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    const [activeSheet,setActiveSheet]=React.useState('Form')
    const [descrption,setDescrption]=React.useState('');
    const [category,setCategory]=React.useState();
    const [categoryList,setCategoryList]=React.useState([])
    const [userId,setUserId]=React.useState();
    const [loader,setLoader]=React.useState(false);
    const [ startDate, setStartDate ] = React.useState(null);
    const [ startTime, setStartTime ] = React.useState(null);
    const [ endDate, setEndDate ] = React.useState(null);
    const [ endTime, setEndTime ] = React.useState(null);
    const [ openStartDateCalendar, setOpenStartDateCalendar ] = React.useState(false);
    const [ openEndDateCalendar, setOpenEndDateCalendar ] = React.useState(false);
    const [ startDateTime, setStartDateTime ] = React.useState(null);
    const [ endDateTime, setEndDateTime ] = React.useState(null);
    const [ disabledDates, setDisabledDates ] = React.useState(null);
    const [ timeDataHours, setTimeDataHours ] = React.useState([]);
    const [ disableStatus, setDisableStatus ] = React.useState(true);

    const isFocused = useIsFocused();

    React.useEffect(()=>{
        getUserdetails();
    },[isFocused]);

    const timesData = [
      { label: '12:00 AM', value: '0:00' },
      { label: '12:30 AM', value: '0:30' },
      { label: '01:00 AM', value: '1:00' },
      { label: '01:30 AM', value: '1:30' },
      { label: '02:00 AM', value: '2:00' },
      { label: '02:30 AM', value: '2:30' },
      { label: '03:00 AM', value: '3:00' },
      { label: '03:30 AM', value: '3:30' },
      { label: '04:00 AM', value: '4:00' },
      { label: '04:30 AM', value: '4:30' },
      { label: '05:00 AM', value: '5:00' },
      { label: '05:30 AM', value: '5:30' },
      { label: '06:00 AM', value: '6:00' },
      { label: '06:30 AM', value: '6:30' },
      { label: '07:00 AM', value: '7:00' },
      { label: '07:30 AM', value: '7:30' },
      { label: '08:00 AM', value: '8:00' },
      { label: '08:30 AM', value: '8:30' },
      { label: '09:00 AM', value: '9:00' },
      { label: '09:30 AM', value: '9:30' },
      { label: '10:00 AM', value: '10:00' },
      { label: '10:30 AM', value: '10:30' },
      { label: '11:00 AM', value: '11:00' },
      { label: '11:30 AM', value: '11:30' },
      { label: '12:00 PM', value: '12:00' },
      { label: '12:30 PM', value: '12:30' },
      { label: '01:00 PM', value: '13:00' },
      { label: '01:30 PM', value: '13:30' },
      { label: '02:00 PM', value: '14:00' },
      { label: '02:30 PM', value: '14:30' },
      { label: '03:00 PM', value: '15:00' },
      { label: '03:30 PM', value: '15:30' },
      { label: '04:00 PM', value: '16:00' },
      { label: '04:30 PM', value: '16:30' },
      { label: '05:00 PM', value: '17:00' },
      { label: '05:30 PM', value: '17:30' },
      { label: '06:00 PM', value: '18:00' },
      { label: '06:30 PM', value: '18:30' },
      { label: '07:00 PM', value: '19:00' },
      { label: '07:30 PM', value: '19:30' },
      { label: '08:00 PM', value: '20:00' },
      { label: '08:30 PM', value: '20:30' },
      { label: '09:00 PM', value: '21:00' },
      { label: '09:30 PM', value: '21:30' },
      { label: '10:00 PM', value: '22:00' },
      { label: '10:30 PM', value: '22:30' },
      { label: '11:00 PM', value: '23:00' },
      { label: '11:30 PM', value: '23:30' },
    ];

    const getUserdetails = async() => {
        let id=await Utility.getFromLocalStorge('userToken');
        setUserId(id);
        callLocationApi(id);
        getdisableddates(item?.item_id);
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

    const getdisableddates = (item_id) => {
      let formData = {
        item_id: item_id
      };
      axios({
          url: `${API_BASE_URL}bookingcheck`,
          method: 'POST',
          data: formData,
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
          },
      }).then(res => {
        if(res?.data?.status == 1){
          let itemdatesdata = res?.data?.asset_date;
          setDisabledDates(itemdatesdata);
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
    };

    const assetsAdded=()=>{
        setLoader(true)
          let formData = {
            user_id:userId,
            asset_id:item?.item_id,
            date_from:moment(startDate)
            .format('DD/MM/YYYY') +' '+ startTime,
            date_to:moment(endDate)
            .format('DD/MM/YYYY') +' '+ endTime,
            use:category,
            description:descrption
          }
          if( startDateTime != null && endDateTime != null ){
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
          }else{
            Alert.alert(
              "Warning",
              "Start and End Time must be filled",
                [
                { text: "OK" }
              ]
            );
          }
      }
    const openstartdatepicker = () => {
        setOpenStartDateCalendar(true);
    };
    const openenddatepicker=()=>{
        if( startDate != null && startTime != null ){
          setOpenEndDateCalendar(true);
          setTimeDataHours([]);
        }else{
          Alert.alert(
            "Warning",
            "Please select from date",
              [
              { text: "OK" }
            ]
          );
        }
        
        //console.log(new Date());
    }
    const closestartpickr = () => {
      setOpenStartDateCalendar(false);
      setStartDateTime(null);
      setStartTime(null);
      setStartDate(null);
      setDisableStatus(true);
    }
    const closeendpickr = () => {
      setOpenEndDateCalendar(false);
      setEndDateTime(null);
      setEndTime(null);
      setEndDate(null);
      setDisableStatus(true);
    }

    const checkStartDateisAvail = (date) => {
      setStartDate(date);
      setTimeDataHours(timesData);
      setDisableStatus(false);
    };

    const savestartdate = () => {
      if( startDate != null && startTime !=null){
        setOpenStartDateCalendar(false);
        setDisableStatus(true);
      }else{
        Alert.alert(
          "Warning",
          "Date and Time must be selected",
            [
            { text: "OK" }
          ]
        );
      }
      
    }

    const startDateFocus = () => {
      if( startDate == null){
        Alert.alert(
          "Warning",
          "Please select the date.",
        );
      }
    }

    const endDateFocus = () => {
      if( endDate == null){
        Alert.alert(
          "Warning",
          "Please select the date.",
        );
      }
    }

    const saveenddate = () => {
      if( endDate != null && endTime !=null){
        setOpenEndDateCalendar(false);
        setDisableStatus(true);
      }else{
        Alert.alert(
          "Warning",
          "Date and Time must be selected",
            [
            { text: "OK" }
          ]
        );
      }
    }

    const checkEndDateisAvail = (date) => {
      if( date == startDate ){
        setTimeDataHours([]);
        let split_time = startTime.split(':');
        let hours = split_time[0];
        let min = split_time[1];
        let x = 30; //minutes interval
        let times = []; // time array
        let tt = 0; // start time
        let ap = ['AM', 'PM']; // AM-PM
        let cur_time;
        let cur_val;
        for (var i = 0; tt < 24*60; i++) {
          var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
          var mm = (tt%60); // getting minutes of the hour in 0-55 format
          //times[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
          if( hh == 12 || hh == 0 ){
            cur_time = 12 + ':' + ("0" + mm).slice(-2) +' '+ ap[Math.floor(hh/12)];
            cur_val = (hh % 12) + ':' + ("0" + mm).slice(-2);
          }else{
            cur_time = (hh % 12) + ':' + ("0" + mm).slice(-2) +' '+ ap[Math.floor(hh/12)];
            cur_val = (hh % 12) + ':' + ("0" + mm).slice(-2);
          }
          
          if( hh > hours){
            times.push({ 'label': cur_time, 'value': cur_val });
          }
          tt = tt + x;
        }
        setTimeDataHours(times);
      }else{
        setTimeDataHours(timesData);
      }
      setEndDate(date);
      setDisableStatus(false);
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
{ openStartDateCalendar == true ? <> 
    <View style={{ position: 'absolute', left: 0, right: 0, backgroundColor: '#FFF', padding: 10, zIndex: 111, alignItems: 'center', justifyContent: 'center', display: 'flex', height: '100%'}}>
      <CalendarPicker
        startFromMonday={true}
        minDate={new Date()}
        //maxDate={new Date(2017, 6, 3)}
        //todayBackgroundColor="#99e8e4"
        selectedDayColor="#04487b"
        selectedDayTextColor="#FFFFFF"
        disabledDates = {disabledDates}
        onDateChange={ date => checkStartDateisAvail(moment(date).format('YYYY-MM-DD') ) }
      />
      <View style={[styles.inputConatiner, {width: 250, marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#777' } ]}>
          <Dropdown
              style={{ backgroundColor: ( disableStatus == true ) ? '#EEE' : '#FFF', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}
              placeholderStyle={{ color: 'black' }}
              selectedTextStyle={{ color: 'black' }}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={timeDataHours}
              maxHeight={400}
              search
              labelField="label"
              valueField="value"
              placeholder="Select Time"
              searchPlaceholder="Search..."
              value={startTime}
              disable={disableStatus}
              onFocus= { () => startDateFocus() } 
              onChange={item => {
                if( startDate != null ){
                  setStartDateTime(moment(startDate).format('DD-MM-YYYY') +' '+ item?.label);
                  setStartTime(item?.value);
                }else{
                  Alert.alert(
                    "Warning",
                    "Please select Date",
                      [
                      { text: "OK" }
                    ]
                  );
                }
                  
              }}
          />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#04487b', paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20, borderRadius: 5, marginRight: 5 }} onPress={ () => savestartdate() }>
          <Text style={{ color: '#FFF'}}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#B31817', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5 }} onPress={ () => closestartpickr() } >
          <Ionicons name="ios-close-outline" color='#FFF' size={25}></Ionicons>
          <Text style={{ color: '#FFF'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
    </View>
</> :  null }

{ openEndDateCalendar == true ? <> 
    <View style={{ position: 'absolute', left: 0, right: 0, backgroundColor: '#FFF', padding: 10, zIndex: 111, alignItems: 'center', justifyContent: 'center', display: 'flex', height: '100%'}}>
      <CalendarPicker
        startFromMonday={true}
        minDate={startDate}
        disabledDates = {disabledDates}
        //maxDate={new Date(2017, 6, 3)}
        //todayBackgroundColor="#99e8e4"
        selectedDayColor="#04487b"
        selectedDayTextColor="#FFFFFF"
        onDateChange={ date => checkEndDateisAvail(moment(date).format('YYYY-MM-DD')) }
      />
      <View style={[styles.inputConatiner, {width: 250, marginTop: 20, marginBottom: 20, borderWidth: 1, borderColor: '#777' } ]}>
          <Dropdown
              style={{ backgroundColor: ( disableStatus == true ) ? '#EEE' : '#FFF', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}
              placeholderStyle={{ color: 'black' }}
              selectedTextStyle={{ color: 'black' }}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={timeDataHours}
              maxHeight={400}
              search
              labelField="label"
              valueField="value"
              placeholder="Select Time"
              searchPlaceholder="Search..."
              value={endTime}
              disable={disableStatus}
              onFocus= { () => endDateFocus() } 
              onChange={item => {
                if( endDate != null ){
                  setEndDateTime(moment(endDate).format('DD-MM-YYYY') +' '+ item?.label);
                  setEndTime(item?.value);
                }else{
                  Alert.alert(
                    "Warning",
                    "Please select Date",
                      [
                      { text: "OK" }
                    ]
                  );
                }
                  
              }}
          />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#04487b', paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20, borderRadius: 5, marginRight: 5 }} onPress={ () => saveenddate() }>
            <Text style={{ color: '#FFF'}}>Save</Text>
          </TouchableOpacity>  
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#B31817', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5 }} onPress={ () => closeendpickr() } >
            <Ionicons name="ios-close-outline" color='#FFF' size={25}></Ionicons>
            <Text style={{ color: '#FFF'}}>Cancel</Text>
          </TouchableOpacity>
      </View>
    </View>
</> :  null }

            <View style={styles.inputConatiner}>
              <TextInput
                  style={{ width: '90%', alignSelf: 'center' }}
                  pointerEvents="none"
                  mode="outlined"
                  // style={{height:47}}
                  label="Data da"
                  value={startDateTime}
                  placeholder="Data da"
                  theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#04487b' } }}
                  //maxLength={10}
                  keyboardType='default'
                  onTouchStart={() => openstartdatepicker()}
                  right={<TextInput.Icon name="calendar" />}
                  showSoftInputOnFocus={false}
              />
              
            </View>
            <View style={styles.inputConatiner}>
              
              <TextInput
                  style={{ width: '90%', alignSelf: 'center' }}
                  pointerEvents="none"
                  mode="outlined"
                  // style={{height:47}}
                  label="Data a"
                  value={endDateTime}
                  placeholder="Data a"
                  theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#04487b' } }}
                  //maxLength={10}
                  keyboardType='default'
                  onTouchStart={() => openenddatepicker()}
                  right={<TextInput.Icon name="calendar" />}
                  showSoftInputOnFocus={false}
              />
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
                  theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#04487b' } }}
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
          </>}
        </View>
    )
}
export default AssetsBooking;