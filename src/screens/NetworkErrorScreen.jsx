import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../styles/colorPalette";
import Ionicons from 'react-native-vector-icons/Ionicons';


// eslint-disable-next-line react/prop-types
export default function NetworkErrorScreen() {

    return(
        <View style={styles.container}>
            {/* Create an image with a width and height of 50px */}  
            <Ionicons name="wifi" size={50} color={colors.dark_green}/>

            <Text style={styles.title}>Error de conexión.</Text>
            
            <Text style={styles.normal_text}>
                Necesitas conexión a internet para poder utilizar esta aplicación.
            </Text>
            <Text style={styles.normal_text}>
                Comprueba tu conexión a internet.
            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        gap: 10,
        justifyContent: 'center',
    },
    normal_text: {
        color: colors.dark_green,
        fontSize: 14,
        paddingHorizontal: 20,
        paddingVertical: 6,
        textAlign: "center",
    },
    title: {
        color: colors.dark_green,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
    },
    
    
})
