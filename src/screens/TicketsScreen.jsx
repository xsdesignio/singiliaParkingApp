/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { colors } from "../styles/colorPalette";

// import { testPrint } from '../printing/ESCPOSCommands'
import { createAndPrintTicket } from "../tickets/ticketsController";
import { obtainAvailableTickets } from "../tickets/availableTickets";

import { usePrinter } from "../printing/PrintingProvider";

import DefaultButton from "../components/atoms/default-button";
import FormDate from "../components/forms/FormDate";
import FormRegistration from "../components/forms/FormRegistration";
import { formatDate } from "../date_utils";

export default function TicketsScreen() {
    const printer = usePrinter()

    const [isPrinting, setIsPrinting] = useState(false);
    const [availableTickets, setAvailableTickets] = useState([])
    const [availableTicket, setAvailableTicket] = useState()


    const payment_methods = Object.freeze({
        CASH: "CASH",
        CARD: "CARD"
    })

    const [ticketInfo, setTicketInfo] = useState({
        "registration": "-",
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
                setAvailableTicket(availableTickets[0])
            }
            else
                setAvailableTickets([])

        })
    }, [])



    useEffect(() => {
        if(!ticketInfo["registration"] || ticketInfo["registration"] == "")
            updateTicketInfo("registration", "-")
    }, [ticketInfo["registration"]])
    

    // Function that manages tickets printing to disactivate printing button during current printing and reset information
    async function printManager() {
        if (!isPrinting) {
            setIsPrinting(true);

            const creation_date = new Date(ticketInfo["created_at"])

            let info = ticketInfo

            creation_date.setMinutes(creation_date.getMinutes() + availableTicket.duration_minutes)
            
            info["finalization_time"] = formatDate(creation_date)

            let ticket_printed = await createAndPrintTicket(printer, info);

            if (ticket_printed) {
                // Reset data
                updateTicketInfo("registration", "-");
                updateTicketInfo("payment_method", undefined);
            }

            setIsPrinting(false)
        }
    }

    function setRegistration(value) {
        updateTicketInfo("registration", value)
        
    }


    function setDate(date) {
        updateTicketInfo("created_at", date)
    }



    return (
        <View style={styles.container}>
            <View style={styles.tickets_info_form}>
                <Text style={styles.title}>Creación de tickets</Text>

                <View style={styles.ticket_info_section}>

                    <FormRegistration registration={ticketInfo["registration"]} setRegistration={setRegistration} />

                    <Text style={styles.label}>Duración</Text>
                    <View style={styles.duration_picker_wraper}>
                        <Picker
                            style={styles.picker}
                            selectedValue={ticketInfo["duration"]}
                            onValueChange={(ticket) => {
                                if(ticket){
                                    updateTicketInfo("duration", ticket.duration)
                                    setAvailableTicket(ticket)
                                    updateTicketInfo("price", ticket.price)
                                }
                                
                            }}
                            itemStyle={styles.picker_item}
                        >
                            {/* Iterate the available tickets to get a picker item for each available ticket duration */}
                            {availableTickets.map((ticket) => {
                                return (
                                    <Picker.Item
                                        key={ticket.id}
                                        label={ticket.duration}
                                        value={ticket}
                                    />
                                )
                            })}
                        </Picker>
                    </View>
                    
                    <FormDate setDate={setDate}></FormDate>

                    <Text style={styles.label}>Precio:</Text>
                    <Text style={styles.price_text}>{ticketInfo["price"]}€</Text>

                    <Text style={styles.label}>Métodos de pago:</Text>

                    <View style={styles.selector}>
                        <TouchableOpacity
                            style={[
                                styles.selector_button,
                                {
                                    backgroundColor: (ticketInfo["payment_method"] == payment_methods.CARD) ?
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
                                    backgroundColor: (ticketInfo["payment_method"] == payment_methods.CASH) ?
                                        colors.light_green_selected : colors.light_green
                                }
                            ]}
                            onPress={() => updateTicketInfo("payment_method", payment_methods.CASH)}>
                            <Text style={styles.selector_text}>Efectivo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <DefaultButton onPress={() => printManager()} text={"imprimir"} />

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
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    },
})
