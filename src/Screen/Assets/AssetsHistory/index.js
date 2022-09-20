
import React from "react";
import {View,Text, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Title,
    Paragraph,
  } from 'react-native-paper';
import NoDataFound from "../../../Component/NoDataFound";
const AssetsHistory=({route,navigation})=>{
const {item}=route?.params;
console.log("item is.../",item)
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
  const ItemView = ({ item }) => {
    return (
      <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10 }} >
       <View>
        <Text>
        nome_asset: {item?.item_name}</Text>
        <Text>Booking Date :{item?.date}</Text>
        <Text>Location : {item?.location_address}</Text>
        <Text>Assest Status: {item?.status_description}</Text>
       </View>
      </View>
    );
  };
    return(
        <View>
            <Text style={{alignSelf:'center',fontSize:15,fontWeight:'500'}}>
           Assests History Records </Text> 
           {item?.length === 0 ? <NoDataFound title="No Data Found"/> :
           <FlatList
          data={item}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          style={{ marginTop: 20 }}
        />}
        </View>
    )
}
export default AssetsHistory;