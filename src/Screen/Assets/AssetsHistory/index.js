
import React from "react";
import {View,Text, FlatList} from 'react-native';
import {
    Title,
    Paragraph,
  } from 'react-native-paper';
import NoDataFound from "../../../Component/NoDataFound";
const AssetsHistory=({route,navigation})=>{
const {item}=route?.params;
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
      <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10, marginLeft: 10, marginRight: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between'}}>
              <View style={{ flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20 }}>Nome articolo: </Title>{item.item_name}</Text>
                      <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20 }}>Nome posizione: </Title>{item.location_name}</Text>
                      <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Stato: </Title>{item.status_description}</Text>
                      <Text style={{ fontSize: 12 }}><Title style={{ fontSize: 12, color: 'black', lineHeight: 20}}>Creata il: </Title>{item.date}</Text>
                  </View>
              </View>
          </View>
      </View>
    );
  };
    return(
        <View>
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