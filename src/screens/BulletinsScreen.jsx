/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { useState } from "react";

import { createAndPrintBulletin } from "../bulletins/bulletinsController";

import { Picker } from '@react-native-picker/picker';
import DefaultButton from "../components/atoms/default-button";
import { colors } from "../styles/colorPalette";

// import { getConfigValue } from "../configStorage";

export default function BulletinsScreen() {
    
    const [bulletinInfo, setBulletinInfo] = useState({
        "duration": 30,
        "registration": undefined,
        "price": undefined,
        /* "payment_method": undefined, */
        "paid": false,
        "precept": "Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza.",
        "brand": undefined,
        "model": undefined,
        "color": undefined,
    })
    
    
    // Simple function to update the bulletinInfo state
    function updateBulletinInfo(key, value) {
        setBulletinInfo((prevBulletinInfo) => ({
          ...prevBulletinInfo,
          [key]: value,
        }));
    }


    function printManager() {
        createAndPrintBulletin(bulletinInfo);
    }




    return(
        <View style={styles.container}>
            
            <View style={styles.bulletin_info_form}>
                <Text style={styles.title}>Creación de Boletines</Text>
                
                {/* --------- Required Information --------- */}
                <View style={styles.bulletin_info_section}>
                    <Text style={styles.label}>Datos requeridos</Text>

                                
                    <TextInput
                        style={styles.input}
                        autoCapitalize="characters"
                        onChangeText={(registration) => 
                            updateBulletinInfo("registration", registration)
                        }
                        placeholder="Matricula"
                    />

                    <Text style={styles.label}>Duración</Text>
                    <View style={styles.duration_picker_wraper}>
                        <Picker
                            style={styles.picker}
                            selectedValue={bulletinInfo["duration"]}
                            onValueChange={(duration) => 
                                updateBulletinInfo("duration", parseInt(duration))
                            }
                            itemStyle={styles.picker_item}
                        >
                            <Picker.Item
                                label="30 minutos"
                                value="30"
                            />
                            <Picker.Item
                                label="60 minutos"
                                value="60"
                            />
                            <Picker.Item
                                label="90 minutos"
                                value="90"
                            />
                            <Picker.Item
                                label="120 minutos"
                                value="120"
                            />
                        </Picker>
                    </View>

                    {/* --------- Precept --------- */}
                    <View style={styles.centered_element}>
                        <Text style={styles.label}>Precepto Infringido:</Text>

                        <View style={styles.picker_wraper}>
                            <Picker
                                style={styles.picker}
                                selectedValue={bulletinInfo["precept"]}
                                onValueChange={(precept) => 
                                    updateBulletinInfo("precept", precept)
                                }
                                itemStyle={styles.picker_item}
                            >
                                <Picker.Item
                                    label="Estacionar sin ticket de aparcamiento"
                                    value="Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza."
                                />
                                <Picker.Item
                                    label="Rebosar el horario de permanencia asociado"
                                    value="Rebosar el horario de permanencia asociado. Art. 14 Ordenanza."
                                />
                                <Picker.Item
                                    label="No colocar el ticket de forma visible"
                                    value="No colocar el ticket de forma visible. Art. 14 Ordenanza."
                                />
                            </Picker>
                        </View>
                    </View>
                </View>


                {/* --------- Vehicle Details (Not required) --------- */}
                <View style={styles.centered_element}>
                    <Text style={styles.label}>Datos Opcionales</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(model) => 
                            updateBulletinInfo("model", model)}
                        placeholder="Modelo"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={(brand) => 
                            updateBulletinInfo("brand", brand)}
                        placeholder="Marca"
                    />
                </View>

                <TextInput
                    style={styles.input}
                    onChangeText={(color) => 
                        updateBulletinInfo("color", color)}
                    placeholder="Color"
                />
            </View>
    

            <DefaultButton onPress={printManager} text="Imprimir" />
        </View>)
}

let styles = StyleSheet.create({
    bulletin_info_form: {
        alignItems: "center",
        backgroundColor: colors.green,
        flex: 1,
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 0,
        minHeight: 180,
        zIndex: 10,
    },
    bulletin_info_section: {
        alignItems: "center",
        justifyContent: "center",
    },
    centered_element: {
        alignItems:"center"
    },

    container: {
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'center',
        paddingVertical: 20,
    },


    duration_picker_wraper: {
        alignItems: "center",
        backgroundColor: colors.white,
        borderColor: colors.dark_blue,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: 200,
    },

    input: {
        backgroundColor: colors.white,
        borderColor: colors.dark_blue,
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 200,
    },
    label: {
        color: colors.white,
        fontSize: 16,
        marginBottom: 4,
        marginTop: 8,
    },

    picker: {
        width: "100%",
    },


    picker_item: {
        fontSize: 8,
    },

    
    picker_wraper: {
        alignItems: "center",
        backgroundColor: colors.white,
        borderColor: colors.dark_blue,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: 320,
    },



    /* selector: {
        flexDirection: "row"
    },
    selector_button: {
        borderRadius: 20,
        marginHorizontal: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    */
    title: {
        color: colors.white,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    },
    
})
