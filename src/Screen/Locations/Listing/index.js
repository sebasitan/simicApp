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
import ControlPanel from '../../../Navigation/ControlPanel';
import {
  Title,
  Paragraph,
} from 'react-native-paper';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../../Services/url';
import HomeHeader from '../../../Component/HomeHeader';
import NoDataFound from '../../../Component/NoDataFound';
import * as Utility from '../../../Utility/inbdex';

const LocationListingScreen = ({ navigation }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [masterItemData, setmasterItemData] = useState([]);
  const [filterItemData, setfilterItemData] = useState([]);
  const [search, setSearch] = useState('');
  const [drawerStatus, setDrawerStatus] = React.useState(false);
  const [loader,setLoader]=React.useState(false);
  const [page,setPage]=React.useState(1);
  useEffect(() => {
    (
      async () => {
        const userToken= await Utility.getFromLocalStorge('userToken');
        setUserToken(userToken);
        if (userToken != null) {
          callLocation(userToken,page);
        }
      }
    )();

  },[]);
  const openDrawer = () => {
    setDrawerStatus(!drawerStatus);
  }
  const callLocation=(userToken,page)=>{
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
        let locationjson = JSON.parse(location_list);
        setmasterItemData(locationjson);
        setfilterItemData([...filterItemData,...locationjson]);
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
  const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    main: { paddingLeft: 3 },
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


  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterItemData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.location_name
          ? item.location_name.toUpperCase()
          : ''.toUpperCase();
        //console.log(item);
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setfilterItemData(newData);
      setSearch(text);

    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setfilterItemData(masterItemData);
      setSearch(text);
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

  if (loader == true) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const locationAddition=()=>{
    navigation.navigate('LocationAddition')
  }
  const callMoreApi=()=>{
    callLocation(userToken,page+1);
    setPage(page+1);
  }
  return (
    <>
      {/* <HomeHeader title="Tutti gli oggetti" openDrawer={openDrawer} /> */}
    <View style={styles.container}>
      <StatusBar backgroundColor='#04487b' hidden={false} />
      <View style={{ flex: 1, marginTop: 20 }}>
        {filterItemData?.length>0?
        <FlatList
          data={filterItemData}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          onEndReached={callMoreApi}
          style={{ marginTop: 20 }}
        />:<NoDataFound title={"No data Found"}/>}
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