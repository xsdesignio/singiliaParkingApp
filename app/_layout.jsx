import { StyleSheet, View, Text, Button } from "react-native";

import { Link, Slot } from "expo-router";
import { useRouter, useNavigation } from 'expo-router'


export const unstable_settings = {
    initialRouteName: "index"
} 

export default function Layout() {
    return(<View style={styles.container}>
        <Slot/>
    </View>)
}


let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FFFF",
    },
})