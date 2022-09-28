import React, { useEffect,useState } from "react";
import {View,Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList} from 'react-native';
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
    width:100,
    alignItems:'center',
    // borderTopLeftRadius:20,borderBottomLeftRadius:20
  },
  formAction1:{
    padding:10,
    backgroundColor:'#04487b',
    borderColor:'#04487b',
    borderWidth:1,
    width:100,
    alignItems:'center',
    // borderTopRightRadius:20,
    // borderBottomRightRadius:20,
    // width:'100%'
    

  },
  formActionText1:{
    color:'white'
  },
  formActionText:{
    color:'black'
  }
})
const AssetsMaintance = ({ route, navigation }) => {
  const { item,id } = route?.params;
  //console.log("item is.../", id)
  // const {item}=route?.params;
  const [activeSheet,setActiveSheet]=React.useState('Form')
  const [toDate,setToDate]=React.useState();
  const [fromDate,setFromDate]=React.useState();
  const [descrption,setDescrption]=React.useState('');
  const [category,setCategory]=React.useState();
  const [categoryList,setCategoryList]=React.useState([ {value:1, label:'maintaince'},{value:2, label:'Revision'}]);
  const [reminderDays, setReminderDays] = React.useState('');
  const [userId,setUserId]=React.useState();
  const [loader,setLoader]=React.useState(false);
  const [open, setDateOpen] = useState(false)
  const [secondDateOpen,setSecondDateOpen]=React.useState(false);
  const [reportingdate,setReportingDate]=React.useState(new Date());
  const [secondReportingDate,setSecondReportingDate]=React.useState(new Date());

  React.useEffect(()=>{
    getUserdetails();
    //console.log(item);
    //item ? setReminderDays( item[0]['rem_days'] ) : setReminderDays(5);
    item !='' ? setReminderDays( item[0]['rem_days'] ) : setReminderDays(5);

},[])
const getUserdetails=async()=>{
    let id=await Utility.getFromLocalStorge('userToken');
    setUserId(id);
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
    //console.log("maintance view is>>",item)
    return (
      <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10, marginLeft: 10, marginRight: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between'}}>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20 }}>Nome articolo: </Title>{item?.asset_name}</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Tipo di scadenza: </Title>{ item.maintenance_type == 1 ? 'Manutenzione' : 'Revisione' }</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20 }}>Giorni di preavviso per promemoria: </Title>{item?.rem_days}</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20 }}>Data: </Title>{item?.maintenance_date}</Text>
                        <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Note: </Title>{item?.notes}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
  };
  const openLocalDatePkr = () => {
    setDateOpen(true)
};
const econdDatePkr=()=>{
    setSecondDateOpen(true)
}
const AddMaintinace=()=>{
       let formData = {
            user_id:userId,
            asset_id:id,
            reminders_days:reminderDays,
            expiry_type:category,
            date:moment(toDate)
            .format('YYYY/MM/DD'),
            notes:descrption,
          }
          //console.log("aessets Booking . form",formData)
          axios({
              url: `${API_BASE_URL}asset_maintenance`,
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
                alert("Maintaince Added Successfully")
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
  return (
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
      {activeSheet==="List"?
      <>
      <Text style={{alignSelf:'center',fontSize:18,marginTop:10, fontFamily: 'Montserrat-Regular'}}>Scadenze di manutenzione</Text>
      
      {item?.length === 0 ? <NoDataFound title="No Data Found"/> :
        <FlatList
          data={item}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          style={{ marginTop: 20 }}
        />}
        </>
        :

        <View >
          <ScrollView>
          <View style={styles.inputConatiner}>
                <TextInput
                    style={{ width: '90%', alignSelf: 'center' }}
                    pointerEvents="none"
                    mode="outlined"
                    // style={{height:47}}
                    label="Giorni di preavviso per promemoria"
                    onChangeText={(text)=>setReminderDays(text)}
                    value={reminderDays}
                    placeholder="Giorni di preavviso per promemoria"
                    theme={{ colors: { primary: '#99e8e4', underlineColor: 'yellow', accent: '#99e8e4' } }}
                    keyboardType='numeric'

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
            <View style={styles.inputConatiner}>
            <TextInput
                            style={{ width: '90%', alignSelf: 'center' }}
                            pointerEvents="none"
                            mode="outlined"
                            // style={{height:47}}
                            label="Data a"
                            value={moment(fromDate).format('DD-MM-YYYY HH:mm')}
                            placeholder="Data a"
                            theme={{ colors: { primary: '#99e8e4', underlineColor: 'yellow', accent: '#99e8e4' } }}
                            maxLength={10}
                            keyboardType='default'
                            onTouchStart={() => econdDatePkr()}
                            right={<TextInput.Icon name="calendar" />}
                        />
            </View>
              
              <View style={styles.inputConatiner}>
            <TextInput
                            style={{ width: '90%', alignSelf: 'center' }}
                            pointerEvents="none"
                            mode="outlined"
                            // style={{height:47}}
                            label="Descrizione"
                            onChangeText={(text)=>setDescrption(text)}
                            value={descrption}
                            placeholder="Descrizione"
                            theme={{ colors: { primary: '#99e8e4', underlineColor: 'yellow', accent: '#99e8e4' } }}
                            keyboardType='default'
    
                        />
            </View>
      
            <TouchableOpacity onPress={()=>AddMaintinace()} style={styles.saveButton}>
            <View>
                <Text style={styles.saveButtonText}>Save</Text>
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
                            //console.log("Return date choose may...", date)
                            setToDate(date);
                            setReportingDate(date)
                        }}
                        onCancel={() => {
                            setDateOpen(false)
                        }}
                    />
                      <DatePicker
                        modal
                        minDate={new Date()}
                        minimumDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
                        open={secondDateOpen}
                        date={secondReportingDate}
                        onConfirm={(date) => {
                            setSecondDateOpen(false)
                            //console.log("Return date choose may...", date)
                            setFromDate(date);
                            setSecondReportingDate(date)
                        }}
                        onCancel={() => {
                            setSecondDateOpen(false)
                        }}
                    />
          </ScrollView>
        </View>}
        </View>
  )
}
export default AssetsMaintance;