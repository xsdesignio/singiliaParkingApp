import { StyleSheet, View, Text, Button } from "react-native";
import Menu from "../components/menu";


export default function zonesView() {
    return(<View style={styles.container}>
        <Text style={styles.title}>Actualmente en Plaza de Toros</Text>
        <View style={styles.container}>
            <Text>Cambiar Zona:</Text>
            <Text>Plaza de toros</Text>
            <Text>Coso Viejo</Text>
            <Text>Plaza del Pino</Text>
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
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    zone: {
        fontSize: 22,
    },

    buttonContainer: {
        marginTop: 20,
    },
    loginButton: {
        borderRadius: 12,
        paddingVertical: 20,
        width: 120,
        textTransform: 'none',
    }
}
