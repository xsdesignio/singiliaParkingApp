import { ScrollView, StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity } from "react-native";

import TicketsScreen from "../src/screens/TicketsScreen";
import Menu from "../src/components/menu";
import Header from "../src/components/header";


export default function tickets() {

    return(<View style={styles.container}>
        <Header/>
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