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
    ScrollView,
    FlatList,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from "axios";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../../Services/url';
import * as Utility from '../../../Utility/inbdex';
import DocumentPicker from 'react-native-document-picker';

const AssetAddition = ({ navigation }) => {
    const [name, setName] = useState('');
    //const [DataDate, setDataDate] = useState();
    const [stato, setStato] = useState();
    const [description, setDrescription] = useState('');
    const [categoryId, setCategoryId]=React.useState('');
    const [subCategoryId,setSubCategoryId]=React.useState('');
    const [locationId,setLocationId]=React.useState('');
    const [assetStatusId,setAssetStatusId]=React.useState('');
    const [tezaCategoryId,setTezaCategoryId]=React.useState('');
    const [imageName,setImageName]=React.useState('');
    const [instructionImageName,setInstructionImageName]=React.useState('');
    const [image, setImage] = useState('');
    const [userId, setUserId] = React.useState('');
    const [qrCode, setQrcode] = React.useState('');
    const [notes, setNotes] = useState('');
    const [loader, setLoader] = React.useState(false);
    const [locationList, setLocationList] = React.useState([]);
    const [categoryList, setCategoryList] = React.useState([]);
    const [subCategoriesList, setSubCategoriesList] = React.useState([]);
    const [childsubCategoriesList, setChildSubCategoriesList] = React.useState([]);
    const [assestsStatusList,setAssestsStatusList]=React.useState([]);

    useEffect(() => {
        getUserInfor()
        // getAllLocation();
        getCategories();
        getAssetsStatus();
        getQRCode()
    }, []);
    const getQRCode = async () => {
        axios({
            url: `${API_BASE_URL}generateQRcode`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
           //console.log("Qr Code is...",res?.data)
           setQrcode(res?.data?.qr_code)
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
    const getAllLocation = async (userId) => {
        let formData = {
            user_id: userId || 1,
        }
        //console.log("Location user id>>>",userId)
        axios({
            url: `${API_BASE_URL}locationFullList/${userId}`,
            method: 'POST',
            data:formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log(" assets location on Edit page.", res?.data?.location_list)
            var prevCatList = res?.data?.location_list.map(car => ({ value: car?.location_id, label: car?.location_name }));
            setLocationList(prevCatList)
            if (res.data.status == 1) {
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
    const getCategories = async () => {
        axios({
            url: `${API_BASE_URL}get_cat_list`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log(" assets Catergory on Edit page.", res?.data?.get_cat_list)
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
    const getSubCategory = async (id) => {
        let formData = {
            main_cat_id: id,
        }
        //console.log("aessets addition form...", formData)
        axios({
            url: `${API_BASE_URL}get_sub_cat`,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log("sub category item is...", res?.data)
            var prevCategoryList = res?.data?.get_sub_cat.map(car => ({ value: car?.id, label: car?.category_name }));
            setSubCategoriesList(prevCategoryList || [])
            // setCategoryList(res?.data);
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

    const getChildSubCategory = async (id) => {
        let formData = {
            main_cat_id: id,
        }
        //console.log("aessets addition form...", formData)
        axios({
            url: `${API_BASE_URL}get_sub_cat`,
            method: 'POST',
            data: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            //console.log("sub category item is...", res?.data)
            var prevCategoryList = res?.data?.get_sub_cat.map(car => ({ value: car?.id, label: car?.category_name }));
            setChildSubCategoriesList(prevCategoryList || [])
            // setCategoryList(res?.data);
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

    const getUserInfor = async () => {
        let userId = await Utility.getFromLocalStorge('userToken');
        setUserId(userId);
        getAllLocation(userId)

    }

    const assestImage = () => {
        setLoader(true);
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            //console.log("Addition image is..>>",image?.path);
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
                    setImageName(res?.data?.picture)
                    alert("Assets Image Added successfully")
                }else{
                    alert("Your asset image not uploaded")
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
        setLoader(false);
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
            
            setLoader(true);

            if(res.length > 0 ){

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
                        setInstructionImageName(response?.data?.picture)
                        alert("File Uploaded");
                    }else{
                        alert("File Not Uploaded")
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
        } catch (err) {
            setLoader(true);
            setInstructionImageName('');

            if (DocumentPicker.isCancel(err)) {
              alert('Canceled');
            } else {
              alert('Unknown Error: ' + JSON.stringify(err));
              throw err;
            }
            setLoader(false);
        }
        
    };

    const assetsAddtion = () => {
        
        setLoader(true);

        if(name === '' || categoryId === '' || subCategoryId === '' || assetStatusId === '' ){
            Alert.alert(
                "Warning",
                "Name, Categories and Status must be filled",
                [
                    { text: "OK" }
                ],
                { cancelable: true }
            );
            setLoader(false);
        }else{

            let formData = {
                user_id: userId,
                item_name: name,
                description: description,
                parent_item: categoryId,
                sub_item: subCategoryId,
                childsub_item : tezaCategoryId,
                location_id: locationId,
                status_id: assetStatusId,
                item_image_name: imageName,
                documents: instructionImageName,
                qr_code: qrCode,
                notes:notes
            };
            //console.log(formData);
            axios({
                url: `${API_BASE_URL}itemadd`,
                method: 'POST',
                data: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                alert("Assets Successfully added");
                setLoader(false);
                if(res?.data?.status){
                    navigation.navigate('DrawerNavigation')
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
    const getAssetsStatus = () => {
        axios({
            url: `${API_BASE_URL}itemStatus`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            var prevCatList = res?.data?.item_status_list.map(car => ({ value: car?.status_id, label: car?.status_name }));
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
                {loader ? <View style={styles.loading}><ActivityIndicator size={50}></ActivityIndicator></View> : null }
                <View style={styles.inputConatiner}>
                    <TextInput
                        style={{ height: 40, marginLeft: 10 }}
                        placeholder="Nome articolo"
                        placeholderTextColor="black"
                        onChangeText={newText => setName(newText)}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <TextInput
                        style={{ height: 40, marginLeft: 10 }}
                        placeholder="Descrizione"
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
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Categorie"
                        searchPlaceholder="Search..."
                        // value={previousCarList}
                        onChange={item => {
                            //console.log("category id is...>>>", item?.value)
                            getSubCategory(item?.value)
                            setCategoryId(item?.value)
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
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Sottocategoria"
                        searchPlaceholder="Search..."
                        onChange={item => {
                            setStato(item)
                            setSubCategoryId(item?.value)
                            getChildSubCategory(item?.value)
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
                        data={childsubCategoriesList}
                        maxHeight={200}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Terza categoria"
                        searchPlaceholder="Search..."
                        onChange={item => {
                            setStato(item)
                            setTezaCategoryId(item?.value)
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
                        onChange={item => {
                            setAssetStatusId(item?.value)
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
                        data={locationList}
                        maxHeight={200}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Posizione"
                        searchPlaceholder="Search..."
                        onChange={item => {
                            setLocationId(item?.value)
                            setStato(item)
                        }}
                    />
                </View>
                <View style={styles.inputConatiner}>
                    <TextInput
                        style={{ height: 80, marginLeft: 10 }}
                        placeholder="Notes"
                        placeholderTextColor="black"
                        onChangeText={newText => setNotes(newText)}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 10, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderRadius: 5, paddingTop: 20, paddingBottom: 20, paddingLeft: 10, paddingRight: 10, borderColor: '#DDD' }} onPress={() => assestImage()}>
                        <Text>Immagine</Text>
                        <Ionicons name="camera" color='#04487b' size={28}></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 20, marginTop: 10, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderRadius: 5, paddingTop: 20, paddingBottom: 20, paddingLeft: 10, paddingRight: 10, borderColor: '#DDD' }} onPress={() => instructionAssets()}>
                        <Text>Istruzioni</Text>
                        <Ionicons name="document-text" color='#04487b' size={28}></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={{ alignSelf: 'center', width: '60%', marginTop: 10, marginBottom: 20 }}>
                    <Button title='Save' onPress={assetsAddtion} color="#04487b" />
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
export default AssetAddition;