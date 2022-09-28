import React  from "react";
import { StyleSheet,View,Text } from 'react-native';

const styles=StyleSheet.create({
    mainConatiner:{
        marginTop:50,
        alignSelf:'center'
    }
})
const NoDataFound=({title})=>{
    return(
        <View style={styles.mainConatiner}>
          <Text style={{ fontWeight:'500', fontSize:18,color:'black', fontFamily: 'Montserrat-Regular'}}>{title}</Text>
      </View>
    )
}
export default NoDataFound;