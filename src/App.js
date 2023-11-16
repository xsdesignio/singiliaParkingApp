/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { registerRootComponent } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect } from 'react';
import { Keyboard, Text, View, StyleSheet } from 'react-native';
import { getSession } from './session/sessionStorage';
import { LoginProvider, useLogin } from './session/LoginProvider';
import { PrinterProvider } from './printing/PrintingProvider';
import NetInfo from "@react-native-community/netinfo"


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
import { getServerSession } from './session/sessionControler';
import HeaderLogo from './components/atoms/header-logo';
import NetworkErrorScreen from './screens/NetworkErrorScreen';



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

	const [ isConnected, setIsConnected ] = useState(false);
  
	
	// Effect for checking network connection status
	useEffect(() => {

		const unsubscribe = NetInfo.addEventListener(state => {
			if (state.isConnected) {
				setIsConnected(true);

			} else {
				setIsConnected(false);
				// Alert.alert("Comprueba tu conexión a internet", "Hemos detectado problemas de conexción. La app necesita un correcto acceso a internet para poder funcionar.")
			}
		});

		return () => {
			// Unsubscribe from the network connectivity changes when the component unmounts
			unsubscribe();
		};
	}, [isConnected]);



	// Effect for checking status
	useEffect(() => {
		checkLogin().then(() => {
			initApp();
		})
	}, [])

	async function checkLogin() {

		let session = await getSession();

		if(session != null) {
			if ("id" in session && "role" in session && "name" in session && "email" in session) {
				setIsLoggedIn(true);
				return true;
			}
		
			let serverSession = await getServerSession();

			if(serverSession != null)
				if ("id" in serverSession && "role" in serverSession && "name" in serverSession && "email" in serverSession) {
					setIsLoggedIn(true);
					return true;
				}
		}
		
		setIsLoggedIn(false);
		return false
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
			{ isConnected ? 
				(isLoggedIn ? (
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
									borderTopColor: colors.input_border,
									borderTopWidth: 1,
								},
								null
							],
							"headerStyle": [
								styles.header,
								null
							],
	
						})
					}>
						<Tab.Screen name="Historial" component={RecordScreen} options={{
							headerTitle: () => (
								<View style={styles.header_content}>
									<HeaderLogo></HeaderLogo> 
									<Text style={styles.text_style}>
										Historial
									</Text>
								</View>
							)
						}}/>
						<Tab.Screen name="Tickets" component={TicketsScreen} options={{
							headerTitle: () => (
								<View style={styles.header_content}>
									<HeaderLogo></HeaderLogo> 
									<Text style={styles.text_style}>
										Tickets
									</Text>
								</View>
							)
						}}/>
						<Tab.Screen name="Boletines" component={BulletinsScreen} options={{
							headerTitle: () => (
								<View style={styles.header_content}>
									<HeaderLogo></HeaderLogo> 
									<Text style={styles.text_style}>
										Boletines
									</Text>
								</View>
							)
						}}/>
						<Tab.Screen name="Ajustes" options={{
							headerTitle: () => (
								<View style={styles.header_content}>
									<HeaderLogo></HeaderLogo> 
									<Text style={styles.text_style}>
										Ajustes
									</Text>
								</View>
							)
						}}>
							{() => (
							<SettingsStack.Navigator initialRouteName="Settings">
								<SettingsStack.Screen name="Settings" component={SettingsScreen} options={{title: 'General'}}/>
								<SettingsStack.Screen name="Printing Settings" component={PrintingSettingsScreen} options={{title: 'Impresión'}}/>
							</SettingsStack.Navigator>
							)}
						</Tab.Screen>
					</Tab.Navigator>
				) : (
					<InitStack.Navigator initialRouteName='Home' 
					
						screenOptions={{
							"headerStyle": [
								styles.header,
								null
							],
						}}
					
					>
						<InitStack.Screen name="Home" component={IndexScreen} options={{title: 'Inicio'}}/>
						<InitStack.Screen name="Login" component={LoginScreen} options={{title: 'Inicia Sesión'}}/>
					</InitStack.Navigator>
				)) : 

				<InitStack.Navigator initialRouteName='Network'
				
					screenOptions={{
						"headerStyle": [
							styles.header,
							null
						],
					}}

				>
					<InitStack.Screen name="Network" component={NetworkErrorScreen} options={{title: 'Network Error'}}/>
				</InitStack.Navigator>
			}
		</NavigationContainer>
	);
}

registerRootComponent(App);


const styles = StyleSheet.create({
	header: {
		borderBottomColor: colors.input_border,
		borderBottomWidth: 1,
	},
	header_content: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingBottom: 8,
		paddingTop: 8
	},
	text_style: { 
		color: colors.dark_green,
		fontSize: 18, 
		fontWeight: 'bold',
		marginLeft: 10, 
	}
})
