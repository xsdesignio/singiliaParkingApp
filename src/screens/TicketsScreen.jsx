/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { colors } from "../styles/colorPalette";

import { createAndPrintTicket } from "../tickets/ticketsController";
import { obtainAvailableTickets } from "../tickets/availableTickets";

import { usePrinter } from "../printing/PrintingProvider";

import DefaultButton from "../components/atoms/default-button";


export default function TicketsScreen() {

    const [registration, setRegistration] = useState("")

    const payment_methods = Object.freeze({
        CASH: "CASH",
        CARD: "CARD"
    })

    const [duration, setDuration] = useState()
    
    const [availableTickets, setAvailableTickets] = useState([])

    useEffect(() => {
        obtainAvailableTickets().then(available_tickets => {
            if (available_tickets != null) {
                setAvailableTickets(available_tickets.reverse())
                setDuration(availableTickets[0].duration)
            }
            else
                setAvailableTickets([])

            console.log(availableTickets)
        })
    }, [])

    const [paymentMethod, setPaymentMethod] = useState(null)


    const printer = usePrinter()

    
    async function printManager() {
        
        await createAndPrintTicket(printer, duration, registration, paymentMethod);

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
                        value = {registration}
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
                            {/* Iterate the available tickets to get a picker item for each available ticket duration */}
                            {availableTickets.map((ticket) => {
                                return(
                                    <Picker.Item
                                        style={styles.picker_item}
                                        key={ticket.id}
                                        label={ticket.duration}
                                        value={ticket.duration}
                                    />
                                )
                            })}
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
                            <Text style={styles.selector_text}>Tarjeta</Text>
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
                            <Text style={styles.selector_text}>Efectivo</Text>
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
        justifyContent: 'flex-start',
        paddingVertical: 20,
    },


    duration_picker_wraper: {
        alignItems: "center",
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: "100%",
    },

    input: {
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
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

    picker: {
        width: 280,
    },
    picker_item: {
        color: colors.dark_green,
    },

    
    selector: {
        flexDirection: "row",
        marginTop: 10
    },
    
    selector_button: {
        borderColor: colors.input_border,
        borderRadius: 20,
        borderWidth: 1,
        marginHorizontal: 6,
        paddingHorizontal: 20,
        paddingVertical: 10
    },

    selector_text: {
        color: colors.dark_green,
    },
    
    ticket_info_section: {
        alignItems: "center",
        justifyContent: "center",
    },
    tickets_info_form: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        marginBottom: 40,
        minHeight: 180,
    },
    title: {
        color: colors.dark_green,
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    },
})
