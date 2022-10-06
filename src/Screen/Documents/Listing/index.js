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
  VirtualizedList
} from 'react-native';
import {
  Paragraph,
} from 'react-native-paper';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import NoDataFound from '../../../Component/NoDataFound';

const DocumentListing = ({ navigation }) => {
  const [userToken, setUserToken] = useState(null);
  const [masterItemData, setmasterItemData] = useState([]);
  const [loader, setLoader] = React.useState(false);
  const [page,setPage]=React.useState(1);
  const [totalItems, setTotalItems] = useState();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      getDocumentListingData();
    }, [isFocused]),
  );

  const getDocumentListingData = async () => {
    setLoader(true);
    setmasterItemData([]);
    let userToken = await Utility.getFromLocalStorge('userToken');
    setUserToken(userToken);
    if(userToken != null){
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
          setTimeout(function(){
            setmasterItemData(itemjson);
            setTotalItems(res?.data?.document_count);
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

  const goToDocumentEdit = (item) => {
    //console.log("item is>>>..", item)
    navigation.navigate('DocumentEditing', { itemId: item })
  }
  const goToDocumentView = (item) => {
    navigation.navigate('DocumentView', { itemId: item })
  }
  const deleteDocument = (id) => {
    let formData = {
      user_id: userToken,
      document_id: id
    }
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
              url: `${API_BASE_URL}deleteDocument`,
              method: 'POST',
              data: formData,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            }).then(res => {
              if (res?.data?.status == 1) {
                alert("Document deleted Succesffuly");
                getDocumentListingData();
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
    
  }

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const getFileURL = () => {
    let imgsrc = '../../../assets/images/file.png';
    return imgsrc;
  };
  
  var imgsrc;
  
  const renderItem = ({ item }) => {
    if( item != undefined){
      let documentfile = item.documents;
      if( documentfile !='' ){
        let file_ext = getFileExtention(item?.documents);
        if( file_ext =='jpg' || file_ext =='png' || file_ext =='jpeg' || file_ext =='webp' || file_ext =='gif'){
          imgsrc = <Image source={{ uri: item.documents }} style={{ width: 70, height: 100, marginRight: 15 }} />;
        }else{
          imgsrc = <Image source={require('../../../assets/images/file.png')} style={{ width: 80, height: 100, marginRight: 15 }} />;
        }
      }else{
        imgsrc = <Image source={require('../../../assets/images/file.png')} style={{ width: 80, height: 100, marginRight: 15 }} />;
      }
      return (
         <TouchableOpacity>
          <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'space-between' }}>
              <View style={{ alignSelf: 'flex-start', justifyContent: 'center' }}>
                {imgsrc}
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
              <TouchableOpacity onPress={() => deleteDocument(item?.id)} style={{ flexDirection: 'row' }}>
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
      <View
        style={{
          height: 10,
          width: '100%',
          backgroundColor: 'transparent',
        }}
      />
    );
  };

  const documentAddition = () => {
    navigation.navigate('DocumentAddition')
  }
  
  const getItem = (data, index) => {
    return data[index];
  };

  return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#04487b' hidden={false} />
        <View style={{ flex: 1, marginTop: 20 }}>
          <View style={{ alignSelf: 'flex-end'}}>
              <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#B31817', paddingBottom: 5, paddingTop: 5, paddingLeft: 5, paddingRight: 5, marginBottom: 0 }} onPress={() => 
                  navigation.navigate('DocumentTrash')
                }>
                <Ionicons name="ios-trash-outline" color='#FFF' size={16}></Ionicons><Text style={{ marginLeft: 0, color: '#FFF', fontSize: 13 }}>Trash</Text>
              </TouchableOpacity>
            </View>
        { totalItems === 0 ? 
            <NoDataFound title={"No Data Found"}/> : 
            <>

              { loader ? 
                  <View style={styles.loading}><ActivityIndicator size={50}/></View> : 
                  <> 
                      <VirtualizedList
                        data={masterItemData}
                        renderItem={renderItem}
                        initialNumToRender={10}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={ItemSeparatorView}
                        getItemCount={(data) => totalItems}
                        getItem={getItem}
                        //removeClippedSubviews={true}
                        style={{ marginTop: 20 }}
                        refreshing={loader}
                      />
                  </> 
              }
              
            </>
        }
          <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', bottom: 20, alignSelf: 'flex-end' }}>
              <TouchableOpacity onPress={() => documentAddition()}>
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
    fontFamily : 'Montserrat-Regular'
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

export default DocumentListing;