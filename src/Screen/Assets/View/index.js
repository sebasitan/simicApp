import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  ScrollView
} from 'react-native';
import {
    Title,
    Paragraph,
} from 'react-native-paper';
import Pinchable from 'react-native-pinchable';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '../../../Services/url';
import RNFetchBlob from 'rn-fetch-blob';
import * as Utility from '../../../Utility/inbdex';

const AssetViewScreen = ({route, navigation}) => {
  const [itemId, setItemId] = useState(route?.params?.itemid);
  const [userId, setUserId] = useState(route?.params?.userid);
  const [itemDetails, setItemDetails] = useState([]);
  const [itemLocation, setItemLocation] = useState([]);
  const [loader,setLoader]=React.useState(false);
  const [assetsHistorys,setAssetsHistory]=React.useState([])
  const [assetsMaintainces,setAssetsMaintainces]=React.useState([])
  const [bookingHistory,setBookingHistory]=React.useState([]);
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [userRole, setUserRole] = React.useState(null);

  var fileImg = '../../../assets/images/file.png';

  useEffect( () => {
      (
        async() => {
          if(userId !='' && itemId !=''){
            getUserInfomation();
            getItemDetials();
          }
        }
      ) ();
  },[]);

  const getUserInfomation = async () =>{
      let userdata = await Utility.getFromLocalStorge('userData');
      setUserRole(userdata?.user_role);
  };

  const getItemDetials=()=>{
    setLoader(true);

    let formData = {
      user_id : userId,
      item_id : itemId,
    }
    axios({
          url: `${API_BASE_URL}itemView`,
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
          let itemdetail = JSON.stringify(res?.data?.item_details);
          let itemdetailjson = JSON.parse(itemdetail);
          setItemDetails(itemdetailjson);
          //console.log(itemDetails);
          let itemdetail1 = JSON.stringify(res?.data?.item_history);
          let itemdetailjson1 = JSON.parse(itemdetail1);
          setAssetsHistory(itemdetailjson1);
          let itemdetail2 = JSON.stringify(res?.data?.maintenance_history);
          let itemdetailjson2 = JSON.parse(itemdetail2);
          setAssetsMaintainces(itemdetailjson2);
          let itemdetail3 = JSON.stringify(res?.data?.book_history);
          let itemdetailjson3 = JSON.parse(itemdetail3);
          setBookingHistory(itemdetailjson3);

          let itemlocation = JSON.stringify(res?.data?.item_details?.location_details.location);
          let itemlocationjson = JSON.parse(itemlocation);
          setItemLocation(itemlocationjson);

          let itemupcomingdates = JSON.stringify(res?.data?.book_upcoming);
          let itemupcomingdatesjson = JSON.parse(itemupcomingdates);
          setUpcomingDates(itemupcomingdatesjson);

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


  const downloadDocument = async(url) => {

    if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message: 'Application needs access to your storage to download File',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Start downloading
            downloadFile(url);
            //console.log('Storage Permission Granted.');
          } else {
            // If permission denied then show alert
            Alert.alert('Error','Storage Permission Not Granted');
          }
        } catch (err) {
          // To handle permission related exception
          Alert.alert('Error','Something went wrong. please try again.');
        }
    }
    
}

  const downloadFile = (url) => {
      let date = new Date();
      var FILE_URL = url;
      //console.log(FILE_URL);
      if(FILE_URL !=''){
        let file_ext = getFileExtention(FILE_URL);
        file_ext = '.' + file_ext[0];
      const { config, fs } = RNFetchBlob;
      let RootDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          path: RootDir+'/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
          description: 'downloading file...',
          notification: true,
          useDownloadManager: true,   
        },
      };
      config(options)
        .fetch('GET', FILE_URL)
        .then(res => {
          // Alert after successful downloading
          //console.log('res -> ', JSON.stringify(res));
          alert('File Downloaded Successfully.');
        });
      }else{
        Alert.alert('Error','Something went wrong. please try again.');
      }

  };

  const getFileExtention = fileUrl => {
      // To get the file extension
      return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  
  return(
      <ScrollView>
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
              <View style={{  flexDirection: 'column', justifyContent: 'space-between'}}>
                <Title style={[ styles.regularFont, { fontSize: 14, marginRight: 10 }]}>Categorie: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails.parent_item_name ? '>> '+ itemDetails.parent_item_name  : '' }</Text>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails.sub_item_name ? '>> '+ itemDetails.sub_item_name  : '' }</Text>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{itemDetails.sub_subitem_name ? '>> '+ itemDetails.sub_subitem_name  : '' }</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Stato articolo: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14, backgroundColor: itemDetails.status_colour, paddingLeft: 10, paddingRight: 10 }]}>{itemDetails?.status_name}</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', flexWrap: 'wrap' }}>
                <Title style={[ styles.regularFont, { fontSize: 14 }]}>Nome posizione: </Title>
                <Text style={[ styles.regularFont, { fontSize: 14 }]}>{ itemDetails?.location_name }</Text>
              </View>
              <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginTop: 10 }}>
              { itemDetails.item_image_url !='' ? <>
                <View>
                  <MaterialCommunityIcons name="gesture-spread" size={30} color='#888' style={{ position: 'absolute', top: 5, right: 25, zIndex: 1, backgroundColor: '#F1F1F1'}}/>
                  <Pinchable>
                    <Image source={{uri:itemDetails?.item_image_url}} style={{width: 150, height: 150, borderRadius: 10, marginRight: 20 }}/>
                  </Pinchable>
                </View>
              </> : <>
                <Image source={ require('../../../assets/images/empty.png') } style={{width: 150, height: 150, borderRadius: 10, marginRight: 20 }}/>
              </> }

                { itemDetails.item_instructions_url !='' ? <>
                  <TouchableOpacity onPress={()=>downloadDocument(itemDetails.item_instructions_url)}>
                    <Image source={ require(fileImg) } style={{ alignSelf: 'center'}}></Image>
                    <Text style={{ marginTop: 10, color:"#04487b" }}>{ itemDetails?.item_instructions_name }</Text>
                  </TouchableOpacity>
                </> : null }
              </View>
              { upcomingDates.length > 0 ? <> 
                <TouchableOpacity onPress={() => navigation.navigate('AssetUpcomingDates', { item:upcomingDates} ) } style={{  backgroundColor: '#c568d5', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 10, marginTop: 10, flex: 1, flexDirection: 'row' }}>
                    <Ionicons name="calendar-sharp" color='#FFFFFF' size={20}></Ionicons>
                    <Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 13 }}>Prenotazioni Attive</Text>
                </TouchableOpacity>
              </> : null }
                
              { itemDetails.asset_status_item != 0 ? <>
                <TouchableOpacity onPress={() =>
                    navigation.navigate('AssetsEditing', {
                      item:itemDetails
                    })
                  } style={{  backgroundColor: '#B31817', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 10, marginTop: 10, flex: 1, flexDirection: 'row' }}>
                    <Ionicons name="ios-create-outline" color='#FFFFFF' size={20}></Ionicons>
                    <Text style={{ marginLeft: 0, color: '#FFFFFF', fontSize: 13 }}>PRELEVA - DEPOSITA</Text>
                </TouchableOpacity>
              </> : null }
              
              <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 15, paddingLeft: 15, paddingRight: 15 }} onPress={() =>assetsHistory(assetsHistorys) }>
                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                    <Ionicons name="library-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                    <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Cronologia dei movimenti</Paragraph>
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
              { userRole != null && userRole != 3 ? <> 
                  <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 15, paddingTop: 15, alignContent:'space-between', backgroundColor: '#FFF', marginLeft: -15, marginRight: -15, marginTop: 0, paddingLeft: 15, paddingRight: 15, marginBottom: -15 }} onPress={() =>assetsMantiance(assetsMaintainces,itemId)} >
                    <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start'}}>
                      <Ionicons name="construct-outline" size={25} color='#333'style={{alignSelf: 'flex-start'}}/>
                      <Paragraph style={[styles.fontFamily, { marginLeft: 10 } ]}>Manutenzione</Paragraph>
                    </View>
                    <Ionicons name="ios-chevron-forward-sharp" size={25} color='#777'/>
                </TouchableOpacity>
              </> : null }
            </View>
          </View>
        </View>
      </ScrollView>
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
export default AssetViewScreen;