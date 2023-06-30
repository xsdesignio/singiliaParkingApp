import { StyleSheet, View, Text, TouchableOpacity, Button, Alert } from "react-native";

import { logoutUser } from "../session/sessionControler";
import { useNavigation } from "expo-router";
import { useState } from "react";

export default function SettingsScreen() {
    const navigation = useNavigation();

    const [bulletinsAmount, setBulletinsAmount] = useState(1)

    function logout() {
        logoutUser().then(logout_successfull => {
            if(logout_successfull)
                navigation.reset( {
                    index: 0,
                    routes: [{
                        name: 'index'
                    }]
                })
            else throw Error("Ha ocurrido un error a la hora de cerrar la sesión")
        }).catch(error => {
            Alert.alert("Error al cerrar la sesión", error, [{text: "OK"}])
        })
    }

    return(
        <View style={styles.container}>

            <Text style={styles.title}>Ajustes:</Text>

            <Text>Número de boletines a imprimit</Text>
            <View>
                <View style={styles.selector}>
                    <TouchableOpacity 
                        style={[
                            styles.selector_button, 
                            {backgroundColor: (bulletinsAmount==1) ? "#95e8c9": "#d4faec"}]
                        }
                        onPress={() => setBulletinsAmount(1)}>
                        <Text>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.selector_button, 
                            {backgroundColor: (bulletinsAmount==2) ? "#95e8c9": "#d4faec"}]
                        }
                        onPress={() => setBulletinsAmount(2)}>
                        <Text>2</Text>
                    </TouchableOpacity>
                </View>
                
            </View>

            <Text>Sesión</Text>

            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={logout}
                >
                    <Text style={styles.button_text}>
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>
            </View>
            
        </View>)
}


const styles = {
    container: {
        flex: 1,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: "center",
        width: "50%",
    },
    button: {
        backgroundColor: "#559f97",
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white',
        borderRadius: 20
    },
    button_text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 8,
    },
    selector: {
        flexDirection: "row"
    },
    selector_button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        borderRadius: 20
    },
}
