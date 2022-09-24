import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';

import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from "axios";

import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';

const AssetsEditing = ({ navigation ,route}) => {
  const {item}= route?.params;
  //console.log("item is.././.",item)
    const [name, setName] = useState('');
    //const [DataDate, setDataDate] = useState('');
    const [stato, setStato] = useState('');
    const [description, setDrescription] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState('');
    //const [StatoList, setStatoList] = useState([]);
    const [instructionImage,setInstructionImage]=useState('');
    const [loader,setLoader]=useState(false);
    const [categoryName,setCategoryName]=React.useState('');
    const [subCategoryName,setSubCategoryName]=React.useState('');
    const [childCategoryName,setChildCategoryName]=React.useState('');
    const [assetsName,setAssetsName]=React.useState('');
    const [locationName,setLOactionName]=React.useState();
    const [locationList,setLocationList]=React.useState([]);
    const [categoryList,setCategoryList]=React.useState([]);
    const [subCategoriesList,setSubCategoriesList]=React.useState([]);
    const [childCategoriesList,setChildCategoriesList]=React.useState([]);
    const [assestsStatusList,setAssestsStatusList]=React.useState([]);
    const [userId,setUserId]=React.useState('');
    const [qrcode,setQrcode]=React.useState('');
    const [assetImageName,setAssetImageName]=React.useState('');
    const [instructionImageName,setInstructionImagesName]=React.useState('');
    useEffect( () => {
      (
        async() => { 
          getUserInfo();
          getItemDetials()
        //   callLocationApi()
          callParentCategory()
          getAssetsStatus()
        }
      ) ();
  },[]);
  const getUserInfo= async()=>{
    let userId = await Utility.getFromLocalStorge('userToken');
    setUserId(userId);
    callLocationApi(userId)
  }
  const callParentCategory=async()=>{
    axios({
        url: `${API_BASE_URL}get_cat_list`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => {
      var prevCategoryList = res?.data?.get_cat_list.map(car => ({ value: car?.id, label: car?.category_name }));
        setCategoryList(prevCategoryList)
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
  const callLocationApi=async(userId)=>{
    axios({
        url: `${API_BASE_URL}locationFullList/${userId}`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => {
      //console.log(" assets location on Edit page.",res?.data?.location_list)
      var prevCatList = res?.data?.location_list.map(car => ({ value: car?.location_id, label: car?.location_name }));
      //console.log(prevCatList);
      setLocationList(prevCatList)
      if(res.data.status == 1){
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
  const getItemDetials= async()=>{
    let userToken =await Utility.getFromLocalStorge('userToken');
    setLoader(true)
      let formData = {
          user_id :userToken,
          item_id : item?.item_id,
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
      //console.log("vikas view page.. on edit mode",res?.data)
        if(res.data.status == 1){
          let itemdetail = JSON.stringify(res?.data?.item_details);
          let itemdetailjson = JSON.parse(itemdetail);
        //console.log(itemdetailjson);
          let itemsubcatdata = JSON.stringify(res?.data?.subcat);
          let itemsubcatlistjson = JSON.parse(itemsubcatdata);
          let itemchildcatdata = JSON.stringify(res?.data?.subsubcat);
          let itemchildcatlistjson = JSON.parse(itemchildcatdata);
          //console.log(itemchildcatlistjson);
          setName(itemdetailjson?.item_name)
          setDrescription(itemdetailjson?.description)
          setImage(itemdetailjson?.item_image_url)
        //   setAssetImageName()
          setCategoryName(itemdetailjson?.parent_item_id);
          setSubCategoryName(itemdetailjson?.sub_item_id);
          setChildCategoryName(itemdetailjson?.sub_subitem_id);

          //callSubCategoryApi(itemdetailjson?.sub_item_id);
          setLOactionName(itemdetailjson?.location_id);
          setAssetsName(itemdetailjson?.status_id);
          setNotes(itemchildcatlistjson?.notes);
          setAssetImageName(itemdetailjson?.item_image_name);
          setInstructionImagesName(itemdetailjson?.item_instructions_name)
          setQrcode(itemdetailjson?.qr_code);
          setInstructionImage(itemdetailjson?.item_instructions_url)

          if(itemsubcatlistjson.length > 0 ){
            //console.log(itemsubcatlistjson);
            let subcateories = itemsubcatlistjson.map(key => ({ value: key.id, label: key.category_name }));
            //console.log(subcateories);
            setSubCategoriesList(subcateories);
          }

          if(itemchildcatlistjson.length > 0 ){
            let childcateories = itemchildcatlistjson.map(key => ({ value: key.id, label: key.category_name }));
            setChildCategoriesList(childcateories);
          }
          
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
    const assestImage=()=>{
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
          }).then(image => {
            //console.log(image);
             setImage(image?.path)
            const formData = new FormData();
            formData.append('item_image', { type: image.mime, uri: image.path, name: image.path.split("/").pop() });
            axios({
                url: `${API_BASE_URL}item_image`,
                method: 'POST',
                data:formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                //console.log(" assets location on Edit page.", res?.data)
                if(res?.data?.status==1){
                    setAssetImageName(res?.data?.picture)
                    alert("Instruction Image Added successfully")
                }else{
                    alert("Your Instruction image not uploaded")
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
          });
    }
    const instructionAssets=()=>{
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
          }).then(image => {
            setInstructionImage(image?.path)
            const formData = new FormData();
            formData.append('item_image', { type: image.mime, uri: image.path, name: image.path.split("/").pop() });
            axios({
                url: `${API_BASE_URL}item_image`,
                method: 'POST',
                data:formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                //console.log(" assets location on Edit page.", res?.data)
                if(res?.data?.status==1){
                    setInstructionImagesName(res?.data?.picture)
                    alert("Instruction Image Added successfully")
                }else{
                    alert("Your Instruction image not uploaded")
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
          });
    }
   
    const assetsEdit=()=>{
        setLoader(true);
        let formData = {
            user_id:userId,
            item_id:item?.item_id,
            item_name:name,
            description:description,
            parent_item:categoryName,
            sub_item:subCategoryName,
            childsub_item : childCategoryName,
            location_id:locationName,
            status_id:assetsName,
            item_image_name:assetImageName,
            documents:instructionImageName,
            qr_code:qrcode,
            notes: notes
        };
        //console.log(formData);
        if(name === '' || categoryName === '' || subCategoryName === '' || assetsName === '' ){
            Alert.alert(
                "Warning",
                "Name, Categories and Status must be filled",
                [
                    { text: "OK" }
                ],
                { cancelable: true }
            );
            setLoader(false);
            //console.log();
        }else{
            axios({
                url: `${API_BASE_URL}itemEdit`,
                method: 'POST',
                data: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
              //console.log("vikas asset_booking page..",res)
              setLoader(false)
              //console.log("vikas asset_booking page..",res)
              if(res.data.status == 1){
                  alert("Assert Edit successfully")
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
    }
    const openLocalDatePkr = () => {
        setIsReportingdate(true)
        setIsReturndate(false)
        setDateOpen(true)
    };
    const callSubCategoryApi=(id)=>{
        // alert("sub category call");
        let formData = {
            main_cat_id :id,
        }
        axios({
            url: `${API_BASE_URL}get_sub_cat`,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log("sub category item is. vv..",res)
            let prevCategoryList = res?.data?.get_sub_cat.map(car => ({ value: car?.id, label: car?.category_name }));
            //console.log(prevCategoryList);
            setSubCategoryName('');
            setChildCategoryName('');
            setSubCategoriesList(prevCategoryList || []);
            setChildCategoriesList([]);
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

    const callChildCategoryApi=(id)=>{
        // alert("sub category call");
        let formData = {
            main_cat_id :id,
        }
        axios({
            url: `${API_BASE_URL}get_sub_cat`,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log("sub category item is. vv..",res)
            let prevCategoryList = res?.data?.get_sub_cat.map(car => ({ value: car?.id, label: car?.category_name }));
            //console.log(prevCategoryList);
            setChildCategoryName('');
            setChildCategoriesList(prevCategoryList || []);
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

    const getAssetsStatus = () => {
        axios({
            url: `${API_BASE_URL}itemStatus`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log(" assets status on Edit page.", res?.data?.item_status_list)
            let prevCatList = res?.data?.item_status_list.map(car => ({ value: car?.status_id, label: car?.status_name }));
            setAssestsStatusList(prevCatList)
            // setCategoryList(prevCategoryList)
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
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
              {loader?
              <ActivityIndicator size={50}/>:null}
                <View style={styles.inputConatiner}>
                    <TextInput
                        style={{ height: 40, marginLeft: 10 }}
                        placeholder="Nome articolo"
                        value={name}
                        placeholderTextColor="black"
                        onChangeText={newText => setName(newText)}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <TextInput
                        style={{ height: 40, marginLeft: 10 }}
                        placeholder="Descrizione"
                        value={description}
                        placeholderTextColor="black"
                        onChangeText={newText => setDrescription(newText)}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <Dropdown
                        style={{ marginLeft: 10 }}
                        placeholderStyle={{ color: 'black' }}
                        selectedTextStyle={{ color: 'black' }}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={categoryList}
                        maxHeight={200}
                        value={categoryName}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Categorie"
                        searchPlaceholder="Search..."
                        onChange={item => {
                            callSubCategoryApi(item?.value);
                            setCategoryName(item?.value);
                            setStato(item)
                        }}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <Dropdown
                        style={{ marginLeft: 10 }}
                        placeholderStyle={{ color: 'black' }}
                        selectedTextStyle={{ color: 'black' }}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={subCategoriesList}
                        maxHeight={200}
                        value={subCategoryName}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Categorie"
                        searchPlaceholder="Search..."
                        onChange={item => {
                            callChildCategoryApi(item?.value);
                            setSubCategoryName(item?.value);
                            setStato(item)
                        }}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <Dropdown
                        style={{ marginLeft: 10 }}
                        placeholderStyle={{ color: 'black' }}
                        selectedTextStyle={{ color: 'black' }}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={childCategoriesList}
                        value={childCategoryName}
                        maxHeight={200}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Terza categoria"
                        searchPlaceholder="Search..."
                        onChange={item => {
                            setChildCategoryName(item?.value);
                            setStato(item)
                        }}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <Dropdown
                        style={{ marginLeft: 10 }}
                        placeholderStyle={{ color: 'black' }}
                        selectedTextStyle={{ color: 'black' }}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={assestsStatusList}
                        maxHeight={200}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Asset Status"
                        searchPlaceholder="Search..."
                        value={assetsName}
                        onChange={item => {
                            setStato(item);
                        }}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <Dropdown
                        style={{ marginLeft: 10 }}
                        placeholderStyle={{ color: 'black' }}
                        selectedTextStyle={{ color: 'black' }}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={locationList}
                        maxHeight={200}
                        search
                        value={locationName}
                        labelField="label"
                        valueField="value"
                        placeholder="Posizione"
                        searchPlaceholder="Search..."
                        onChange={item => {
                            setStato(item);
                            setLOactionName(item?.value);
                        }}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <TextInput
                        style={{ height: 80, marginLeft: 10 }}
                        // numberOfLines="5"
                        placeholder="Notes"
                        value={notes}
                        placeholderTextColor="black"
                        onChangeText={newText => setNotes(newText)}
                    />
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{ marginLeft: 20, marginTop: 10,alignItems:'center' }}>
                    <Text>Immagine</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={ image ? { uri:image } : null } style={{height:70,width:100,borderRadius:10}}/>
                    <TouchableOpacity onPress={()=>assestImage()}>
                        <Ionicons name="camera" color='#04487b' size={16}></Ionicons>
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginLeft: 20, marginTop: 10,alignItems:'center'}}>
                    <Text>Istruzioni</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    
                    <Image source={ instructionImage ? { uri:instructionImage } : null } style={{height:70,width:100,borderRadius:10}}/>
                    <TouchableOpacity onPress={()=>instructionAssets()}>
                        <Ionicons name="camera" color='#04487b' size={16}></Ionicons>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
                <View style={{ alignSelf: 'center', width: '60%',marginTop:10,marginBottom:20 }}>
                    <Button title='Save' onPress={assetsEdit} color="#04487b" />
                </View>
            </ScrollView>
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
    inputConatiner: { borderWidth: 1, alignSelf: 'center', width: '90%', margin: 10, borderRadius: 5,padding:5 },
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
        fontFamily: 'Poppins-Regular'
    }
});
export default AssetsEditing;