/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';

import { StyleSheet, View, Text, Alert } from "react-native";
import { useState } from "react";
import { Picker } from '@react-native-picker/picker';

import { obtainAssignedZone, assignZone, obtainAvailableZones } from "../zone_manager"


import { getSession } from "../session/sessionStorage";
// import DefaultButton from "../components/atoms/default-button";
import SecondaryButton from "../components/atoms/secondary-button";

import { logoutUser, } from "../session/sessionControler";
import { useLogin } from "../session/LoginProvider";
import { usePrinter } from "../printing/PrintingProvider";
import { colors } from "../styles/colorPalette";
import { setConfigValue, getConfigValue } from "../configStorage";
import { printDailyReport } from "../reports/dailyReportController";


export default function SettingsScreen({ navigation }) {

    const { setIsLoggedIn } = useLogin()
    const Printer = usePrinter()
    const [sessionName, setSessionName] = useState("")
    const [zone, setZone] = useState(null)
    const [availableZones, setAvailableZones] = useState([])

    useFocusEffect(React.useCallback(() => {
        getZone();
        getAvailableZones();
        return () => {
            // Your cleanup code when the screen is unfocused
        };
    }, [])
    )

    useEffect(() => {
        getSession().then(session => {
            // setSession(session)
            setSessionName(session["name"])
        })

    }, [])


    function logout() {
        logoutUser().then(logout_successfull => {
            setIsLoggedIn(false)

            if (logout_successfull) {
                setIsLoggedIn(false)
            }
            else throw Error("Ha ocurrido un error a la hora de cerrar la sesión")
        }).catch(error => {
            Alert.alert("Error al cerrar la sesión", error, [{ text: "OK" }])
        })
    }



    async function getZone() {
        let zone = await obtainAssignedZone()
        if (zone != null) {
            setZone(zone)
        } else {
            zone = await getConfigValue("zone")
            if (zone != null) {
                setZone(zone)
            }
        }

    }

    async function getAvailableZones() {

        let available_zones = await getConfigValue("available_zones")

        if (available_zones != null) {
            setAvailableZones(available_zones)
        } else {
            let server_available_zones = await obtainAvailableZones()

            if (server_available_zones != null)
                setAvailableZones(server_available_zones)
        }


    }

    async function saveNewZone(newZone) {

        setZone(newZone)
        let zoneUpdated = await setConfigValue("zone", newZone)


        if (zoneUpdated) {
            let assignZoneToUser = assignZone(newZone)
            if (assignZoneToUser) {
                Alert.alert("Zona actualizada con éxito", `Tu nueva zona asignada es ${newZone}`);
                return;
            }
        }

        Alert.alert("Ha ocurrido algo inesperado", `Comprueba si la zona ha sido asignada y, sino, inténtelo de nuevo`);

    }



    return (
        <View style={styles.container}>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Sesión</Text>

                <Text style={styles.normal_text}>
                    Usuario: <Text style={styles.bold_text}>{sessionName}</Text>
                </Text>

                <View style={styles.zone_wrapper}>
                    <Text style={styles.normal_text}>
                        Zona:
                    </Text>
                    <View style={styles.picker_wraper}>
                        {zone != null ? (
                            <Picker
                                style={styles.picker}
                                selectedValue={zone}
                                onValueChange={
                                    (new_Zone) => {
                                        saveNewZone(new_Zone)
                                    }
                                }
                                itemStyle={styles.picker_item}
                            >
                                {/* Iterate the available tickets to get a picker item for each available ticket duration */}
                                {availableZones.map ? availableZones.map((available_zone) => {
                                    return (
                                        <Picker.Item
                                            style={styles.picker_item}
                                            key={available_zone.id}
                                            label={available_zone.name}
                                            value={available_zone.name}
                                        />
                                    )
                                }) : (
                                    <Picker.Item
                                        key={0}
                                        label={zone}
                                        value={zone}
                                    />
                                )}
                            </Picker>
                        ) : <></>}

                    </View>
                </View>

                <SecondaryButton onPress={logout} text={"Cerrar sesión"} />
            </View>
            <View style={styles.section}>
                <Text style={styles.subtitle}>Impresión</Text>
                {
                    Printer.connectedDevice ? (
                        <View>
                            <Text style={styles.normal_text}>Impresora contectada: </Text>
                            <Text style={styles.bold_text}>{Printer.connectedDevice.name}</Text>
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
                <Text style={styles.subtitle}>Reporte Diario</Text>
                <Text style={styles.normal_text}>
                    Generar reporte con actividad diaria.
                </Text>

                <View>
                    <SecondaryButton onPress={() => printDailyReport(Printer, sessionName)} text={"Imprimir Reporte"} />
                </View>
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
        gap: 10,
        justifyContent: 'center',
        width: "100%",
    },

    normal_text: {
        color: colors.dark_green,
        fontSize: 16,
        textAlign: "center",
    },

    picker: {
        width: "100%",
    },
    picker_item: {
        color: colors.dark_green,
    },
    picker_wraper: {
        alignItems: "left",
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: 220,
    },
    section: {
        backgroundColor: colors.white,
        borderRadius: 8,
        gap: 8,
        justifyContent: "center",
        padding: 8,
        textAlign: "center",
        width: 340,
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
        color: colors.dark_green,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: "center",
    },
    zone_wrapper: {
        alignItems: "center",
        backgroundColor: colors.light_bg,
        borderRadius: 8,
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        padding: 10,
    }
})

