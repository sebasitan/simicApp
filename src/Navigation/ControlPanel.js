import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
const style = StyleSheet.create({
  mainConatiner: {
    backgroundColor: '#04487b',
    height: '100%'
  },
  textStyle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 50,
  },
  textConatiner: {
    marginTop: 20
  }
  , profileConatiner: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20

  }
})
const ControlPanel = ({navigation}) => {
  const AssetsListing = () => {
    navigation.navigate('AssetsListig')
  }
  const DocumentList = () => {
    navigation.navigate('DocumentsListing')
  }
  const LocationListing = () => {
    navigation.navigate('LocationListing')
  }
  const ProfileScreen = () => {
    navigation.navigate('ProfileScreen')
  }
  const logout = () => {
    navigation.navigate('Signin')
  }
  return (
    <View style={style.mainConatiner}>
      <View style={style.profileConatiner}>
        <Image source={require('../assets/images/user.png')} style={{ height: 100, width: 100, borderRadius: 50 }}></Image>
        <Text style={{ fontSize: 20, color: 'white', marginLeft: 10 }}>Vikas</Text>
      </View>
      <TouchableOpacity style={style.textConatiner} onPress={() => AssetsListing()}>
        <View>
          <Text style={style.textStyle}>Tutti gli oggetti</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.textConatiner} onPress={() => LocationListing()}>
        <View>
          <Text style={style.textStyle}>Tutte le posizioni</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.textConatiner}>
        <View>
          <Text style={style.textStyle}>Porfilo</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.textConatiner} onPress={() => DocumentList()}>
        <View>
          <Text style={style.textStyle}>Documenti</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.textConatiner} onPress={() => AssetsListing()}>
        <View>
          <Text style={style.textStyle}>Impostazioni</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.textConatiner} onPress={() => logout()}>
        <View>
          <Text style={style.textStyle}>Disconnettersi</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
export default ControlPanel