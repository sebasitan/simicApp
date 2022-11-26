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
    ScrollView,
    PermissionsAndroid
} from 'react-native';

import { TextInput, Title } from "react-native-paper";

import ImagePicker from 'react-native-image-crop-picker';

import DocumentPicker from "react-native-document-picker";

import RNFetchBlob from 'rn-fetch-blob';

import axios from "axios";

import Ionicons from 'react-native-vector-icons/Ionicons';

import { API_BASE_URL } from '../../../Services/url';

import * as Utility from '../../../Utility/inbdex';

var fileImg = '../../../assets/images/file.png';

const AssetsEditing = ({ navigation, route}) => {

    const {item}= route?.params;
    const [name, setName] = useState('');
    const [stato, setStato] = useState('');
    const [description, setDrescription] = useState('');
    const [notes, setNotes] = useState('');
    const [assetImageName,setAssetImageName]=React.useState('');
    const [assetImageURL, setAssetImageURL] = useState('');
    const [assetFileName, setAssetFileName] = useState('');
    const [assetFileURL, setAssetFileURL] = React.useState('');
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
    const [userRole, setUserRole]=React.useState('');
    const [userData, setUserData]=React.useState([]);
    const [qrcode,setQrcode]=React.useState('');
    const [bookingdata, setBookingData]=React.useState([]);
    const [ reservationstatus, setReservationStatus] = React.useState(false);

    useEffect( () => {
      (
        async() => { 
          getUserInfo();
          getItemDetials()
          callParentCategory()
          getAssetsStatus()
        }
      ) ();
    },[]);

  const getUserInfo= async()=>{
    let userId = await Utility.getFromLocalStorge('userToken');
    let userdata = await Utility.getFromLocalStorge('userData');
    //console.log(userdata);
    setUserId(userId);
    setUserData(userdata);
    setUserRole(userdata?.user_role);
    callLocationApi(userId)
  }
  //console.log(userData);
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
    let formData = {
        search_key: ''
    };
    axios({
        url: `${API_BASE_URL}locationFullList/${userId}`,
        method: 'POST',
        data: formData,
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

            let itembookingdata = JSON.stringify(res?.data?.book_upcoming);
            let itembookingjson = JSON.parse(itembookingdata);
            setBookingData(itembookingjson);
            //console.log(itemchildcatlistjson);
            setName(itemdetailjson?.item_name)
            setDrescription(itemdetailjson?.description)
            setCategoryName(itemdetailjson?.parent_item_id);
            setSubCategoryName(itemdetailjson?.sub_item_id);
            setChildCategoryName(itemdetailjson?.sub_subitem_id);

            setLOactionName(itemdetailjson?.location_id);
            setAssetsName(itemdetailjson?.status_id);
            setNotes(itemchildcatlistjson?.notes);

            setAssetImageName(itemdetailjson?.item_image_name);
            setAssetImageURL(itemdetailjson?.item_image_url);
            setAssetFileName(itemdetailjson?.item_instructions_name);
            setAssetFileURL(itemdetailjson?.item_instructions_url);
        
            setQrcode(itemdetailjson?.qr_code);
            if(res?.data?.item_details?.bookingtoday > 0 ){
                setReservationStatus(true);
            }

            if(itemsubcatlistjson.length > 0 ){
                let subcateories = itemsubcatlistjson.map(key => ({ value: key.id, label: key.category_name }));
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
                setLoader(true);
                setAssetImageURL(image?.path)
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
                    alert("Image Uploaded")
                }else if(res?.data?.status==2){
                    let msg = res?.data?.message;
                    let regex = /(<([^>]+)>)/ig;
                    let fls_msg = msg.replace(regex, '');
                    alert(fls_msg);
                }else{
                    alert("Image not uploaded")
                }
                setLoader(false);
            }).catch(e => {
                Alert.alert(
                    "File not uploaded",
                    "Server might be busy, please upload the file again!",
                    [
                        { text: "OK" }
                    ]
                );
                setLoader(true);
            });
        });
    }

    const instructionAssets = async () => {
        try {
            const res = await DocumentPicker.pick({
              // Provide which type of file you want user to pick
              type: [DocumentPicker.types.allFiles],
              // There can me more options as well
              // DocumentPicker.types.allFiles
              // DocumentPicker.types.images
              // DocumentPicker.types.plainText
              // DocumentPicker.types.audio
              // DocumentPicker.types.pdf
            });
    
            if(res.length > 0 ){
                setLoader(true);
                let formData = new FormData();
                let filedata = JSON.parse(JSON.stringify(res))[0];
                formData.append('item_image', { type: filedata.type, uri: filedata.uri, name: filedata.name.split("/").pop() });
                axios({
                    url: `${API_BASE_URL}item_image`,
                    method: 'POST',
                    data:formData,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => {
                    //console.log(" assets location on Edit page.", res?.data)
                    if(response?.data?.status==1){
                        setAssetFileName(response?.data?.picture)
                        alert("File Uploaded");
                    }else if(response?.data?.status==2){
                        let msg = response?.data?.message;
                        let regex = /(<([^>]+)>)/ig;
                        let fls_msg = msg.replace(regex, '');
                        alert(fls_msg);
                    }else{
                        alert("File Not Uploaded")
                    }
                    setLoader(false);
                }).catch(e => {
                    setLoader(false);
                    Alert.alert(
                        "File not uploaded",
                        "Server might be busy, please upload the file again!",
                        [
                            { text: "OK" }
                        ]
                    );
                });
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              alert('Canceled');
            } else {
              alert('Unknown Error: ' + JSON.stringify(err));
              throw err;
            }
        }
    };

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
            documents:assetFileName,
            qr_code:qrcode,
            notes: notes != undefined ? notes : ''
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
                  alert("Asset Updated successfully")
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
    };

    const downloadDocument = async(id) => {

        if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'Storage Permission Required',
                  message: 'Application needs access to your storage to download File',
                }
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // Start downloading
                downloadFile(id);
                //console.log('Storage Permission Granted.');
              } else {
                // If permission denied then show alert
                Alert.alert('Error','Storage Permission Not Granted');
              }
            } catch (err) {
              // To handle permission related exception
              Alert.alert('Error','Something went wrong. please try again.');
            }
        }
        
    }

    const downloadFile = (id) => {
        let date = new Date();
        if(id == 2 ){
            var FILE_URL = assetFileURL;
        }else{
            var FILE_URL = assetImageURL;
        }
        //console.log(FILE_URL);
        if(FILE_URL !=''){
          let file_ext = getFileExtention(FILE_URL);
          file_ext = '.' + file_ext[0];
        const { config, fs } = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            path: RootDir+'/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
            description: 'downloading file...',
            notification: true,
            useDownloadManager: true,   
          },
        };
        config(options)
          .fetch('GET', FILE_URL)
          .then(res => {
            // Alert after successful downloading
            //console.log('res -> ', JSON.stringify(res));
            alert('File Downloaded Successfully.');
          });
        }else{
          Alert.alert('Error','Something went wrong. please try again.');
        }
    
    };
    
    const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
    };
    //console.log(userRole);
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {loader ? <View style={styles.loading}><ActivityIndicator size={50}></ActivityIndicator></View> : null }
                
                { userRole == 3 ? null : <>
                    <View style={styles.inputConatiner}>
                        <TextInput
                             label='Nome articolo' 
                             placeholder='Nome articolo' 
                             style={{ width: '88%', alignSelf: 'center' }}
                             placeholderTextColor="black"
                             pointerEvents="none"
                             mode="outlined"
                             theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
                            onChangeText={newText => setName(newText)}
                            value={name}
                        />
                    </View>
                    
                </> }
                
                {userRole == 3 ? null : <>
                    <View style={styles.inputConatiner}>
                        <TextInput
                            label='Descrizione' 
                            placeholder='Descrizione' 
                            style={{ width: '88%', alignSelf: 'center' }}
                            placeholderTextColor="black"
                            pointerEvents="none"
                            mode="outlined"
                            theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
                            onChangeText={newText => setDrescription(newText)}
                            value={description}
                        />
                    </View>
                </> }
                
                { userRole == 3 ? null : <>
                    <View style={styles.dropDownConatiner}>
                        <Text>Categorie</Text>
                        <Dropdown
                            style={{ marginLeft: 10 }}
                            placeholderStyle={{ color: 'black' }}
                            selectedTextStyle={{ color: 'black' }}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={categoryList}
                            maxHeight={400}
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
                </> }
                
                { userRole == 3 ? null : <>
                    <View style={styles.dropDownConatiner}>
                        <Text>Sotto categoria</Text>
                        <Dropdown
                            style={{ marginLeft: 10 }}
                            placeholderStyle={{ color: 'black' }}
                            selectedTextStyle={{ color: 'black' }}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={subCategoriesList}
                            maxHeight={400}
                            value={subCategoryName}
                            search
                            labelField="label"
                            valueField="value"
                            placeholder="Sottocategoria"
                            searchPlaceholder="Search..."
                            onChange={item => {
                                callChildCategoryApi(item?.value);
                                setSubCategoryName(item?.value);
                                setStato(item)
                            }}
                        />
                    </View>
                </> }

                { userRole == 3 ? null : <>
                    <View style={styles.dropDownConatiner}>
                        <Text>Terza categoria</Text>
                        <Dropdown
                            style={{ marginLeft: 10 }}
                            placeholderStyle={{ color: 'black' }}
                            selectedTextStyle={{ color: 'black' }}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={childCategoriesList}
                            value={childCategoryName}
                            maxHeight={400}
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
                    
                </> }

                <View style={styles.dropDownConatiner}>
                    <Text>Asset Status</Text>
                    <Dropdown
                        style={{ backgroundColor: ( reservationstatus === true ) ? '#DDD' : '#F5FCFF88'}}
                        placeholderStyle={{ color: 'black' }}
                        selectedTextStyle={{ color: 'black' }}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={assestsStatusList}
                        maxHeight={400}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Asset Status"
                        searchPlaceholder="Search..."
                        value={assetsName}
                        disable={reservationstatus}
                        onChange={item => {
                            setStato(item);
                            setAssetsName(item?.value);
                        }}
                    />
                </View>
                { bookingdata.length > 0 ? <>
                    <TouchableOpacity onPress={() => navigation.navigate('AssetUpcomingDates', { item:bookingdata} ) } style={{  backgroundColor: '#c568d5', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 10, marginTop: 10, flex: 1, flexDirection: 'row', marginLeft: 25, marginRight: 25, marginBottom: 0 }}>
                        <Ionicons name="calendar-sharp" color='#FFFFFF' size={20}></Ionicons>
                        <Text style={{ marginLeft: 5, color: '#FFFFFF', fontSize: 13 }}>Controlla Prenotazioni</Text>
                    </TouchableOpacity>
                </> : null }
                <View style={styles.dropDownConatiner}>
                    <Text>Posizione</Text>
                    <Dropdown
                        style={{ marginLeft: 10 }}
                        placeholderStyle={{ color: 'black' }}
                        selectedTextStyle={{ color: 'black' }}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={locationList}
                        maxHeight={400}
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
                        label='Notes' 
                        placeholder='Notes' 
                        style={{ width: '88%', alignSelf: 'center', height: 80 }}
                        placeholderTextColor="black"
                        pointerEvents="none"
                        mode="outlined"
                        theme={{ colors: { primary: '#04487b', underlineColor: 'yellow', accent: '#99e8e4' } }}
                        value={notes}
                        onChangeText={newText => setNotes(newText)}
                    />
                </View>

                {userRole == 3 ? null : <>
                    <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                        <TouchableOpacity style={{ marginLeft: 20, marginTop: 10, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderRadius: 5, paddingTop: 20, paddingBottom: 20, paddingLeft: 10, paddingRight: 10, borderColor: '#DDD' }} onPress={()=>assestImage()}>
                            <Text>Immagine</Text>
                            <Ionicons name="camera" color='#04487b' size={28}></Ionicons>
                            <Text style={{ fontSize: 12, color:'red'}}>JPG, PNG: 5MB</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 20, marginTop: 10, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderRadius: 5, paddingTop: 20, paddingBottom: 20, paddingLeft: 10, paddingRight: 10, borderColor: '#DDD' }} onPress={()=>instructionAssets()}>
                            <Text>Istruzioni</Text>
                            <Ionicons name="document-text" color='#04487b' size={28}></Ionicons>
                            <Text style={{ fontSize: 12, color:'red'}}>PDF, DOCX, XLS: 5MB</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-evenly', marginBottom: 20 }}>
                        { assetImageURL ? <>
                            <TouchableOpacity style={{ marginLeft: 20, alignItems: 'center'}} onPress={()=>downloadDocument(1)}>
                            <Text style={{ color: '#04487b'}}>{ assetImageName }</Text>
                            </TouchableOpacity>
                        </> : null }
                        { assetFileURL ? <>
                            <TouchableOpacity style={{ marginLeft: 20, alignItems: 'center'}} onPress={()=>downloadDocument(2)}>
                            <Text style={{ color: '#04487b'}}>{ assetFileName }</Text>
                        </TouchableOpacity>
                        </> : null }
                        
                    </View>
                </> }
                
                <View style={{ alignSelf:'center', width:'60%', marginTop: 10,marginBottom:20 }}>
                    <Button title='Save' onPress={assetsEdit} color="#04487b"/>
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
    inputConatiner: { 
        marginTop:10,
        marginBottom: 5,
    },
    dropDownConatiner:{
        borderWidth:1,
        marginHorizontal:25,
        marginTop:20,
        borderRadius:5,
        padding:5,
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
        backgroundColor: '#F5FCFF88',
        zIndex: 1
    }
});
export default AssetsEditing;