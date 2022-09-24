import React from "react";
import { } from 'react-native';
import Signin from '../Screen/Auth/Signin';
import Signup from '../Screen/Auth/Signup';
import ForgotPassword from '../Screen/Auth/ForgotPassword';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AssetAddition from'../Screen/Assets/Addition';
import AssetsEditing from '../Screen/Assets/Editing';
import AssetsListig from '../Screen/Assets/Listing';
import AssetsBooking from "../Screen/Assets/AssestsBooking";
import AssetsMaintance from "../Screen/Assets/AssetMaintance";
import AssetsHistory from '../Screen/Assets/AssetsHistory';
import AssetViewScreen from '../Screen/Assets/View';

import DocumentAddition from '../Screen/Documents/Addition';
import DocumentsListing from '../Screen/Documents/Listing';
import DocumentEditing from '../Screen/Documents/Editing';
import DocumentView from '../Screen/Documents/View';

import LocationAddition from '../Screen/Locations/Addition';
import LocationListing from '../Screen/Locations/Listing';
import LocationEditing from '../Screen/Locations/Editing';
import LocationViewing from '../Screen/Locations/View';

import ProfileScreen from '../Screen/ProfileScreen';
import ProfileEditScreen from '../Screen/ProfileScreen/Editing';

import DrawerNavigation from "./DrawerNavigation";

import Splash from "../Screen/Auth/Splash";

const Stack = createNativeStackNavigator();

const StackAuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
            <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
            <Stack.Screen name="AssetAddition" component={AssetAddition} options={{title:'Aggiungi nuovo oggetto' }} />
            <Stack.Screen name="AssetsEditing"  component={AssetsEditing} options={{ title:'Modifica oggetto' }} />
            <Stack.Screen name="AssetsListig" component={AssetsListig} options={{headerShown:false}} />
            <Stack.Screen name="AssetViewScreen" component={AssetViewScreen} options={{title:"Dettagli dell'articolo" ,headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
            <Stack.Screen name="AssetsBooking" component={AssetsBooking} options={{title:'Prenotazione'}}/>
            <Stack.Screen name="AssetsMaintance" component={AssetsMaintance} options={{title:'Manutenzione'}}/>
            <Stack.Screen name="AssetsHistory" component={AssetsHistory} options={{title:"Cronologia dei movimenti"}}/>
            <Stack.Screen name="DocumentsListing" component={DocumentsListing} options={{ headerShown: false }} />
            <Stack.Screen name="DocumentAddition" component={DocumentAddition} options={{title:'Aggiungi nuova documento'}}  />
            <Stack.Screen name="DocumentEditing" component={DocumentEditing} options={{ title:'Modifica documento',headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
            <Stack.Screen name="DocumentView" component={DocumentView} options={{title:"visualizzare i documenti", headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}  />
            <Stack.Screen name="LocationListing" component={LocationListing} options={{ headerShown: false }} />
            <Stack.Screen name="LocationAddition" component={LocationAddition} options={{title:'Aggiungi luogo',headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
            <Stack.Screen name="LocationEditing" component={LocationEditing} options={{ title:'Edit Location'}} />
            <Stack.Screen name="LocationViewing" component={LocationViewing} options={{ title:'dettagli sulla posizione', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
           <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{title:'Profilo', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}/>
           <Stack.Screen name="ProfileEditing" component={ProfileEditScreen} options={{title:'Modifica Profilo', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}/>
        </Stack.Navigator>
    )
}
export default StackAuthNavigator;