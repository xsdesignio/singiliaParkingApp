import { StyleSheet, View, Text, Button } from "react-native";
import Menu from "../components/menu";


export default function zonesView() {
    return(<View style={styles.container}>
        <View style={styles.container}>
            <Text style={styles.title}>Actualmente en Plaza de Toros</Text>
            <Text>Cambiar Zona:</Text>
            <Text style={styles.selected_zone}>Plaza de toros</Text>
            <Text style={styles.zone}>Coso Viejo</Text>
            <Text style={styles.zone}>Plaza del Pino</Text>
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
        textAlign: "center",
        width: "50%",
    },
    zone: {
        fontSize: 20,
        padding: 10,
        backgroundColor: "#C1DFDC",
        borderRadius: 8,
    },
    selected_zone: {
        fontSize: 20,
        padding: 10,
        backgroundColor: "#C1DFDC",
        borderRadius: 8,
        borderWidth: 2, 
        borderColor: 'lightblue',
        borderRadius:  4,
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
