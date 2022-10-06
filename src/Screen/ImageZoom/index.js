import React, { Component, useEffect, useState } from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Dimensions
} from 'react-native';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

const ImageZoom = (props) => {

    return(
        <View style={styles.container}>
            { props?.route?.params?.uri !='' ? 
            <>
            <ImageBackground source={props.route.params} style={{ height: deviceHeight, width: deviceWidth }} resizeMode="contain" />
            </> : null }
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    regularFont: {
      fontFamily : 'Montserrat-Regular'
    },
    primaryColor: {
      color: '#04487b'
    }
});

export default ImageZoom;