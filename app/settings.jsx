import { StyleSheet, View, Text, Button } from "react-native";
import Menu from "../src/components/menu";

import SettingsScreen from "../src/screens/SettingsScreen";
import Header from "../src/components/header";


export default function settingsView() {
    return(<View style={styles.container}>
        <Header/>
        <SettingsScreen/>
        <Menu/>
    </View>)
}


const styles = {
    container: {
        flex: 1,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: "center",
        width: "50%",
    },
}
