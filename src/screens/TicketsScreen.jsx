import React from "react";
import { ScrollView, StyleSheet, View, Text, TextInput, Image, TouchableOpacity } from "react-native";

import { useState } from "react";

import { colors } from "../styles/colorPalette";

import { createAndPrintTicket } from "../tickets/ticketsController";

import DefaultButton from "../components/atoms/default-button";
import BigCard from "../components/atoms/big-card";


export default function TicketsScreen() {

    const [registration, setRegistration] = useState("")

    const payment_methods = Object.freeze({
        CASH: "CASH",
        CARD: "CARD"
    })

    const [paymentMethod, setPaymentMethod] = useState(null)

    const availableTickets = [
        {
            imageUrl: require("../../assets/tickets/30.png"),
            duration: 30,
            color: "yellow",
        },
        {
            imageUrl: require("../../assets/tickets/60.png"),
            duration: 60,
            color: "green",
        },
        {
            imageUrl: require("../../assets/tickets/90.png"),
            duration: 90,
            color: "red",
        },
        {
            imageUrl: require("../../assets/tickets/120.png"),
            duration: 120,
            color: "orange",
        },
    ]

    const [selectedTicket, setSelectedTicket] = useState(availableTickets[0])

    function printManager() {
        createAndPrintTicket(selectedTicket.duration, registration, paymentMethod)
    }
    

    return(<View style={styles.container}>
            <BigCard imageUrl={selectedTicket.imageUrl} />

            <View style={styles.available_tickets}>
                <ScrollView style={styles.tickets_selector} horizontal={true}>

                    { availableTickets.map(element => 
                        (<TouchableOpacity 
                            style={styles.ticket_button}
                            onPress={() => {
                                setSelectedTicket(element)
                            }}
                            key={element.color}
                            >
                            <Image style={styles.ticket_selector_image} source={element.imageUrl} />
                        </TouchableOpacity>)
                    )}
                </ScrollView>
            </View>
                
            <View style={styles.ticket_info}>

                <TextInput
                    style={styles.input}
                    autoCapitalize="characters"
                    onChangeText={(value) => setRegistration(value)}
                    placeholder="Matricula"
                />

                <Text style={styles.normal_text}>Métodos de pago:</Text>
                
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

                <DefaultButton onPress={() => printManager()} text={"imprimir"}/>
            </View>
        </View>)
}

let styles = StyleSheet.create({
    available_tickets: {
        alignItems: "center",
        height: 142,
        justifyContent: "center",
        marginBottom: 10,
        width: "110%",
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
        paddingVertical: 10
    },
    

    ticket_button: {
        margin: 10,
    },
    
    ticket_info: {
        alignItems: 'center',
        backgroundColor: colors.green,
        flex: 1,
        gap: 10,
        minHeight: 40,
    },
    
    ticket_selector_image: {
        borderRadius: 4,
        height: 110,
        padding: 20,
        width: 192.5,
    },
    tickets_selector: {
        backgroundColor: colors.dark_green,
        flexDirection: 'row',
        gap: 10,
        marginHorizontal: 40,
        marginVertical: 0,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    
    
})
