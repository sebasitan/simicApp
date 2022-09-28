import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LocationListing from '../Screen/Locations/Listing';
import DocumentListing from '../Screen/Documents/Listing';
import AssetsListing from '../Screen/Assets/Listing';
import UserProfile from '../Screen/ProfileScreen/index';
import SettingScreen from '../Screen/ProfileScreen/SeetingScreen';
import CustomDrawer from '../Component/CustomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useIsFocused } from '@react-navigation/native';

import * as Utility from '../Utility/inbdex';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const[userData, setUserData] = React.useState('');
    const[userRole, setUserRole] = React.useState('');
    const isFocused = useIsFocused();

    useEffect(() => {
        getUserInfomation();
    }, [isFocused]);
    
    const getUserInfomation = async () =>{
        let userdata = await Utility.getFromLocalStorge('userData');
        setUserData(userdata);
        setUserRole(userdata?.user_role);
    };

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
         initialRouteName="AssetsListing"
         drawerStyle ={{
            backgroundColor: '#04487b'
         }}>
            <Drawer.Screen 
                name="Tutti gli oggetti" 
                component={AssetsListing} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="ios-cube-outline" size={25} color={color} />
                    )
                }} 
            />
            {userRole != 3 ? <>
                <Drawer.Screen 
                    name="Tutte le posizioni"
                    component={LocationListing} 
                    options={{
                        drawerIcon: ({color}) => (
                            <Ionicons name="md-location-outline" size={25} color={color} />
                        )
                    }} 
                />
            </> : null }
            <Drawer.Screen 
                name="Profilo"
                component={UserProfile} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="ios-person-outline" size={25} color={color} />
                    )
                }} 
            />
            {userRole != 3 ? <>
            <Drawer.Screen 
                name="Documenti" 
                component={DocumentListing} 
                options={{
                    drawerIcon: ({color}) => (
                        <Ionicons name="document-text-outline" size={25} color={color} />
                    )
                }} 
            />
            </> : null }
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