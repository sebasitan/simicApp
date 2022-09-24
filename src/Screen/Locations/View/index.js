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

const LocationViewing = ({route, navigation}) => {
  const { item } = route?.params;
  //console.log(item?.location_id);
  const [loader,setLoader]=React.useState(false);
    return(
      <View style={[ styles.container ]}>
      {loader?
      <ActivityIndicator size={50}/>:null}
      <View style={{ marginTop: 20 }}>
        
        <View style={{ backgroundColor: '#f8f8ff', paddingTop: 10, paddingLeft: 15, paddingRight: 15, paddingBottom: 10 }}>
        <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
          <Title style={[ styles.regularFont, { fontSize: 14 }]}>Nome: </Title>
          <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.location_name}</Text>
        </View>
        <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
          <Title style={[ styles.regularFont, { fontSize: 14 }]}>Nome sito: </Title>
          <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.site_name}</Text>
        </View>
        <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
          <Title style={[ styles.regularFont, { fontSize: 14 }]}>Descrizione: </Title>
          <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.description}</Text>
        </View>
        <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
          <Title style={[ styles.regularFont, { fontSize: 14 }]}>Stato: </Title>
          <Text style={[ styles.regularFont, { fontSize: 14 }]}>{item?.status == 1 ? 'Attivo' : 'Non attivo' }</Text>
        </View>
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
export default LocationViewing;