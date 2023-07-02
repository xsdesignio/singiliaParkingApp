import { View } from "react-native";
import Menu from "../src/components/menu";

import SettingsScreen from "../src/screens/SettingsScreen";
import Header from "../src/components/header";


export default function settingsView() {
    
    return(<View>
        <Header/>
        <SettingsScreen/>
        <Menu/>
    </View>)
}



