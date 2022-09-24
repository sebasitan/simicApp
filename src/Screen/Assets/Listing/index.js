import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler
} from 'react-native';
import {
  Title,
  Paragraph,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';
//import HomeHeader from '../../../Component/HomeHeader';
import * as Utility from '../../../Utility/inbdex';
const AssetsListig = ({ navigation }) => {
  const [userToken, setUserToken] = React.useState(null);
  const [isLoading, setisLoading] = React.useState(false);
  const [masterItemData, setmasterItemData] = React.useState([]);
  const [filterItemData, setfilterItemData] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [search, setSearch] = useState('');
  const [drawerStatus, setDrawerStatus] = React.useState(false);

  useFocusEffect(
      React.useCallback(() => {
        fetchAssetsList(1,2)
      }, []),
  );

  const fetchAssetsList = async (pagenumber,type) => {
    // setisLoading(true)
    if(type===2){
      // alert("yes")
      setfilterItemData([])
    }
  
    let userToken =await Utility.getFromLocalStorge('userToken');
    setUserToken(userToken);
    if (userToken != null) {
      let formData = {
        user_id: userToken,
        search_key: '',
      }
      axios({
        url: `${API_BASE_URL}/itemlist?page=${pagenumber}`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        //console.log("data is", res);
        if (res.data.status == 1) {
          // setisLoading(false)
          let item_list = JSON.stringify(res.data.item_list);
          //console.log("Vikas All listing data..", item_list);
          let itemjson = JSON.parse(item_list);
          setmasterItemData(itemjson);
          setfilterItemData([...filterItemData, ...itemjson]);
        } else {
          // setisLoading(false)
          Alert.alert(
            "Warning",
            "Somthing went wrong, Try Again",
            [
              { text: "OK" }
            ]
          );
        }
      }).catch(e => {
        // setisLoading(false)
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
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterItemData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.item_name
          ? item.item_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setfilterItemData(newData);
      setSearch(text);
    } else {
      setfilterItemData(masterItemData);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    //console.log(userToken);
    return (
      <TouchableOpacity onPress={() =>
        navigation.navigate('AssetViewScreen', {
          itemid: item.item_id,
          userid: userToken
        })
      }>
      <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {item.item_image_url != '' ? <Image source={{ uri: item.item_image_url }} style={{ width: 50, height: 80, borderRadius: 10, marginRight: 20 }} /> : <Image source={require('../../../assets/images/empty.png')} style={{ width: 50, height: 80, borderRadius: 10, marginRight: 20 }} />}
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Title style={[styles.fontMedium, { fontSize: 15, marginBottom: 0, lineHeight: 20, color: 'black' }]}>{item.item_name}</Title>
              <Paragraph style={[styles.fontRegular, { fontSize: 12, lineHeight: 20, marginBottom: 0 }]}>{item.location_name}</Paragraph>
              <Text style={[ styles.fontRegular, { fontSize: 12, backgroundColor: item.status_colour, paddingLeft: 10, paddingRight: 10, color: 'white', width: 80, paddingTop: 5, paddingBottom: 5, marginTop: 5 }]}>{item?.status_id}</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8, borderTopColor: '#EEE', borderTopWidth: 1, paddingTop: 8 }}>
          <TouchableOpacity onPress={() =>
           navigation.navigate('AssetViewScreen', {
            itemid: item.item_id,
            userid: userToken
          })
          } style={{ flexDirection: 'row' }}>
            <Ionicons name="eye-outline" color='#04487b' size={16}></Ionicons><Text style={{ marginLeft: 4, color: '#04487b', fontSize: 13 }}>Visualizzazione</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>
            navigation.navigate('AssetsEditing', {
              item:item
            })
          } style={{ flexDirection: 'row', marginLeft: 13, marginRight: 13 }}>
            <Ionicons name="ios-create-outline" color='#ff8c00' size={16}></Ionicons><Text style={{ marginLeft: 0, color: '#ff8c00', fontSize: 13 }}>Modifica</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Are you want to delete")} style={{ flexDirection: 'row' }}>
            <Ionicons name="ios-trash-outline" color='#B31817' size={16}></Ionicons><Text style={{ marginLeft: 0, color: '#B31817', fontSize: 13 }}>Cancella</Text>
          </TouchableOpacity>

        </View>
      </View>
      </TouchableOpacity>
    );
  };

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


  if (isLoading == true) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const callMoreApi = () => {
    //console.log("Calling more Data..", pageNumber + 1);

    fetchAssetsList(pageNumber + 1,1);

    setPageNumber(pageNumber + 1)
  }
  const AddAssets = () => {
    navigation.navigate('AssetAddition');
  }
  const ScanAssets = () => {
    navigation.navigate('QRCodeScreen');
  }

  return (
      <>
      {isLoading?
      <ActivityIndicator size={50} color="blue"/>:null
      }
        <View style={styles.container}>
          <StatusBar backgroundColor='#04487b' hidden={false} />
          <View style={{ flex: 1, marginTop: 20 }}>
            <TextInput
              placeholder="Cerca qui..."
              style={[styles.textInputStyle, styles.fontRegular]}
              underlineColorAndroid="transparent"
              value={search}
              onChangeText={(text) => searchFilterFunction(text)}
            >
            </TextInput>
         
            <FlatList
              data={filterItemData}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ItemView}
              onEndReached={callMoreApi}
              onEndReachedThreshold={0.5}
              style={{ marginTop: 20 }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ position: 'absolute', bottom: 80, right: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity onPress={() => ScanAssets()}><Ionicons name="ios-qr-code-outline" color='#B31817' size={30}></Ionicons>
                </TouchableOpacity>
              </View>
              <View style={{ position: 'absolute', bottom: 20, alignSelf: 'flex-end' }}>
                <TouchableOpacity onPress={() => AddAssets()}><Ionicons name="add-circle-sharp" color='#B31817' size={45}></Ionicons>
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
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
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
    borderRadius: 10,
  },
  fontRegular: {
  },
  fontMedium: {
  },
  primaryColor: {
    color: '#04487b'
  }

});
export default AssetsListig;