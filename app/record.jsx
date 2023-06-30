import { StyleSheet, View, Text, Button, TouchableOpacity, Image, ScrollView } from "react-native";

import Menu from "../src/components/menu";
import RecordScreen from "../src/screens/RecordScreen";
import Header from "../src/components/header";



export default function recordView() {

    return(<View style={styles.container}>
        <Header/>
        <RecordScreen/>
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
