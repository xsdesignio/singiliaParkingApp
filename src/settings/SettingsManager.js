import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import SettingsScreen from "../screens/SettingsScreen"
import PrintingSettingsScreen from "../screens/PrintingSettingsScreen"

const SettingsStack = createNativeStackNavigator()

export default function SettingsManager() {
    return (
        <SettingsStack.Navigator initialRouteName="Settings">
            <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{title: 'Ajustes'}}/>
            <SettingsStack.Screen name="Printing Settings" component={PrintingSettingsScreen} options={{title: 'Ajustes de Impresión'}}/>
        </SettingsStack.Navigator>
    )
}
