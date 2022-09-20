import React  from "react";
import { StyleSheet,View,Text } from 'react-native';
const style=StyleSheet.create({
    mainConatiner:{
        marginTop:50,
        alignSelf:'center'
    }
})
const NoDataFound=({title})=>{
    return(
        <View style={style.mainConatiner}>
            <Text style={{fontWeight:'600',fontSize:20,color:'black'}}>{title}</Text>
        </View>
    )
}
export default NoDataFound;