import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {
    Title,
    Paragraph,
} from 'react-native-paper';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';
import AssetsBooking from '../AssestsBooking';

const Viewing = ({route, navigation}) => {
const {data}=route?.params;
  const [userToken, setUserToken] = useState(null);
  const [itemDetails, setItemDetails] = useState([]);
  const [itemLocation, setItemLocation] = useState([]);
  const [loader,setLoader]=React.useState(false);
  const [assetsHistorys,setAssetsHistory]=React.useState([])
  const [assetsMaintainces,setAssetsMaintainces]=React.useState([])
  const [bookingHistory,setBookingHistory]=React.useState([]);
  useEffect( () => {
      (
        async() => { 
          const userToken = await AsyncStorage.getItem('userToken');
          console.log("usertoken...",userToken);
          getItemDetials(userToken)
        }
      ) ();
  },[]);
  const getItemDetials=(id)=>{
    setLoader(true)
      let formData = {
          user_id :62,
          item_id : data?.item_id,
      }
      console.log("aessets addition form...",formData)
      axios({
          url: `${API_BASE_URL}itemView`,
          method: 'POST',
          data: formData,
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
          },
      }).then(res => {
        setLoader(false)
        console.log("vikas view page..",res?.data)
        if(res.data.status == 1){
          let itemdetail = JSON.stringify(res?.data?.item_details);
          let itemdetailjson = JSON.parse(itemdetail);
          setItemDetails(itemdetailjson);
          let itemdetail1 = JSON.stringify(res?.data?.item_history);
          let itemdetailjson1 = JSON.parse(itemdetail1);
          setAssetsHistory(itemdetailjson1);
          let itemdetail2 = JSON.stringify(res?.data?.maintenance_history);
          let itemdetailjson2 = JSON.parse(itemdetail2);
          setAssetsMaintainces(itemdetailjson2);
          let itemdetail3 = JSON.stringify(res?.data?.book_history);
          let itemdetailjson3 = JSON.parse(itemdetail3);
          setBookingHistory(itemdetailjson3);

          let itemlocation = JSON.stringify(res.data.item_details.location_details.location);
          let itemlocationjson = JSON.parse(itemlocation);
          setItemLocation(itemlocationjson);
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
  const assetsMantiance=(item,id)=>{
    navigation.navigate('AssetsMaintance',{item:item,id:id})
  }
  const assetsHistory=(item)=>{
    navigation.navigate('AssetsHistory',{item:item})
  }
  const assetsBooking=(item)=>{
    navigation.navigate('AssetsBooking' ,{item:item,booking:bookingHistory})
  }
    return(
          <View style={[ styles.container ]}>
            {loader?
            <ActivityIndicator size={50}/>:null}
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#FFF' }} >
                  <Ionicons name="ios-cube-outline" size={23} color='#333' />
                  <Text style={[styles.regularFont, { color: '#333', fontSize: 16, marginLeft: 5 }]}>Dettagli dell'articolo</Text>
              </View>
              <View style={{ backgroundColor: '#f8f8ff', paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 10 }}>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Nome articolo: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails?.item_name}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Descrizione: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails?.description}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Categorie: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails?.parent_item_name  }</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Stato articolo: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails?.status_name}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', flexWrap: 'wrap' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Nome posizione: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{ itemDetails?.location_name }</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginTop: 10 }}>
                { itemDetails.item_image_url !='' ? <Image source={{uri:itemDetails?.item_image_url}} style={{width: 150, height: 150, borderRadius: 10, marginRight: 20 }}/> : <Image source={ require('../../../assets/images/empty.png') } style={{width: 150, height: 150, borderRadius: 10, marginRight: 20 }}/> }
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 15, paddingLeft: 15, paddingRight: 15 }} onPress={() =>assetsHistory(assetsHistorys) }>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="library-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Storia dell'oggetto</Paragraph>
                  </View>
                  <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 0, paddingLeft: 15, paddingRight: 15 }} onPress={() =>assetsBooking(itemDetails,bookingHistory)} >
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="calendar-sharp" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Prenotazione</Paragraph>
                  </View>
                  <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 0, paddingLeft: 15, paddingRight: 15, marginBottom: -15 }} onPress={() =>assetsMantiance(assetsMaintainces,data?.item_id)} >
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="construct-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Manutenzione</Paragraph>
                  </View>
                  <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
    
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection: "column",
        paddingLeft: 15,
        paddingRight: 15,
    },
    regularFont: {
      // fontFamily : 'Montserrat-Regular'
    },
    primaryColor: {
      color: '#04487b'
    }
});
export default Viewing