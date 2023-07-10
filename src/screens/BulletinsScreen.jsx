import React, { useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";

import { print } from "../bulletins/bulletinsController";

import { Picker } from '@react-native-picker/picker';
import DefaultButton from "../components/atoms/default-button";
import BigCard from "../components/atoms/big-card";
import { colors } from "../styles/colorPalette";

import { getConfigValue } from "../configStorage";

export default function bulletinsScreen() {
    
    // If paid with card, set bulletin "paid" property to true
    // If paid with cash, set bulletin "paid" property to false, so the money have to be collected by the responsible and delivered to the administer
    const payment_methods = {
        CASH: false,
        CARD: true
    }
    
    const [bulletinInfo, setBulletinInfo] = useState({
        "responsible": "",
        "duration": "",
        "registration": "",
        "price": "",
        "paid": true,
        "precept": "Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza.",
        "brand": "",
        "model": "",
        "color": "",
        "signature": "",
        "reference_id": "",
        "location": "Plaza de Toros"
    })


    useEffect(() => {
        getConfigValue("location")
            .then((location) => {
                updateBulletinInfo("location", location);
            })
            .catch((error) => {
                console.log(error)
                Alert.alert("Ha ocurrido un error obteniendo tu localización", "Por favor, añádela desde los ajustes y vuelve a esta página.");
            });
    }, []);
    
    
    // Simple function to update the bulletinInfo state
    function updateBulletinInfo(key, value) {
        setBulletinInfo((prevBulletinInfo) => ({
          ...prevBulletinInfo,
          [key]: value,
        }));
    }




    return(
        <View style={styles.container}>
            <BigCard imageUrl={ require("../../assets/bulletins/bulletin.png") } />
            
            <View style={styles.bulletin_info_form}>
                
                {/* --------- Required Information --------- */}
                <View style={styles.bulletin_info_section}>
                    <Text style={styles.label}>Datos requeridos</Text>

                                
                    <View style={styles.bulletin_inputs}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(registration) => 
                                updateBulletinInfo("registration", registration)
                            }
                            placeholder="Matricula"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(duration) => 
                                updateBulletinInfo("duration", duration)}
                            placeholder="Tiempo estacionado"
                            keyboardType="numeric"
                        />
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

                    {/* --------- Payment Method --------- */}
                    <View style={styles.centered_element}>
                        <Text style={styles.label}>Método de pago:</Text>

                        <View style={styles.selector}>
                            <TouchableOpacity 
                                style={[
                                    styles.selector_button, 
                                    {
                                        backgroundColor: (bulletinInfo["paid"]==payment_methods.CARD) ? 
                                            colors.light_green_selected: colors.light_green
                                    }
                                ]}
                                onPress={() => updateBulletinInfo("paid", true)}>
                                <Text>Tarjeta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.selector_button, 
                                    {
                                        backgroundColor: (bulletinInfo["paid"]==payment_methods.CASH) ? 
                                            colors.light_green_selected: colors.light_green
                                    }
                                ]}

                                onPress={() => updateBulletinInfo("paid", false)}>
                                <Text>Efectivo</Text>
                            
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>


                {/* --------- Vehicle Details (Not required) --------- */}
                <View style={styles.centered_element}>
                    <Text style={styles.label}>Datos Opcionales</Text>
                    <View style={styles.bulletin_inputs}>
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
        

                <DefaultButton onPress={() => print(bulletinInfo)} text="Imprimir" />
                
                
            </View> 
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
    bulletin_inputs: {
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        minHeight: 40,
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
    input: {
        backgroundColor: colors.white,
        borderColor: colors.dark_blue,
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 180,
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
    selector: {
        flexDirection: "row"
    },
    selector_button: {
        borderRadius: 20,
        marginHorizontal: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    
})
