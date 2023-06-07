import { ScrollView, StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';

import {printTicket} from "../src/components/ticketsPrinting";

import Menu from "../src/components/menu";
import { useState } from "react";


export default function printingView() {

    const [duration, setDuration] = useState(0)

    function handleDuration (value) {
        const numericValue = value.replace(/[^0-9]/g, '');
        setDuration(numericValue);
    }
    function handleRegistration(value) {

    }

    return(<View>
        <View style={styles.container}>
            <View style={styles.tickets}>
                <Image style={styles.ticket_image} source={require("../assets/ticket_yellow.png")} />
            </View>
            <View style={styles.available_tickets}>

                <Text>Tickets disponibles:</Text>
                <ScrollView style={styles.tickets_selector} horizontal={true}>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Text>Media hora</Text>
                        <Image style={styles.ticket_selector_image} source={require("../assets/ticket_yellow.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Text>Una hora</Text>
                        <Image style={styles.ticket_selector_image} source={require("../assets/ticket_green.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Text>Hora y media</Text>
                        <Image style={styles.ticket_selector_image} source={require("../assets/ticket_yellow.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Text>Dos horas</Text>
                        <Image style={styles.ticket_selector_image} source={require("../assets/ticket_green.png")} />
                    </TouchableOpacity>
                </ScrollView>
            </View>
                
            <View style={styles.ticket_info}>
                <Text>Imprimir ticket</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(values) => handleDuration(values)}
                    placeholder="Matricula"
                />
                <Button
                    title="Imprimir"
                    onPress={() => printTicket(duration)}
                />
            </View>
            
        </View>
        <Menu/>
    </View>)
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FFFF',
        marginTop: 100,
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
    available_tickets: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#c9ffdb',
        height: 160,
        width: "100%",
        marginVertical: 20,
        marginHorizontal: 20,
        paddingVertical: 4,
    },
    ticket_image: {
        height: 200,
        width: 350,
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: '#00b3ff',
        padding: 10,
    },
    ticket_button: {
        margin: 10,
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
        height: 75,
        width: 131.25,
        borderRadius: 12,
        padding: 20,
        padding: 10,
    },
    ticket_info: {
        flex: 1,
        gap: 10,
        marginTop: -40,
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
      }
    
})
