import { ScrollView, StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { useState } from "react";

import {printTicket} from "../components/ticketsPrinting";
export default function PrintingScreen() {

    const [duration, setDuration] = useState(0)

    const [availableTickets, setAvailableTickets] = useState([
        {
            imageUrl: require("../assets/ticket_yellow.png"),
            duration: "",
            color: "yellow",
        },
        {
            imageUrl: require("../assets/ticket_green.png"),
            duration: "",
            color: "green",
        },
        {
            imageUrl: require("../assets/ticket_yellow.png"),
            duration: "",
            color: "red",
        },
        {
            imageUrl: require("../assets/ticket_green.png"),
            duration: "",
            color: "orange",
        },
    ])

    const [selectedTicket, setSelectedTicket] = useState(availableTickets[0])

    function handleDuration (value) {
        const numericValue = value.replace(/[^0-9]/g, '');
        setDuration(numericValue);
    }
    function handleRegistration(value) {

    }

    return(
        <View style={styles.container}>
            
            <View 
                style={styles.tickets}>

                <Image style={styles.ticket_image} source={selectedTicket.imageUrl} />
            </View>

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
                    onChangeText={(values) => handleDuration(values)}
                    placeholder="Matricula"
                />
                <TouchableOpacity
                    style={styles.print_button}
                    onPress={() => printTicket(duration)}
                >
                    <Text style={styles.print_button_text}>
                        Imprimir
                    </Text>
                </TouchableOpacity>
            </View>
        </View>)
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FFFF',
        marginTop: 60,
        marginBottom: 40
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: "center",
        width: "60%"
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
        width: "80%"
    },
    ticket_image: {
        height: 200,
        width: 350,
        borderRadius: 4,
        padding: 20,
        borderWidth: 2,
        borderColor: '#00b3ff',
    },
    available_tickets: {
        justifyContent: "center",
        alignItems: "center",
        height: 140,
        width: "110%",
        marginVertical: 20,
        paddingVertical: 4,
        backgroundColor: "white",
    },
    tickets_selector: {
        height: 0,
        flexDirection: 'row',
        padding: 4,
        marginHorizontal: 20,
        marginVertical: 0,
        gap: 10,
    },
    ticket_selector_image: {
        height: 100,
        width: 175,
        borderRadius: 4,
        padding: 20,
    },
    ticket_button: {
        margin: 10,
    },
    ticket_info: {
        flex: 1,
        gap: 10,
        marginTop: -20,
        minHeight: 40
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 200,
    },
    print_button: {
        backgroundColor: "#559f97",
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white',
        borderRadius: 20
    },
    print_button_text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 8,
    }
    
})
