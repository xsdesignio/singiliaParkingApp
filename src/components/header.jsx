import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Link  } from 'expo-router'

import { useEffect, useState } from 'react';

export default function Header() {
    const [settingsPageActive, setSettingsPageActive] = useState(false);

    useEffect(() => {

    }, [])


    return(
        <View style={styles.settings_header}>
            <View>
            </View>
            <View>
                <Link 
                    href={"/settings"}
                    style={styles.settings_button}>
                    <Image style={styles.settings_image} source={require('../assets/settings.png')} />
                </Link>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    settings_header: {
        flexDirection: "row",
        height: 92,
        paddingTop:40,
        width: 400,
        backgroundColor: "#FFFFFF",
        justifyContent: "space-between",
        alignContent: "center",
        borderColor: "#C2D9C9",
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 0,
        marginBottom: 40,
        zIndex: 10,
    },
    settings_button: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    settings_image: {
        width: 28,
        height: 28,
    }
})