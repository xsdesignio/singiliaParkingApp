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
    /* header: {
        marginTop: 60,
        marginLeft: 20,
    }, */
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FFFF',
        marginTop: 40,
    },
    pages: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: '#EBEDFF',
    },
    pages_link: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 18,
    }
    
})