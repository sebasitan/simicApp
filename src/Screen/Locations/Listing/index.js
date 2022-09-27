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
//import ControlPanel from '../../../Navigation/ControlPanel';
import {
  Title,
  Paragraph,
} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';

const LocationListingScreen = ({ navigation }) => {
  const [userToken, setUserToken] = useState(null);
  //const [masterItemData, setmasterItemData] = useState([]);
  const [filterItemData, setfilterItemData] = useState([]);
  //const [search, setSearch] = useState('');
  const [loader,setLoader]=React.useState(false);
  const [page,setPage]=React.useState(1);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (
      async () => {
        let userToken = await Utility.getFromLocalStorge('userToken');
        setUserToken(userToken);
        if (userToken != null) {
          callLocation(userToken,page);
        }
      }
    )();

  },[isFocused]);

  const callLocation=(userToken,page)=>{
    //console.log('location page: '+ page);
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
        let itemjson = JSON.parse(location_list);
        //setmasterItemData(locationjson);
        setfilterItemData([...filterItemData, ...itemjson]);
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
 
  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity>
      <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10 }} >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'space-between' }}>
          <View style={{ alignSelf: 'flex-start', justifyContent: 'center' }}>
            <Ionicons name="md-location-outline" color='#B31817' size={45}></Ionicons>
          </View>
          <View style={{ alignSelf: 'flex-start', marginLeft: 20 }}>
            <Title style={[styles.fontFamily, { fontSize: 14, width: 250, lineHeight: 20, marginBottom: 5 }]}>{item.location_name}</Title>
            <Paragraph style={[styles.fontFamily, { fontSize: 12 }]}>{item.description}</Paragraph>
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
                      alert("delete")
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
  const callMoreApi=()=>{
    setLoader(true);
    callLocation(userToken,page+1);
    setPage(page+1);
    setLoader(false);
  }
  return (
    <>
      {/* <HomeHeader title="Tutti gli oggetti" openDrawer={openDrawer} /> */}
    <View style={styles.container}>
      <StatusBar backgroundColor='#04487b' hidden={false} />
      {loader? <ActivityIndicator size={50}/> : null }
      <View style={{ flex: 1, marginTop: 20 }}>
        <FlatList
          data={filterItemData}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          initialNumToRender={5}
          removeClippedSubviews={true}
          onEndReached={callMoreApi}
          onEndReachedThreshold={0.5}
          style={{ marginTop: 20 }}
          refreshing={refresh}
          onRefresh={callMoreApi}
        />
        <View style={{ flex: 1 }}>
          <View style={{ position: 'absolute', bottom: 20, alignSelf: 'flex-end' }}>
            <TouchableOpacity onPress={()=>locationAddition()}>
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
  }
});

export default LocationListingScreen;