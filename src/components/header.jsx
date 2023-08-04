import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Link, useNavigation, usePathname, useRouter, useRootNavigation } from 'expo-router'

import { useNavigationState } from '@react-navigation/native';

import { useEffect, useState } from 'react';

export default function Header() {
    const [settingsPageActive, setSettingsPageActive] = useState(false);

    const path_name = usePathname()

    const navigation = useNavigation()

    useEffect(() => {
        // set settingsPageActive true of false depending on the comparation
        setSettingsPageActive((path_name == "/settings"))

    }, [path_name])



    return(
        <View style={styles.settings_header}>
            <View>
                <Image style={styles.logo} source={require('../../assets/icons/logo.png')} />
            </View>
            <View style={styles.button_wrapper}>
                <TouchableOpacity
                    style={styles.settings_button}
                    onPress= {() => {
                        if (settingsPageActive){
                            navigation.goBack()
                        } else {
                            navigation.navigate("settings")    
                        }
                    }}>
                    <Image style={styles.settings_image} source={settingsPageActive ? require('../../assets/icons/cross.png') : require('../../assets/icons/settings.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    settings_header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 0,
        marginBottom: 10,
        zIndex: 10,
    },
    logo: {
        width: 44,
        height: 44,
        margin: 10,
    },
    button_wrapper: {
        backgroundColor: "#d4faec",
        justifyContent: "center",
        alignItems: "center",
        width: 44,
        height: 44,
        margin: 10,
        borderRadius: 25,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.44,
        shadowRadius: 6.68,

        elevation: 12,
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