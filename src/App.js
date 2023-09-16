/* eslint-disable react/prop-types */
//import "expo-router/entry";
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { registerRootComponent } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useEffect } from 'react';
import { Keyboard } from 'react-native';

import { getSession } from './session/sessionStorage';

import { LoginProvider, useLogin } from './session/LoginProvider';
import { PrinterProvider } from './printing/PrintingProvider';


import { initApp } from './init';
import { colors } from './styles/colorPalette';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import TicketsScreen from './screens/TicketsScreen';
import BulletinsScreen from './screens/BulletinsScreen';
import RecordScreen from './screens/RecordScreen';
import PrintingSettingsScreen from './screens/PrintingSettingsScreen';
import SettingsScreen from './screens/SettingsScreen';

import LoginScreen from './screens/LoginScreen';
import IndexScreen from './screens/IndexScreen';


const InitStack = createNativeStackNavigator();

/* eslint-disable react/prop-types */
const Tab = createBottomTabNavigator();


const SettingsStack = createNativeStackNavigator()



// eslint-disable-next-line react/prop-types
export default function App() {

	return (
		<LoginProvider>
			<PrinterProvider>
				<DefaultNavigator/>
			</PrinterProvider>
		</LoginProvider>
	);
}


function DefaultNavigator() {
	const { isLoggedIn, setIsLoggedIn } = useLogin();
  
	/* const [userName, setUserName] = useState(""); */
	useEffect(() => {

		initApp();
		checkLogin();
	}, []);

	async function checkLogin() {
		let session = await getSession();

		if(session != null)
		if ("id" in session && "role" in session && "name" in session && "email" in session) {
			/* setUserName(session["name"]) */
			setIsLoggedIn(true);
			return;
		}
		
		setIsLoggedIn(false);
	}



	const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => setIsKeyboardOpen(true)
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => setIsKeyboardOpen(false)
		);
		
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return (
		<NavigationContainer>
			{isLoggedIn ? (
				<Tab.Navigator
					initialRouteName="Tickets"
					screenOptions={
						({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;
							let rn = route.name;

							if (rn === "Tickets") {
							iconName = focused ? 'document-text' : 'document-text-outline';

							} else if (rn === "Boletines") {
							iconName = focused ? 'documents' : 'documents-outline';

							} else if (rn === "Historial") {
							iconName = focused ? 'list' : 'list-outline';
							}else if (rn === "Ajustes") {
								iconName = focused ? 'settings' : 'settings-outline';
							}

							// You can return any component that you like here!
							return <Ionicons name={iconName} size={size} color={color} />;
						},
						"tabBarActiveTintColor": colors.green_button,
						"tabBarInactiveTintColor": "grey",
						"tabBarLabelStyle": {
							"paddingBottom": 10,
							"fontSize": 10
						},
						"tabBarStyle": [
							{
								"display": isKeyboardOpen ? "none": "flex",
								height: 72,
								borderTopColor: colors.dark_green,
								borderTopWidth: 1,
							},
							null
						]

					})
				}>
					<Tab.Screen name="Historial" component={RecordScreen} />
					<Tab.Screen name="Tickets" component={TicketsScreen} />
					<Tab.Screen name="Boletines" component={BulletinsScreen} />
					<Tab.Screen name="Ajustes" >
						{() => (
						<SettingsStack.Navigator initialRouteName="Settings">
							<SettingsStack.Screen name="Settings" component={SettingsScreen} options={{title: 'General'}}/>
							<SettingsStack.Screen name="Printing Settings" component={PrintingSettingsScreen} options={{title: 'Impresión'}}/>
						</SettingsStack.Navigator>
						)}
					</Tab.Screen>
				</Tab.Navigator>
			) : (
				<InitStack.Navigator initialRouteName='Home'>
					<InitStack.Screen name="Home" component={IndexScreen} options={{title: 'Inicio'}}/>
					<InitStack.Screen name="Login" component={LoginScreen} options={{title: 'Inicia Sesión'}}/>
				</InitStack.Navigator>
			)}
		</NavigationContainer>
	);
}

registerRootComponent(App);
