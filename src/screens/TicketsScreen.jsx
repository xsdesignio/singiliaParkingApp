/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

import { Picker } from '@react-native-picker/picker';
import { colors } from "../styles/colorPalette";

import { createAndPrintTicket } from "../tickets/ticketsController";

import { usePrinter } from "../printing/PrintingProvider";

import DefaultButton from "../components/atoms/default-button";


export default function TicketsScreen() {

    const [registration, setRegistration] = useState("")

    const payment_methods = Object.freeze({
        CASH: "CASH",
        CARD: "CARD"
    })

    const [paymentMethod, setPaymentMethod] = useState(null)


    const [duration, setDuration] = useState(30)


    const printer = usePrinter()

    
    function printManager() {
        
        createAndPrintTicket(printer, duration, registration, paymentMethod);

        setPaymentMethod(null);
        setRegistration("");
    }

    return(
        <View style={styles.container}>
            <View style={styles.tickets_info_form}>
                <Text style={styles.title}>Creación de tickets</Text>

                <View style={styles.ticket_info_section}>

                    <Text style={styles.label}>Matrícula</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="characters"
                        onChangeText={(value) => setRegistration(value)}
                        placeholder="0000BBB"
                    />

                    <Text style={styles.label}>Duración</Text>
                    <View style={styles.duration_picker_wraper}>
                        <Picker
                            style={styles.picker}
                            selectedValue={duration}
                            onValueChange={(duration) => 
                                    setDuration(duration)
                            }
                            itemStyle={styles.picker_item}
                        >
                            <Picker.Item
                                label="30 minutos"
                                value={30}
                            />
                            <Picker.Item
                                label="60 minutos"
                                value={60}
                            />
                            <Picker.Item
                                label="90 minutos"
                                value={90}
                            />
                            <Picker.Item
                                label="120 minutos"
                                value={120}
                            />
                        </Picker>
                    </View>


                    <Text style={styles.label}>Métodos de pago:</Text>
                    
                    <View style={styles.selector}>
                        <TouchableOpacity 
                            style={[
                                styles.selector_button, 
                                {
                                    backgroundColor: (paymentMethod==payment_methods.CARD) ? 
                                        colors.light_green_selected : colors.light_green
                                }
                            ]}
                            onPress={() => setPaymentMethod(payment_methods.CARD)}>
                            <Text>Tarjeta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.selector_button, 
                                {
                                    backgroundColor: (paymentMethod==payment_methods.CASH) ? 
                                        colors.light_green_selected : colors.light_green
                                }
                            ]}
                            onPress={() => setPaymentMethod(payment_methods.CASH)}>
                            <Text>Efectivo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <DefaultButton onPress={() => printManager()} text={"imprimir"}/>

        </View>
    )
}

let styles = StyleSheet.create({
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
        borderColor: colors.dark_green,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: "100%",
    },

    input: {
        backgroundColor: colors.white,
        borderColor: colors.dark_green,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        width: 280,
    },

    label: {
        color: colors.black,
        fontSize: 16,
        marginBottom: 6,
        marginTop: 18,
    },

    picker: {
        width: 280,
    },

    
    selector: {
        flexDirection: "row",
        marginTop: 10
    },
    
    selector_button: {
        borderColor: colors.dark_green,
        borderRadius: 20,
        borderWidth: 1,
        marginHorizontal: 6,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    
    ticket_info_section: {
        alignItems: "center",
        justifyContent: "center",
    },
    tickets_info_form: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 0,
        minHeight: 180,
        zIndex: 10,
    },
    title: {
        color: colors.black,
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    },
})
