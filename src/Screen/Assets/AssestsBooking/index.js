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
    const [ disabledTimes, setDisabledTimes ] = React.useState(null);

    const isFocused = useIsFocused();

    React.useEffect(()=>{
        getUserdetails();
    },[isFocused]);

    const timesData = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

    const getUserdetails = async() => {
        let id=await Utility.getFromLocalStorge('userToken');
        setUserId(id);
        callLocationApi(id);
        getdisableddates(item?.item_id);
    }

    const callLocationApi=(id)=>{
        let formData = {
          search_key: '',
        }
        axios({
            url: `${API_BASE_URL}locationFullList/${id}`,
            method: 'POST',
            data:formData,
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
                setLoader(false);
                //console.log(res?.data);
                if(res.data.status == 1){
                  alert("Assets Booking Successfully")
                  navigation.navigate('DrawerNavigation')
                }else{
                  Alert.alert(
                    "Warning",
                    res.data.message,
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
      let timeslot = [];
      let formData = {
        item_id : item?.item_id,
        date: date
      };
      axios({
        url: `${API_BASE_URL}bookchecktime`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        if( res?.data?.status == 1 ){
          let disableDays = res?.data?.asset_time;
          let array3 = timesData.filter(entry1 => !disableDays.some(entry2 => entry1 === entry2));
          //console.log(array3);
          if(array3.length > 0 ){
            for( let i = 0; i < array3.length; i++ ){
              timeslot.push( { 'label': array3[i], 'value' : array3[i] } );
            }
          }
        }else if(res?.data?.status == 2){
          let message = res?.data?.message;
          Alert.alert(
            "Sorry",
            message,
              [
              { text: "OK" }
            ]
          );
        }else{
          //console.log(res?.data);
          for( let i = 0; i < 24; i++ ){
            if( i >= 10){
              timeslot.push( { 'label': i +':00', 'value' : i + ':00'} );
            }else{
              timeslot.push( { 'label': '0'+ i +':00', 'value' : '0'+ i + ':00'} );
            }
          }
        }
        //console.log(timeslot);
      }).catch(e => {
        Alert.alert(
          "Warning",
          "Somthing went wrong, Try Again",
            [
            { text: "OK" }
          ]
        );
      });

      setStartDate(date);
      setTimeDataHours(timeslot);
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
        let timeslot = [];

        let split_time = startTime.split(':');
        let hours = split_time[0];

        let formData = {
            item_id : item?.item_id,
            date: date
        };
          axios({
            url: `${API_BASE_URL}bookchecktime`,
            method: 'POST',
            data: formData,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }).then(res => {
            //console.log(res?.data);
            if( res?.data?.status == 1 ){
                let disableDays = res?.data?.asset_time;
                let disabletimes = [];
                if( startDate == date ){
                    let disabletimefromstart = [];
                    for( let i = 0; i <= hours; i++ ){
                      if( i <= 9 ){
                        disabletimefromstart.push('0'+i+':00');
                      }else{
                        disabletimefromstart.push(i+':00');
                      }
                      
                    }
                    disableDays.push(...disabletimefromstart);
                    disabletimes = [...new Set(disableDays)];
                }else{
                  disabletimes = disableDays;
                }
                
                let array3 = timesData.filter(entry1 => !disableDays.some(entry2 => entry1 === entry2));
                if(array3.length > 0 ){
                  for( let i = 0; i < array3.length; i++ ){
                    timeslot.push( { 'label': array3[i], 'value' : array3[i] } );
                  }
                }
              }else{
                if( startDate == date ){
                  for( let i = 0; i < 24; i++ ){
                    if( i > hours ){
                      if( i >= 10){
                        timeslot.push( { 'label': i +':00', 'value' : i + ':00'} );
                      }else{
                        timeslot.push( { 'label': '0'+ i +':00', 'value' : i + ':00'} );
                      }
                    }
                  }
                }else{
                  for( let i = 0; i < 24; i++ ){
                    
                    if( i >= 10){
                      timeslot.push( { 'label': i +':00', 'value' : i + ':00'} );
                    }else{
                      timeslot.push( { 'label': '0'+ i +':00', 'value' : i + ':00'} );
                    }
                    
                  }
                }
                
              }
              //console.log(timeslot);
            }).catch(e => {
              Alert.alert(
                "Warning",
                "Somthing went wrong, Try Again",
                  [
                  { text: "OK" }
                ]
          );
      });
      setTimeDataHours(timeslot);
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
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Data da: </Title>{ moment(item?.date_from).format('DD-MM-YYYY hh:mm a')}</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Data d: </Title>{ moment(item?.date_to).format('DD-MM-YYYY hh:mm a')}</Text>
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
                  setEndDate(null);
                  setEndTime(null);
                  setEndDateTime(null);
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