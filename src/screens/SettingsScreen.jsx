/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useState } from "react";

import { getSession } from "../session/sessionStorage";
// import DefaultButton from "../components/atoms/default-button";
import SecondaryButton from "../components/atoms/secondary-button";

import { logoutUser,  } from "../session/sessionControler";
import { useLogin } from "../session/LoginProvider";
import { usePrinter } from "../printing/PrintingProvider";
import { colors } from "../styles/colorPalette";
import { getConfigValue } from "../configStorage";


export default function SettingsScreen({ navigation }) {

    // const [bulletinsAmount, setBulletinsAmount] = useState(1)

    const { setIsLoggedIn } = useLogin()
    const { connectedDevice } = usePrinter()

    const [zone, setZone] = useState(null)

    const [ session , setSession] = useState([])
    const [ sessionName, setSessionName ] = useState("")

    // const [provisionalLocation, setprovisionalLocation] = useState("")

    function logout() {
        logoutUser().then(logout_successfull => {
            setIsLoggedIn(false)
            
            if(logout_successfull) {
                setIsLoggedIn(false)
            }
            else throw Error("Ha ocurrido un error a la hora de cerrar la sesión")
        }).catch(error => {
            Alert.alert("Error al cerrar la sesión", error, [{text: "OK"}])
        })
    }



    useEffect(() => {

        getConfigValue("zone").then(obtained_zone => {
            console.log("obtained_zone: ", obtained_zone)
            setZone(obtained_zone)
        })

        getSession().then(session => {
            console.log("session: ", session)
            setSession(session)
            setSessionName(session["name"])
        })

    }, [])

    return(
        <View style={styles.container}>

            <View style={styles.section}>
                <Text style={styles.subtitle}> Administrar Impresión</Text>
                            {
                                connectedDevice ? (
                                    <View>
                                        <Text style={styles.normal_text}>Impresora contectada: </Text>
                                        <Text style={styles.bold_text}>{connectedDevice.name}</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.normal_text}>Actualmente no tienes ninguna impresora contectada </Text>
                                )
                            }
                        
                    
                <View>
                    <SecondaryButton onPress={() => navigation.navigate("Printing Settings")} text={"Administrar impresora"} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}> Administrar Sesión</Text>
                <Text style={styles.normal_text}>
                    Zona Asignada: {
                        zone == null ? "No asignada" : zone
                    }
                </Text>
                <Text style={styles.normal_text}>Actualmente registrado como { sessionName }</Text>
                <SecondaryButton onPress={logout} text={"Cerrar sesión"} />
            </View>

        </View>)
}



const styles = StyleSheet.create({
    bold_text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center",
    },
    container: {
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'center',
        width: "100%",
    },

    normal_text: {
        color: colors.dark_green,
        fontSize: 16,
        textAlign: "center",
    },
    section: {
        backgroundColor: colors.white,
        borderColor: colors.dark_green,
        borderWidth: 1,
        gap: 20,
        justifyContent: "center",
        padding: 20,
        width: 300,
    },
    /* selector: {
        flexDirection: "row"
    },
    selector_button: {
        borderRadius: 20,
        marginHorizontal: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
    }, */
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: "center",
    }, 
})

