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
            </View>
            <View>
                <TouchableOpacity
                    style={styles.settings_button}
                    onPress= {() => {
                        if (settingsPageActive){
                            navigation.goBack()
                        } else {
                            navigation.navigate("settings")    
                        }
                    }}>
                    <Image style={styles.settings_image} source={settingsPageActive ? require('../../assets/cross.png') : require('../../assets/settings.png')} />
                </TouchableOpacity>
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
        marginBottom: 0,
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