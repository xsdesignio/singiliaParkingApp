import { StyleSheet, View } from "react-native";
import Menu from "../../src/components/menu";

import SettingsScreen from "../../src/screens/SettingsScreen";
import Header from "../../src/components/header";


export default function settingsView() {
    
    return(<View style={styles.container}>
        <Header/>
        <SettingsScreen/>
        <Menu/>
    </View>)
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
})
