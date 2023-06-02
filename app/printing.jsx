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
            <Text>Imprimir ticket</Text>
            <Text>Duración:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(values) => handleDuration(values)}
                keyboardType="numeric"
                placeholder="duracion"
            />
            <Button
                title="Imprimir"
                onPress={() => printTicket(duration)}
            />
            <Link href='/login'>Login</Link>
        </View>
        <Menu/>
    </View>)
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FFFF',
        marginTop: 40
    },
    
})
