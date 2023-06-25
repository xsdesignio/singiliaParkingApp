import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";

export default function SettingsScreen() {

    async function logout() {
        await fetch( `${ apiHost }/auth/logout`)
        await deleteSession()
        setLoggedIn(false)
    }

    return(
        <View style={styles.container}>

            <Text style={styles.title}>Ajustes:</Text>

            <View>
                <Text>Impresión</Text>
            </View>

            <View>
                <Text>Boletines</Text>
                <Text>Número de copias de impresión:</Text>
            </View>

            <View>
                <Text>Sesión</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={logout}
                >
                    <Text style={styles.button_text}>
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>
            </View>
            
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
    button: {
        backgroundColor: "#559f97",
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white',
        borderRadius: 20
    },
    button_text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 8,
    }
}