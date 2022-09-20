import React from 'react';
import {View,Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const style=StyleSheet.create({
    headerConatiner:{
        flexDirection:'row',
        width:'100%',
        alignItems:"center",
        marginTop:50
    },
    titleText:{
        fontSize:16,fontWeight:'800',
        alignSelf:'center',
        color:'white',
        marginLeft:'30%',
        marginBottom:10
    }
})
const HomeHeader=({title,navigation,backButton})=>{
    const goBack=()=>{
        navigation.goBack()
    }
    return(
        <View style={{ backgroundColor:'#04487b',}}>
            <View style={style.headerConatiner}>
            {backButton?
            <TouchableOpacity onPress={()=>goBack()}>
            <Ionicons name="arrow" color='white'  size={30}></Ionicons>
            </TouchableOpacity>:
            <TouchableOpacity>
            <Ionicons name="menu" color='white'  size={30}></Ionicons>
            </TouchableOpacity>}
            <View>
            <Text style={style.titleText}>{title}</Text>
            </View>
            </View>
        </View>
    )
}
export default HomeHeader;