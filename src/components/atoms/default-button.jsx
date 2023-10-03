/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors } from "../../styles/colorPalette";



export default function DefaultButton({text, onPress}){

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
        backgroundColor: colors.green_button,
        borderRadius: 12,
        color: colors.background,
        elevation: 10,
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: colors.white,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        width: 280,
    },
    print_button_text: {
        borderRadius: 8,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})

