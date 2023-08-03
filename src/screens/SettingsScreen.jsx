import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "expo-router";
import { useState } from "react";

import DefaultButton from "../components/atoms/default-button";

import { logoutUser } from "../session/sessionControler";
import { colors } from "../styles/colorPalette";


export default function SettingsScreen() {
    const navigation = useNavigation();

    const [bulletinsAmount, setBulletinsAmount] = useState(1)

    const [location, setLocation] = useState("")

    const [provisionalLocation, setprovisionalLocation] = useState("")

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

            <Text style={styles.normal_text}>Sesión</Text>

            <View>
                <Text>Actualmente en {location}</Text>
                <Text>Cambiar zona</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => {
                        setprovisionalLocation(value)
                    }}
                    secureTextEntry={true}
                    placeholder='Localizacion'
                />
                <DefaultButton onPress={() => setLocation(provisionalLocation)} text={"Cambiar zona"} />
            </View>

            <Text style={styles.normal_text}>Número de boletines a imprimir</Text>
            <View>
                <View style={styles.selector}>
                    <TouchableOpacity 
                        style={[
                            styles.selector_button, 
                            {
                                backgroundColor: (bulletinsAmount==1) ? 
                                    colors.light_green_selected : colors.light_green
                            }
                        ]}
                        onPress={() => setBulletinsAmount(1)}>
                        <Text>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.selector_button, 
                            {
                                backgroundColor: (bulletinsAmount==2) ? 
                                colors.light_green_selected : colors.light_green
                            }
                        ]}
                        onPress={() => setBulletinsAmount(2)}>
                        <Text>2</Text>
                    </TouchableOpacity>
                </View>
                
            </View>

            <Text style={styles.normal_text}>Sesión</Text>

            <View>
                <DefaultButton onPress={logout} text={"Cerrar sesión"} />
            </View>

            <View>
                <DefaultButton onPress={() => navigation.navigate("printing-settings")} text={"Volver"} />
            </View>
            
        </View>)
}



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        width: "100%",
    },
    input: {
        backgroundColor: colors.white,
        borderColor: colors.dark_blue,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        width: 280,
    },

    normal_text: {
        color: colors.white,
        fontSize: 16,
    },
    selector: {
        flexDirection: "row"
    },
    selector_button: {
        borderRadius: 20,
        marginHorizontal: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    title: {
        color: colors.white,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: "center",
        width: "50%",
    },
})
