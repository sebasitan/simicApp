import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Alert,
    ActivityIndicator,
    Image,
    VirtualizedList,
    Title,
    TouchableOpacity,
    TextInput,
    FlatList
} from 'react-native';

import {
    Paragraph,
} from 'react-native-paper';

import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import NoDataFound from '../../../Component/NoDataFound';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const AssetTrash = ({ navigation }) => {
    const [userToken, setUserToken] = React.useState(null);
    const [loader, setLoader] = React.useState(false);
    const [masterItemData, setmasterItemData] = React.useState([]);
    const [filterItemData, setfilterItemData] = React.useState([]);
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = React.useState(false);
    const [totalItems, setTotalItems] = React.useState();
    const isFocused = useIsFocused();

   useFocusEffect(
        React.useCallback(() => {
            if(search.length > 0){
                searchFilterFunction(search);
            }else{
                getTrashList();
            }
        }, [isFocused]),
    );

    const getTrashList = async () => {
        
        setLoader(true);
        setmasterItemData([]);
        
        let userToken = await Utility.getFromLocalStorge('userToken');
        setUserToken(userToken);
        
        if(userToken != null){
            let formData = {
                user_id: userToken,
                search_key: '',
            }
            
            axios({
                url: `${API_BASE_URL}/itemtrashlist`,
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
                        setTotalItems(res?.data?.item_count);
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
    };

    const searchFilterFunction = (text) => {
        setmasterItemData([]);
        setfilterItemData([]);
        //setPageNumber(1);
        if(text.length > 0 ){
          setIsSearch(true);
          setSearch(text);
          if (userToken != null) {
            let formData = {
              user_id: userToken,
              search_key: text,
            }
            axios({
              url: `${API_BASE_URL}/itemtrashlist`,
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
                  setTotalItems(res?.data?.item_count);
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
          getTrashList();
        }
    };

    const restoreAsset = (id) => {
        let formData = {
            user_id: userToken,
            item_id: id
        };
      
        Alert.alert(
            "Warning",
            "Are you sure to restore item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Restore it", 
                    onPress: () => {
                        setLoader(true);
                        axios({
                            url: `${API_BASE_URL}item_restore`,
                            method: 'POST',
                            data: formData,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'multipart/form-data',
                            },
                        }).then(res => {
                            //console.log(res?.data);
                            if (res?.data?.status == 1) {
                                alert("Item Restored Succesffuly");
                                setSearch('');
                                setIsSearch(false);
                                navigation.navigate('DrawerNavigation');
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
                        setLoader(false);
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {

        if(item != undefined){
            return(
                <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {item.item_image_url != '' ? <Image source={{ uri: item.item_image_url }} style={{ width: 50, height: 80, borderRadius: 10, marginRight: 20 }} /> : <Image source={require('../../../assets/images/empty.png')} style={{ width: 50, height: 80, borderRadius: 10, marginRight: 20 }} />}
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={[styles.fontRegular, { fontSize: 15, marginBottom: 0, lineHeight: 20, color: 'black' }]}>{item.item_name}</Text>
                                <Paragraph style={[styles.fontRegular, { fontSize: 12, lineHeight: 20, marginBottom: 0 }]}>{item.location_name}</Paragraph>
                                <Text style={[ styles.fontRegular, { fontSize: 12, backgroundColor: item.status_colour, paddingLeft: 10, paddingRight: 10, color: 'white', width: 100, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, marginTop: 5 }]}>{item?.status_id}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8, borderTopColor: '#EEE', borderTopWidth: 1, paddingTop: 8 }}>
                        <TouchableOpacity style={{ flexDirection: 'row'}} onPress={() => restoreAsset(item?.item_id)}>
                            <Ionicons name="refresh" color='#B31817' size={16}></Ionicons><Text style={{ marginLeft: 4, color: '#B31817', fontSize: 13 }}>Restore</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
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

    const getItem = (data, index) => {
        return data[index];
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#04487b' hidden={false} />
            <View style={{ flex: 1, marginTop: 20 }}>
            <TextInput
                placeholder="Cerca qui..."
                style={[styles.textInputStyle, styles.fontRegular]}
                underlineColorAndroid="transparent"
                value={search}
                onChangeText={(text) => searchFilterFunction(text)}
              />
            { totalItems === 0 ? <NoDataFound title={"No Data Found"} /> : 
                <>
                    { loader ? <View style={styles.loading}><ActivityIndicator size={50} /></View> : 
                        <>
                            { 
                            isSearch != true ? 
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
                            
                        </> 
                    }
                </> 
            }
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
    inputConatiner: { borderWidth: 1, alignSelf: 'center', width: '90%', margin: 10, borderRadius: 5, padding: 5 },
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
    fontFamily: {
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
export default AssetTrash;