import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDrawerStatus } from '@react-navigation/drawer';
import StacksNavigation from './StackNavigation';
import LocationListingScreen from '../Screen/Locations/Listing';
import DocumentsListing from '../Screen/Documents/Listing';
import AssetsListig from '../Screen/Assets/Listing';
import UserProfile from '../Screen/ProfileScreen/index';
import SettingScreen from '../Screen/ProfileScreen/SeetingScreen';
import CustomDrawer from '../Component/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
    return (
        <Drawer.Navigator  drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
            //headerShown: false,
            drawerActiveBackgroundColor: '#04487b',
            drawerActiveTintColor: '#FFF',
            drawerInactiveTintColor: '#FFF',
            drawerPosition: 'left',
            drawerLabelStyle: {
                fontFamily: 'Montserrat-Regular',
                fontSize: 15,
            },
            headerTitleStyle:{
                fontFamily: 'Montserrat-Regular',
            },
            headerTintColor:'#FFF',
            headerStyle: {
                backgroundColor: '#04487b',
            },
            headerTitleAlign: 'center',
        }}
         initialRouteName="AssetsListig"
         drawerStyle ={{
            backgroundColor: '#04487b'
         }}>
            <Drawer.Screen 
                name="Tutti gli oggetti" 
                component={AssetsListig} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="ios-cube-outline" size={25} color={color} />
                    )
                }} 
            />
            <Drawer.Screen 
                name="Tutte le posizioni"
                component={LocationListingScreen} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="md-location-outline" size={25} color={color} />
                    )
                }} 
            />
            <Drawer.Screen 
                name="Profilo"
                component={UserProfile} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="ios-person-outline" size={25} color={color} />
                    )
                }} 
            />
            <Drawer.Screen 
                name="Documenti" 
                component={DocumentsListing} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="document-text-outline" size={25} color={color} />
                    )
                }} 
            />
            <Drawer.Screen 
                name="Impostazioni" 
                component={SettingScreen} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="ios-settings-outline" size={25} color={color} />
                    )
                }} 
            />

        </Drawer.Navigator>
    )
}
export default DrawerNavigation;