import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import {
    Title,
    Paragraph,
} from 'react-native-paper';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';

const Viewing = ({route, navigation}) => {

  let itemId = route.params.params.itemId;
  let itemTitle = route.params.params.itemTitle;

  const [userToken, setUserToken] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);
  const [itemLocation, setItemLocation] = useState([]);

  useEffect( () => {
      navigation.setOptions({ title: itemTitle }),
      (
        async() => { 
          const userToken = await AsyncStorage.getItem('userToken');
          setUserToken(userToken);
          //console.log(userToken);
          if( userToken != null ){
              let formData = {
                  user_id : userToken,
                  item_id : itemId,
              }
              axios({
                  url: `${API_BASE_URL}/itemView`,
                  method: 'POST',
                  data: formData,
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'multipart/form-data',
                  },
              }).then(res => {
                if(res.data.status == 1){
                  let itemdetail = JSON.stringify(res.data.item_details);
                  let itemdetailjson = JSON.parse(itemdetail);
                  setItemDetails(itemdetailjson);
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
                  Alert.alert(
                      "Warning",
                      "Somthing went wrong, Try Again",
                      [
                        { text: "OK" }
                      ]
                  );
              });
          }
        }
      ) ();
  },[]);
    return(
          <View style={[ styles.container ]}>
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#FFF' }} >
                  <Ionicons name="ios-cube-outline" size={23} color='#333' />
                  <Text style={[styles.regularFont, { color: '#333', fontSize: 16, marginLeft: 5 }]}>Dettagli dell'articolo</Text>
              </View>
              <View style={{ backgroundColor: '#f8f8ff', paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 10 }}>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Nome articolo: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails.item_name}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Descrizione: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails.description}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Categorie: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails.description}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Stato articolo: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails.status_name}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', flexWrap: 'wrap' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Nome posizione: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{ itemLocation.location_name }</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginTop: 10 }}>
                { itemDetails.item_image_url !='' ? <Image source={{uri:itemDetails.item_image_url}} style={{width: 150, height: 150, borderRadius: 10, marginRight: 20 }}/> : <Image source={ require('../../../assets/images/empty.png') } style={{width: 150, height: 150, borderRadius: 10, marginRight: 20 }}/> }
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 15, paddingLeft: 15, paddingRight: 15 }} onPress={() => {  
                    navigation.navigate('ViewAssetHistory', {
                      screen: 'ViewAssetHistory',
                      params: { 
                        itemId: itemDetails.item_id,
                        itemTitle: itemDetails.item_name 
                      },
                    })
              }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="library-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Storia dell'oggetto</Paragraph>
                  </View>
                  <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 0, paddingLeft: 15, paddingRight: 15 }} onPress={() => {  
                    navigation.navigate('ViewAssetBooking', {
                      screen: 'ViewAssetBooking',
                      params: { 
                        itemId: itemDetails.item_id,
                        //itemTitle: itemDetails.item_name 
                      },
                    })
              }} >
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="calendar-sharp" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Prenotazione</Paragraph>
                  </View>
                  <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 0, paddingLeft: 15, paddingRight: 15, marginBottom: -15 }} onPress={() => {  
                    navigation.navigate('ViewAssetMaintenance', {
                      screen: 'ViewAssetMaintenance',
                      params: { 
                        itemId: itemDetails.item_id,
                        itemTitle: itemDetails.item_name 
                      },
                    })
              }} >
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
export default Viewing;