import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList
} from 'react-native';

import moment from 'moment';

import Ionicons from 'react-native-vector-icons/Ionicons';

const AssetUpcomingDates = ({navigation, route }) => {
    const [ itemdata, setItemData ] = React.useState(route?.params?.item);

    const renderItem = ({ item }) => {
        return(
            <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 10, marginLeft: 10, marginRight: 10 }}>
                <View style={{ flexDirection: 'row'}}>
                    <Ionicons name="calendar-sharp" color='#04487b' size={60}></Ionicons>
                    <View style={{ flexDirection: 'column', justifyContent: 'center'}}>
                        <Text style={{ marginLeft: 10, color: '#333' }}>From Date: <Text style={{ color: '#000', fontWeight: '500' }}>{ moment(item.date_from).format('DD/MM/YYYY hh:mm:ss') }</Text></Text>
                        <Text style={{ marginLeft: 10, color: '#333', marginTop: 8 }}>End Date: <Text style={{ color: '#000', fontWeight: '500' }}>{ moment(item.date_to).format('DD/MM/YYYY hh:mm:ss') }</Text></Text>
                    </View>
                </View>
                { item.description != '' ? <> 
                    <Text style={{ borderTopWidth: 1, borderColor: '#DDD', marginTop: 10, paddingTop: 10 }}>Description: <Text style={{ color: '#000', fontWeight: '500' }}>{ item.description }</Text></Text>
                </> : null }
            </View>
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

    return(
        <View style={{ display: 'flex', marginTop: 10 }}>
            { itemdata.length > 0 ? 
                <>
                    <FlatList
                        data={itemdata}
                        initialNumToRender={5}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={ItemSeparatorView}
                        style={{ marginTop: 20 }}
                    />
                </> : 
                <>
                    <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[ styles.regularFont, { fontSize: 20, color: '#222' } ]}>oggetto non trovato!</Text>
                    </View>
                </>
            }
        </View>   
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection: "column",
        paddingLeft: 15,
        paddingRight: 15,
    },
    regularFont: {
      fontFamily : 'Montserrat-Regular'
    },
    primaryColor: {
      color: '#04487b'
    }
});

export default AssetUpcomingDates;