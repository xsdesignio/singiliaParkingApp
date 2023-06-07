import { StyleSheet, View, Text, Button } from "react-native";

import Menu from "../src/components/menu";



export default function ticketsView() {


    return(<View style={styles.container}>
        <View style={styles.container}>
            <Text style={styles.title}>Tickets impresos:</Text>
            <View style={styles.tickets}>
                <View style={styles.ticket}>
                    <Text>Localización: Plaza de Toros.</Text>
                    <Text>Responsable: Pablo Cortés</Text>
                    <Text>Duración: 2 horas</Text>
                    <Text>Creado el: 19-07-2023 18:00</Text>
                </View>
                <View style={styles.ticket}>
                    <Text>Localización: Plaza de Toros.</Text>
                    <Text>Responsable: Pablo Cortés</Text>
                    <Text>Duración: 1 horas</Text>
                    <Text>Creado el: 22-07-2023 16:00</Text>
                </View>
            </View>
        </View>
        <Menu/>
    </View>)
}


const styles = {
    container: {
        flex: 1,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tickets: {
        flex: 1,
        gap: 20,
    },
    ticket: {
        padding: 20,
        borderWidth: 1, 
        borderColor: 'gray',
        backgroundColor: '#C1DFDC',
        borderRadius:  4,
    }
}
