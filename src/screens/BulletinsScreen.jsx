/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';

import { createAndPrintBulletin } from "../bulletins/bulletinsController";
import { usePrinter } from "../printing/PrintingProvider";

import DefaultButton from "../components/atoms/default-button";
import SecondaryButton from "../components/atoms/secondary-button";
import { colors } from "../styles/colorPalette";

import FormDate from "../components/forms/FormDate";
import FormRegistration from "../components/forms/FormRegistration";

// import { getConfigValue } from "../configStorage";

export default function BulletinsScreen() {

    const [bulletinInfo, setBulletinInfo] = useState({
        "registration": "-",
        "precept": "Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza.",
        "brand": "",
        "model": "",
        "color": "",
    })
    
    const [isPrinting, setIsPriting] = useState(false);

    // Simple function to update the bulletinInfo state
    function updateBulletinInfo(key, value) {
        setBulletinInfo((prevBulletinInfo) => ({
            ...prevBulletinInfo,
            [key]: value,
        }));
    }

    // elements required to reset date
    const formDateRef = useRef();
    const handleReset = () => {
        if (formDateRef.current) {
            formDateRef.current.resetTimeInputs();
        } 
    };

    const printer = usePrinter()

    async function printManager() {

        if (!isPrinting) {
            setIsPriting(true);

            let info = bulletinInfo

            const bulletin_created = await createAndPrintBulletin(printer, info);
            if(bulletin_created) {
                setBulletinInfo({
                    "registration": "-",
                    "paid": false,
                    "precept": "Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza.",
                    "brand": "",
                    "model": "",
                    "color": "",
                })
                handleReset()
            }
            setIsPriting(false);
        }
    }


    const [showOptionalData, setShowOptionalData] = useState(false)

    function setRegistration(registration) {
        updateBulletinInfo("registration", registration)
    }

    
    function setDate(date) {
        updateBulletinInfo("created_at", date)
    }



    return (
        <View style={styles.container}>

            <View style={styles.bulletin_info_form}>
                <Text style={styles.title}>Creación de Boletines</Text>

                {/* --------- Required Information --------- */}
                <View style={styles.bulletin_info_section}>

                    <FormRegistration setRegistration={setRegistration} registration={bulletinInfo["registration"]}></FormRegistration>

                    {/* --------- Precept --------- */}
                    <Text style={styles.label}>Precepto Infringido:</Text>

                    <View style={styles.picker_wraper}>
                        <Picker
                            style={styles.picker}
                            selectedValue={bulletinInfo["precept"]}
                            onValueChange={(precept) =>
                                updateBulletinInfo("precept", precept)
                            }
                            onFocus={() => setShowOptionalData(false)}
                            itemStyle={styles.picker_item}
                        >
                            <Picker.Item
                                label="Estacionar sin ticket de aparcamiento"
                                value="Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza."
                            />
                            <Picker.Item
                                label="Rebasar el horario de permanencia asociado"
                                value="Rebasar el horario de permanencia asociado. Art. 14 Ordenanza."
                            />
                            <Picker.Item
                                label="No colocar el ticket de forma visible"
                                value="No colocar el ticket de forma visible. Art. 14 Ordenanza."
                            />
                        </Picker>
                    </View>

                    <FormDate ref={formDateRef} setDate={setDate} daysActive={false}></FormDate>
                </View>


                {/* --------- Vehicle Details (Not required) --------- */}
                <View style={styles.centered_element}>
                    {showOptionalData ?
                        (<>
                            <TextInput
                                style={styles.input}
                                value={bulletinInfo["brand"]}
                                onChangeText={(brand) =>
                                    updateBulletinInfo("brand", brand)}
                                placeholder="Marca"
                            />

                            <TextInput
                                style={styles.input}
                                value={bulletinInfo["model"]}
                                onChangeText={(model) =>
                                    updateBulletinInfo("model", model)}
                                placeholder="Modelo"
                            />

                            <TextInput
                                style={styles.input}
                                value={bulletinInfo["color"]}
                                onChangeText={(color) =>
                                    updateBulletinInfo("color", color)}
                                placeholder="Color"
                            />
                            <SecondaryButton text={"Cerrar"} onPress={() => setShowOptionalData(!showOptionalData)} />
                            <View style={styles.margin} />

                        </>
                        ) : (
                            <SecondaryButton text={"Añadir datos opcionales"} onPress={() => setShowOptionalData(!showOptionalData)} />
                        )}

                </View>
            </View>

            <DefaultButton onPress={(printManager)} text="Imprimir" />
        </View>
    )
}

let styles = StyleSheet.create({
    bulletin_info_form: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 80,
    },
    bulletin_info_section: {
        alignItems: "center",
        justifyContent: "center",
    },
    centered_element: {
        alignItems: "center",
        paddingVertical: 10
    },

    container: {
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'flex-start',
        paddingVertical: 20,
    },

    input: {
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        width: 280,
    },
    label: {
        color: colors.dark_green,
        fontSize: 16,
        marginBottom: 6,
        marginTop: 18,
    },
    margin: {
        height: 60
    },
    picker: {
        width: 280,
    },

    picker_item: {
        color: colors.dark_green,
        fontSize: 16,
    },
    picker_wraper: {
        alignItems: "center",
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: 280,
    },
    title: {
        color: colors.dark_green,
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    },

})
