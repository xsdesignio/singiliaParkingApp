/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { colors } from "../styles/colorPalette";

// import { testPrint } from '../printing/ESCPOSCommands'
import { createAndPrintTicket } from "../tickets/ticketsController";
import { obtainAvailableTickets } from "../tickets/availableTickets";

import { usePrinter } from "../printing/PrintingProvider";

import DefaultButton from "../components/atoms/default-button";


export default function TicketsScreen() {
    const printer = usePrinter()

    const [isPrinting, setIsPrinting] = useState(false);
    const [availableTickets, setAvailableTickets] = useState([])
    const payment_methods = Object.freeze({
        CASH: "CASH",
        CARD: "CARD"
    })

    const [ticketInfo, setTicketInfo] = useState({
        "registration": "",
        /* "payment_method": undefined, */
        "duration": "",
        "price": undefined,
        "payment_method": undefined,
    })

    // Simple function to update the bulletinInfo state
    function updateTicketInfo(key, value) {
        setTicketInfo((prevBulletinInfo) => ({
          ...prevBulletinInfo,
          [key]: value,
        }));
    }


    useEffect(() => {
        // testPrint()
        obtainAvailableTickets().then(available_tickets => {
            if (availableTickets.length == 0 && available_tickets != null) {
                setAvailableTickets(available_tickets.reverse())
                updateTicketInfo("duration", availableTickets[0].duration)
                updateTicketInfo("price", availableTickets[0].price)
            }
            else
                setAvailableTickets([])

        })
    }, [])


    // Function that manages tickets printing to disactivate printing button during current printing and reset information
    async function printManager() {

        if(!isPrinting) {
            setIsPrinting(true);

            await createAndPrintTicket(printer, ticketInfo);

            // Reset data
            updateTicketInfo("registration", "");
            updateTicketInfo("payment_method", undefined);

            setIsPrinting(false)
        }
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
                        value = {ticketInfo["registration"]}
                        onChangeText={(value) => updateTicketInfo("registration", value)}
                        placeholder="0000BBB"
                    />

                    <Text style={styles.label}>Duración</Text>
                    <View style={styles.duration_picker_wraper}>
                        <Picker
                                style={styles.picker}
                                selectedValue={ticketInfo["duration"]}
                                onValueChange={(duration) =>  {
                                    updateTicketInfo("duration", duration)

                                    const selectedTicket = availableTickets.find((ticket) => ticket.duration === duration);
                                    if (selectedTicket) {
                                        updateTicketInfo("price", selectedTicket.price)
                                    }
                                }}
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

                    <Text style={styles.label}>Precio:</Text>
                    <Text style={styles.price_text}>{ticketInfo["price"]}€</Text>

                    <Text style={styles.label}>Métodos de pago:</Text>
                    
                    <View style={styles.selector}>
                        <TouchableOpacity 
                            style={[
                                styles.selector_button, 
                                {
                                    backgroundColor: (ticketInfo["payment_method"]==payment_methods.CARD) ? 
                                        colors.light_green_selected : colors.light_green
                                }
                            ]}
                            onPress={() => updateTicketInfo("payment_method", payment_methods.CARD)}>
                            <Text style={styles.selector_text}>Tarjeta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.selector_button, 
                                {
                                    backgroundColor: (ticketInfo["payment_method"]==payment_methods.CASH) ? 
                                        colors.light_green_selected : colors.light_green
                                }
                            ]}
                            onPress={() => updateTicketInfo("payment_method", payment_methods.CASH)}>
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

    price_text: {
        color: colors.dark_green,
        fontSize: 20,
        fontWeight: "bold",
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
        marginBottom: -40,
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
