import { StyleSheet, View, Text, Button, TouchableOpacity, Image, ScrollView } from "react-native";

import Menu from "../src/components/menu";
import SettingsButton from "../src/components/header";
import TicketsScreen from "../src/screens/ticketsScreen";



export default function ticketsView() {


    return(<View style={styles.container}>
        <SettingsButton/>
        <TicketsScreen/>
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
