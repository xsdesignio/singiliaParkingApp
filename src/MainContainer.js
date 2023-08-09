import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from './styles/colors';

// Screens
import RecordScreen from './screens/RecordScreen';
import TicketsScreen from './screens/TicketsScreen';
import BulletinsScreen from './screens/BulletinsScreen';

import SettingsManager from './settings/SettingsManager';

//Screen names
const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer independent={true}>
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
            "tabBarActiveTintColor": colors.green,
            "tabBarInactiveTintColor": "grey",
            "tabBarLabelStyle": {
                "paddingBottom": 10,
                "fontSize": 10
            },
            "tabBarStyle": [
                {
                "display": "flex",
                height: 72,
                },
                null
            ]

        })
    }>
        <Tab.Screen name="Historial" component={RecordScreen} />
        <Tab.Screen name="Tickets" component={TicketsScreen} />
        <Tab.Screen name="Boletines" component={BulletinsScreen} />
        <Tab.Screen name="Ajustes" component={SettingsManager} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
