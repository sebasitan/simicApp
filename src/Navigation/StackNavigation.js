import React from "react";
import { } from 'react-native';
import Signin from '../Screen/Auth/Signin';
import ForgotPassword from '../Screen/Auth/ForgotPassword';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AssetAddition from'../Screen/Assets/Addition';
import AssetsEditing from '../Screen/Assets/Editing';
import AssetsBooking from "../Screen/Assets/AssestsBooking";
import AssetsMaintance from "../Screen/Assets/AssetMaintance";
import AssetsHistory from '../Screen/Assets/AssetsHistory';
import AssetViewScreen from '../Screen/Assets/View';
import AssetTrash from "../Screen/Assets/Trash";
import AssetUpcomingDates from "../Screen/Assets/AssestsBooking/reservations";
import QRCodeItemAdd from "../Screen/Assets/Addition/qritemadd";

import DocumentAddition from '../Screen/Documents/Addition';
import DocumentEditing from '../Screen/Documents/Editing';
import DocumentView from '../Screen/Documents/View';
import DocumentTrash from "../Screen/Documents/Trash";

import LocationAddition from '../Screen/Locations/Addition';
import LocationEditing from '../Screen/Locations/Editing';
import LocationViewing from '../Screen/Locations/View';
import LocationTrash from "../Screen/Locations/Trash";

import ProfileEditScreen from '../Screen/ProfileScreen/Editing';

import QRCodeScreen from "../Screen/QRCodeScanner";
import QRCodeNotFound from "../Screen/QRCodeScanner/notfound";

import DrawerNavigation from "./DrawerNavigation";

import Splash from "../Screen/Auth/Splash";

const Stack = createNativeStackNavigator();

const StackAuthNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
            <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false, title: 'Password dimenticata' }} />
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
            <Stack.Screen name="AssetAddition" component={AssetAddition} options={{title:'Aggiungi nuovo oggetto' }} />
            <Stack.Screen name="AssetTrash" component={AssetTrash} options={{title:'Elenco degli elementi del cestino' }} />
            <Stack.Screen name="AssetsEditing"  component={AssetsEditing} options={{ title:'Modifica oggetto' }} />
            <Stack.Screen name="AssetViewScreen" component={AssetViewScreen} options={{title:"Dettagli dell'articolo" ,headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
            <Stack.Screen name="AssetsBooking" component={AssetsBooking} options={{title:'Prenotazione'}}/>
            <Stack.Screen name="AssetsMaintance" component={AssetsMaintance} options={{title:'Manutenzione'}}/>
            <Stack.Screen name="AssetsHistory" component={AssetsHistory} options={{title:"Cronologia dei movimenti"}}/>
            <Stack.Screen name="DocumentAddition" component={DocumentAddition} options={{title:'Aggiungi nuova documento'}}  />
            <Stack.Screen name="DocumentEditing" component={DocumentEditing} options={{ title:'Modifica documento',headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
            <Stack.Screen name="DocumentView" component={DocumentView} options={{title:"visualizzare i documenti", headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}  />
            <Stack.Screen name="DocumentTrash" component={DocumentTrash} options={{title:"Cestino dei documenti"}}  />
            <Stack.Screen name="LocationAddition" component={LocationAddition} options={{title:'Aggiungi luogo',headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
            <Stack.Screen name="LocationEditing" component={LocationEditing} options={{ title:'Modifica posizioni'}} />
            <Stack.Screen name="LocationViewing" component={LocationViewing} options={{ title:'dettagli sulla posizione', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}} />
            <Stack.Screen name="LocationTrash" component={LocationTrash} options={{title:'Cestino posizioni' }} />
           <Stack.Screen name="ProfileEditing" component={ProfileEditScreen} options={{title:'Modifica Profilo', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}/>
           <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} options={{title:'Scanner di codici qr', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}/>
           <Stack.Screen name="QRCodeNotFound" component={QRCodeNotFound} options={{title:'Non trovato', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}/>
           <Stack.Screen name="QRCodeItemAdd" component={QRCodeItemAdd} options={{title:'Aggiungi nuovo oggetto', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}/>
           <Stack.Screen name="AssetUpcomingDates" component={AssetUpcomingDates} options={{title:'Prenotazioni Attive', headerTintColor:'white', headerStyle:{backgroundColor:'#04487b'}}}/>
        </Stack.Navigator>
    )
}
export default StackAuthNavigator;