/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors } from "../../styles/colorPalette";



export default function SecondaryButton({text, onPress}){

    return(
        <TouchableOpacity style={styles.print_button} onPress={onPress}>
            <Text style={styles.print_button_text}>
                {text}
            </Text>
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    print_button: {
        backgroundColor: colors.light_green_selected,
        borderColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        elevation: 10,
        margin: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    print_button_text: {
        borderRadius: 8,
        color: colors.dark_green,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})

