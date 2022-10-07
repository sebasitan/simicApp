import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  VirtualizedList,
  TextInput,
  FlatList
} from 'react-native';
import {
  Title,
  Paragraph,
} from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import NoDataFound from '../../../Component/NoDataFound';

const LocationListing = ({ navigation }) => {
  const [userToken, setUserToken] = useState(null);
  const [masterItemData, setmasterItemData] = useState([]);
  const [filterItemData, setfilterItemData] = React.useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = React.useState(false);
  const [totalItems, setTotalItems] = useState();
  const [loader,setLoader]=React.useState(false);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      if(search.length > 0){
        searchFilterFunction(search);
      }else{
        fetchLocationList();
      }
    }, [isFocused]),
  );

  const fetchLocationList = async () => {
    setLoader(true);
    setmasterItemData([]);
    let userToken =await Utility.getFromLocalStorge('userToken');
    setUserToken(userToken);
    if(userToken != null){
      let formData = {
        search_key: '',
      };
      axios({
        url: `${API_BASE_URL}/locationFullList/${userToken}`,
        method: 'POST',
        data: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        if (res.data.status == 1) {
          let location_list = JSON.stringify(res.data.location_list);
          let itemjson = JSON.parse(location_list);
          setTimeout(function(){
            setmasterItemData(itemjson);
            setTotalItems(res?.data?.location_count);
            setLoader(false);
          }, 1000);
        } else {
          Alert.alert(
            "Warning",
            "Somthing went wrong, Try Again",
            [
              { text: "OK" }
            ]
          );
          setLoader(false);
        }
      }).catch(e => {
        Alert.alert(
          "Warning",
          "Somthing went wrong, Try Again",
          [
            { text: "OK" }
          ]
        );
        setLoader(false);
      });
    }
  }

  const searchFilterFunction = (text) => {
    setfilterItemData([]);
    if(text.length > 0 ){
      setIsSearch(true);
      setSearch(text);
      if (userToken != null) {
        let formData = {
          search_key: text,
        }
        axios({
          url: `${API_BASE_URL}/locationFullList/${userToken}`,
          method: 'POST',
          data: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }).then(res => {
          if (res.data.status == 1) {
            let location_list = JSON.stringify(res.data.location_list);
            let itemjson = JSON.parse(location_list);
            if(itemjson !=''){
              setfilterItemData(itemjson);
              setTotalItems(res?.data?.location_count);
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
      fetchLocationList();
    }
  };
 
  const renderItem = ({ item }) => {
    if(item != undefined){
      return (
        <TouchableOpacity>
            <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10 }} >
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'space-between' }}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Ionicons name="md-location-outline" color='#B31817' size={45}></Ionicons>
                    <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20}}>
                      <Title style={[styles.fontFamily, { fontSize: 14, width: 250, lineHeight: 20, marginBottom: 5 }]}>{item.location_name}</Title>
                      <Paragraph style={[styles.fontFamily, { fontSize: 12 }]}>{item.description}</Paragraph>
                    </View>
                  </View>
                </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8, borderTopColor: '#EEE', borderTopWidth: 1, paddingTop: 8 }}>
                <TouchableOpacity onPress={() =>
                    navigation.navigate('LocationViewing', {item: item })
                  } style={{ flexDirection: 'row' }}>
                    <Ionicons name="eye-outline" color='#04487b' size={16}></Ionicons><Text style={{ marginLeft: 4, color: '#04487b', fontSize: 13 }}>Visualizzazione</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() =>
                        navigation.navigate('LocationEditing',{item:item})
                      } style={{ flexDirection: 'row', marginLeft: 13, marginRight: 13 }}>
                    <Ionicons name="ios-create-outline" color='#ff8c00' size={16}></Ionicons>
                    <Text style={{ marginLeft: 0, color: '#ff8c00', fontSize: 13 }}>Modifica</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() =>
                        deleteLocation(item?.location_id)
                      } style={{ flexDirection: 'row' }}>
                      <Ionicons name="ios-trash-outline" color='#B31817' size={16}></Ionicons>
                      <Text style={{ marginLeft: 0, color: '#B31817', fontSize: 13 }}>Cancella</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </TouchableOpacity>
      );
    }
    
  };

  const getItem = (data, index) => {
    return data[index];
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

  const locationAddition=()=>{
    navigation.navigate('LocationAddition')
  }

  const deleteLocation = (id) => {

    let formData = {
      user_id: userToken,
      location_id : id
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
            axios({
              url: `${API_BASE_URL}locationDelete`,
              method: 'POST',
              data: formData,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            }).then(res => {
              if (res?.data?.status == 1) {
                alert("Location deleted Succesffuly");
                fetchLocationList();
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
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#04487b' hidden={false} />
      <View style={{ flex: 1, marginTop: 20 }}>
        <View style={{ alignSelf: 'flex-end'}}>
            <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#B31817', paddingBottom: 5, paddingTop: 5, paddingLeft: 5, paddingRight: 5, marginBottom: 10 }} onPress={() => 
                navigation.navigate('LocationTrash')
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
        { totalItems === 0 ? 
            <NoDataFound title={"No Data Found"} /> : 
            <>
                { loader ? 
                    <View style={styles.loading}><ActivityIndicator size={50}/></View> : 
                  <>
                    { isSearch != true ? 
                      <>
                          <VirtualizedList
                              data={masterItemData}
                              initialNumToRender={10}
                              renderItem={renderItem}
                              keyExtractor={(item, index) => index.toString()}
                              ItemSeparatorComponent={ItemSeparatorView}
                              getItemCount={(data) => totalItems}
                              getItem={getItem}
                              style={{ marginTop: 20 }}
                              refreshing={loader}
                          />
                      </> : 
                      <>
                          <FlatList
                            data={filterItemData}
                            initialNumToRender={5}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={ItemSeparatorView}
                            style={{ marginTop: 20 }}
                          />
                      </> 
                    }
                      
                  </> }
            
            </> 
        }
        <View style={{ flex: 1 }}>
          <View style={{ position: 'absolute', bottom: 20, alignSelf: 'flex-end' }}>
            <TouchableOpacity onPress={()=>locationAddition()}>
              <Ionicons name="add-circle-sharp" color='#B31817' size={45}></Ionicons>
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
    fontFamily: 'Montserrat-Regular'
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

export default LocationListing;