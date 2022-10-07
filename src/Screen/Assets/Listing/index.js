import React, { useEffect, useState, useMemo } from 'react';

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  VirtualizedList,
  FlatList
} from 'react-native';

import {
  Title,
  Paragraph,
} from 'react-native-paper';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import NoDataFound from '../../../Component/NoDataFound';

const AssetsListing = ({ navigation }) => {
  const [userToken, setUserToken] = React.useState(null);
  const [isLoading, setisLoading] = React.useState(false);
  const [masterItemData, setmasterItemData] = React.useState([]);
  const [filterItemData, setfilterItemData] = React.useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = React.useState(false);
  const [totalItems, setTotalItems] = useState();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      if(search.length > 0){
        searchFilterFunction(search);
      }else{
        fetchAssetsList();
      }
    }, [isFocused]),
  );

  const fetchAssetsList = async () => {

    setisLoading(true);

    setmasterItemData([]);

    let userToken = await Utility.getFromLocalStorge('userToken');

    setUserToken(userToken);

    if (userToken != null) {
      let formData = {
        user_id: userToken,
        search_key: '',
      }
      axios({
        url: `${API_BASE_URL}/itemlist`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        if (res.data.status == 1) {
          let item_list = JSON.stringify(res?.data?.item_list);
          let itemjson = JSON.parse(item_list);
          setTimeout(function(){
            setmasterItemData(itemjson);
            setTotalItems(res?.data?.itemcount);
            setisLoading(false);
          }, 1000);
          
        } else {
          Alert.alert(
            "Warning",
            "Somthing went wrong, Try Again",
            [
              { text: "OK" }
            ]
          );
          setisLoading(false);
        }
      }).catch(e => {
        Alert.alert(
          "Warning",
          "Somthing went wrong, Try Again",
          [
            { text: "OK" }
          ]
        );
        setisLoading(false);
      });
    }
    
  }

  const deleteAsset = (id) => {
  
    let formData = {
      user_id: userToken,
      item_id: id
    };

    Alert.alert(
      "Warning",
      "Are you sure to delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "DELETE", 
          onPress: () => {
            setisLoading(true);
            axios({
              url: `${API_BASE_URL}item_delete`,
              method: 'POST',
              data: formData,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            }).then(res => {
              //console.log(res?.data);
              if (res?.data?.status == 1) {
                alert("Item deleted Succesffuly");
                fetchAssetsList();
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
            setisLoading(false);
          }
        }
      ]
    );
  };

  const searchFilterFunction = (text) => {
    setfilterItemData([]);
    if(text.length > 0 ){
      setIsSearch(true);
      setSearch(text);
      if (userToken != null) {
        let formData = {
          user_id: userToken,
          search_key: text,
        }
        axios({
          url: `${API_BASE_URL}/itemlistsearch`,
          method: 'POST',
          data: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }).then(res => {
          if (res.data.status == 1) {
            let item_list = JSON.stringify(res.data.item_list);
            let itemjson = JSON.parse(item_list);
            if(itemjson !=''){
              setfilterItemData(itemjson);
              setTotalItems(res?.data?.itemcount);
            }else{
              setTotalItems(0);
            }

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
      }
    }else{
      setIsSearch(false);
      setSearch(text);
      fetchAssetsList();
    }
  };

  const renderItem = ({ item }) => {
    if(item != undefined){
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
                <Text style={[ styles.fontRegular, { fontSize: 12, backgroundColor: item.status_colour, paddingLeft: 10, paddingRight: 10, color: 'white', width: 100, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, marginTop: 5 }]}>{item?.status_id}</Text>
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
            <TouchableOpacity onPress={() => deleteAsset(item?.item_id)} style={{ flexDirection: 'row' }}>
              <Ionicons name="ios-trash-outline" color='#B31817' size={16}></Ionicons><Text style={{ marginLeft: 0, color: '#B31817', fontSize: 13 }}>Cancella</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableOpacity>
      );
    }
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

  const getItem = (data, index) => {
    return data[index];
  };
  
  const AddAssets = () => {
    navigation.navigate('AssetAddition');
  }
  const ScanAssets = () => {
    navigation.navigate('QRCodeScreen');
  }

  var memoizedData;

  { isSearch == true ? memoizedData = useMemo(() => renderItem, [filterItemData]) : memoizedData = useMemo(() => renderItem, [masterItemData]); }
  
  return (
    
    <View style={styles.container}>
      <StatusBar backgroundColor='#04487b' hidden={false} />
        <View style={{ flex: 1, marginTop: 20 }}>
          <View style={{ alignSelf: 'flex-end'}}>
            <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#B31817', paddingBottom: 5, paddingTop: 5, paddingLeft: 5, paddingRight: 5, marginBottom: 10 }} onPress={() => 
                navigation.navigate('AssetTrash')
              }>
              <Ionicons name="ios-trash-outline" color='#FFF' size={16}></Ionicons><Text style={{ marginLeft: 0, color: '#FFF', fontSize: 13 }}>Trash</Text>
            </TouchableOpacity>
          </View>
              <TextInput
                placeholder="Cerca qui..."
                style={[styles.textInputStyle, styles.fontRegular]}
                underlineColorAndroid="transparent"
                value={search}
                onChangeText={(text) => searchFilterFunction(text)}
              />
          { totalItems === 0 ? <NoDataFound title={"No Data Found"}/> : 
            <>
              { isLoading ? <View style={styles.loading}><ActivityIndicator size={50}/></View> : 
              <>
                { isSearch != true ? <>
                <VirtualizedList
                  data={masterItemData}
                  initialNumToRender={10}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={ItemSeparatorView}
                  getItemCount={(data) => totalItems}
                  getItem={getItem}
                  style={{ marginTop: 20 }}
                  refreshing={isLoading}
                />
              </>: <>
                <FlatList
                  data={filterItemData}
                  initialNumToRender={5}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={ItemSeparatorView}
                  style={{ marginTop: 20 }}
                />
              </>}
              </> }
              
            </> 
          }
    
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
    fontFamily: 'Montserrat-Regular'
  },
  fontMedium: {
  },
  primaryColor: {
    color: '#04487b'
  },
  mainConatiner:{
    marginTop:50,
    alignSelf:'center'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88'
  }
});
export default AssetsListing;