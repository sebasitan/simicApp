import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Title,
  Paragraph,
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';
//import HomeHeader from '../../../Component/HomeHeader';
import NoDataFound from '../../../Component/NoDataFound';
import * as Utility from '../../../Utility/inbdex';
const Listing = ({ navigation }) => {
  const [userToken, setUserToken] = useState(null);
  //const [isLoading, setisLoading] = useState(false);
  const [masterItemData, setmasterItemData] = useState([]);
  const [filterItemData, setfilterItemData] = useState([]);
  //const [search, setSearch] = useState('');
  const [loader, setLoader] = React.useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    (
      async () => {
        let userToken = await Utility.getFromLocalStorge('userToken');
        setUserToken(userToken);
        if (userToken != null) {
          // setLoader(true)
          getDocumentListingData(userToken);
        }
        
      }
    )();

  }, [isFocused]);

  const getDocumentListingData = (userToken) => {
    axios({
      url: `${API_BASE_URL}/viewDocument/${userToken}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      if (res.data.status == 1) {
        let item_list = JSON.stringify(res.data.document_list);
        let itemjson = JSON.parse(item_list);
        setmasterItemData(itemjson);
        setfilterItemData(itemjson);
        setLoader(false);
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
      Alert.alert(
        "Warning",
        "Somthing went wrong, Try Again",
        [
          { text: "OK" }
        ]
      );
    });
  };

  const goToDocumentEdit = (item) => {
    //console.log("item is>>>..", item)
    navigation.navigate('DocumentEditing', { itemId: item })
  }
  const goToDocumentView = (item) => {
    navigation.navigate('DocumentView', { itemId: item })
  }
  const deleteDocument = (item) => {
    setLoader(true)
    let formData = {
      user_id: userToken,
      document_id: item?.id
    }
    //console.log("aessets addition form...", formData)
    axios({
      url: `${API_BASE_URL}deleteDocument`,
      method: 'POST',
      data: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      //console.log("", res?.data)
      if (res?.data?.status) {

      }
      alert("Document delete Succesffuly");
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
    // alert('Documents Deleted Successfuly')
  }
  const ItemView = ({ item }) => {

    return (
      <TouchableOpacity>
        <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'space-between' }}>
            <View style={{ alignSelf: 'flex-start', justifyContent: 'center' }}>
              {item.documents != '' ? <Image source={{ uri: item.documents }} style={{ width: 70, height: 100, marginRight: 15 }} /> : <Image source={require('../../../assets/images/empty.png')} style={{ width: 80, height: 100, marginRight: 15 }} />}
            </View>
            <View style={{ alignSelf: 'flex-start' }}>
              <View style={{ flexDirection: 'column' }}>
                <Paragraph style={[styles.fontFamily, { fontSize: 12 }]}>Tipo documento: {item.document_type === 1 ? 'Transport Document' : 'Formulary'}</Paragraph>
                <Paragraph style={[styles.fontFamily, { fontSize: 12 }]}>Numero del documento: {item.shop_assistant}</Paragraph>
                <Paragraph style={[styles.fontFamily, { fontSize: 12 }]}>Numero DDT / Formulario: {item.ddt_number}</Paragraph>
                <Paragraph style={[styles.fontFamily, { fontSize: 12 }]}>Numero commessa: {item.order_no}</Paragraph>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8, borderTopColor: '#EEE', borderTopWidth: 1, paddingTop: 8 }}>
            <TouchableOpacity onPress={() => goToDocumentView(item)} style={{ flexDirection: 'row' }}>
              <Ionicons name="eye-outline" color='#04487b' size={16}></Ionicons><Text style={{ marginLeft: 4, color: '#04487b', fontSize: 13 }}>Visualizzazione</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToDocumentEdit(item)} style={{ flexDirection: 'row', marginLeft: 13, marginRight: 13 }}>
              <Ionicons name="ios-create-outline" color='#ff8c00' size={16}></Ionicons><Text style={{ marginLeft: 0, color: '#ff8c00', fontSize: 13 }}>Modifica</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteDocument(item)} style={{ flexDirection: 'row' }}>
              <Ionicons name="ios-trash-outline" color='#B31817' size={16}></Ionicons><Text style={{ marginLeft: 0, color: '#B31817', fontSize: 13 }}>Cancella</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 10,
          width: '100%',
          backgroundColor: 'transparent',
        }}
      />
    );
  };

  if (loader == true) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
 
  const documentAddition = () => {
    navigation.navigate('DocumentAddition')
  }
  return (
    <>
      {/* <HomeHeader title="Tutti gli oggetti" openDrawer={openDrawer} /> */}
      <View style={styles.container}>
        <StatusBar backgroundColor='#04487b' hidden={false} />
        <View style={{ flex: 1, marginTop: 20 }}>
          {filterItemData?.length > 0 ?
            <FlatList
              data={filterItemData}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ItemView}
              style={{ marginTop: 20 }}
            /> : <NoDataFound title={"No Data Found"} />}
          <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', bottom: 20, alignSelf: 'flex-end' }}>
              <TouchableOpacity onPress={() => documentAddition()}>
                <Ionicons name="add-circle-sharp" color='#B31817' size={45}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>

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
  fontRegular: {
    // fontFamily : 'Montserrat-Regular'
  }
});

export default Listing;