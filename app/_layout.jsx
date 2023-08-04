import React from "react";
import { StyleSheet, SafeAreaView  } from "react-native";
import { Slot } from "expo-router";



export const unstable_settings = {
    initialRouteName: "index"
} 

export default function Layout() {
    return(<SafeAreaView style={styles.container}>
        <Slot/>
    </SafeAreaView>)
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%",
        backgroundColor: '#60826a',
        paddingTop: 40,
    },
})
