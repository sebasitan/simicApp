import React, { useState, useEffect } from 'react';
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
  const [totalItems, setTotalItems] = useState();
  const [loader,setLoader]=React.useState(false);
  const [page,setPage]=React.useState(1);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      fetchLocationList(1,2);
    }, [isFocused]),
  );

  const fetchLocationList = async (page, type) => {
    setLoader(true);
    if( type === 2){
        setmasterItemData([]);
        setPage(1);
    }
    let userToken =await Utility.getFromLocalStorge('userToken');
    setUserToken(userToken);
    if(userToken != null){
      axios({
        url: `${API_BASE_URL}/locationList/${userToken}?page=${page}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        if (res.data.status == 1) {
          let location_list = JSON.stringify(res.data.location_list);
          //console.log(res.data);
          let itemjson = JSON.parse(location_list);
          if( type === 2){
            setmasterItemData(itemjson);
          }else{
            setmasterItemData([...masterItemData, ...itemjson]);
          }
          setTotalItems(res?.data?.location_count);
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
    setLoader(false);
  }
 
  const ItemView = ({ item }) => {
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

  const callMoreItem = () => {
    if(totalItems > 0 ){
      let totalpage = Math.ceil(totalItems / 10);
      let currentpage;
      if( page <= totalpage ){
        currentpage = page + 1;
        fetchLocationList(currentpage,1);
        setPage(currentpage);
      }
    }else{
      fetchLocationList(1,2);
      setPage(1);
    }
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
                fetchLocationList(1,2);
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
        { totalItems === 0 ? 
            <NoDataFound title={"No Data Found"} /> : 
            <>
          <FlatList
            data={masterItemData}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            initialNumToRender={5}
            removeClippedSubviews={true}
            onEndReached={callMoreItem}
            onEndReachedThreshold={0.5}
            style={{ marginTop: 20 }}
            refreshing={loader}
            onRefresh={callMoreItem}
          />
        </> }
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
});

export default LocationListing;