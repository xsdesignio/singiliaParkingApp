import { StyleSheet, View, Text, Button, TextInput } from "react-native";
import { Link } from 'expo-router';

import {printTicket} from "../components/ticketsPrinting";

import Menu from "../components/menu";
import { useState } from "react";


export default function printingView() {

    const [duration, setDuration] = useState(0)

    function handleDuration (values) {
        const numericValue = values.replace(/[^0-9]/g, '');
        setDuration(numericValue);
    }

    return(<View>
        <View style={styles.container}>
            <Text style={styles.title}>Actualmente en Plaza de Toros</Text>
            <Text>Imprimir ticket</Text>
            <TextInput
                style={styles.input}
                onChangeText={(values) => handleDuration(values)}
                keyboardType="numeric"
                placeholder="duracion (horas)"
            />
            <Button
                title="Imprimir"
                onPress={() => printTicket(duration)}
            />
        </View>
        <Menu/>
    </View>)
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FFFF',
        marginTop: 40,
        marginBottom: 40
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: "center",
        width: "60%"
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
        width: "80%"
    },
    input: {
        borderWidth: 1,
        borderColor: 'darkblue',
        textAlign: "center",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }
    
})
