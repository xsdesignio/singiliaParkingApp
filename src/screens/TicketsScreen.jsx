import { ScrollView, StyleSheet, View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";

import { useState } from "react";

import { createTicket, printTicket } from "../tickets/ticketsController";
import DefaultButton from "../components/atoms/default-button";
import BigCard from "../components/atoms/big-card";

export default function TicketsScreen() {

    const [registration, setRegistration] = useState("")

    // cash set bulletin "paid" property to false
    // card set bulletin "paid" property to true
    const payment_methods = {
        CASH: false,
        CARD: true
    }

    const [paymentMethod, setPaymentMethod] = useState(payment_methods.CARD)

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

    
    function print() {
        createTicket(selectedTicket.duration, registration, paymentMethod)
        .then((ticket) => {
            printTicket(ticket).catch((error) => {
                Alert.alert("No se ha podido imprimir el ticket.", error)
            })
            Alert.alert("Ticket impreso", ticket["registration"])
        })
        .catch((error) => {
            Alert.alert("No se ha podido crear el ticket.", error)
        })
    }

    return(
        <View style={styles.container}>
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
                    onChangeText={(value) => setRegistration(value)}
                    placeholder="Matricula"
                />

                <Text style={styles.normal_text}>Métodos de pago:</Text>
                
                <View style={styles.selector}>
                    <TouchableOpacity 
                        style={[
                            styles.selector_button, 
                            {backgroundColor: (paymentMethod==payment_methods.CARD) ? "#95e8c9": "#d4faec"}]
                        }
                        onPress={() => setPaymentMethod(payment_methods.CARD)}>
                        <Text>Tarjeta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.selector_button, 
                            {backgroundColor: (paymentMethod==payment_methods.CASH) ? "#95e8c9": "#d4faec"}]
                        }
                        onPress={() => setPaymentMethod(payment_methods.CASH)}>
                        <Text>Efectivo</Text>
                    </TouchableOpacity>
                </View>

                <DefaultButton onPress={print} text={"imprimir"}/>
            </View>
        </View>)
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    normal_text: {
        fontSize: 16,
        color: 'white',
    },
    selector: {
        flexDirection: "row"
    },
    selector_button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        borderRadius: 20
    },
    available_tickets: {
        justifyContent: "center",
        alignItems: "center",
        height: 142,
        width: "110%",
        marginBottom: 10,
    },
    tickets_selector: {
        flexDirection: 'row',
        paddingVertical: 4,
        paddingHorizontal: 4,
        marginHorizontal: 40,
        marginVertical: 0,
        backgroundColor: "#35523e",
        gap: 10,
    },
    ticket_selector_image: {
        height: 110,
        width: 192.5,
        borderRadius: 4,
        padding: 20,
    },
    ticket_button: {
        margin: 10,
    },
    ticket_info: {
        flex: 1,
        gap: 10,
        alignItems: 'center',
        minHeight: 40,
        backgroundColor: "#60826a",
    },
    tickets: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: 'darkblue',
        borderRadius: 5,
        backgroundColor: 'white',
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 280,
    },
    
})
