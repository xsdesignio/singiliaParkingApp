import { ScrollView, StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity } from "react-native";

import PrintingScreen from "../src/screens/PrintingScreen";
import Menu from "../src/components/menu";
import SettingsButton from "../src/components/header";


export default function printing() {

    return(<View style={styles.container}>
        <SettingsButton/>
        <PrintingScreen/>
        <Menu/>
    </View>)
}



const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%",
    },
}