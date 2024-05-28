/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../../styles/colorPalette";


export default function FormRegistration({registration, setRegistration}) {

    const [numbers, setNumbers] = useState("")
    const [letters, setLetters] = useState("")


    const handleNumbersChange = (value) => {
        // Remove spaces and limit to 4 characters
        const cleanedValue = value.replace(/[^0-9]/g, '');
        setNumbers(cleanedValue);
    };

    const handleLettersChange = (value) => {
        // Remove spaces and limit to 3 characters
        const cleanedValue = value.replace(/[^A-Za-z]/g, '');
        setLetters(cleanedValue);
    };

    // Extract numbers and letters from registration each time it changes
    // Uses regular expressions to extract the values from the registration string
    useEffect(() => {
        
        if(registration) {
            if(registration.match(/\d+/g))
                setNumbers(registration.match(/\d+/g).join(''))
            else setNumbers("")
            if(registration.match(/[A-Za-z]+/g))
                setLetters(registration.match(/[A-Za-z]+/g).join(''))
            else setLetters("")
        }

    }, [registration])

    useEffect(() => {
        updateResitration()
    }, [numbers, letters])

    function updateResitration() {
        let registration = numbers + letters;
        if(registration.length < 1)
            return
        setRegistration(registration)
    }
    return (
        <View style={styles.registration_wrapper}>
            <Text style={styles.label}>Matrícula</Text>
            <View style={styles.inputs_wrapper}>
                <TextInput
                    style={styles.input}
                    autoCapitalize="characters"
                    value={numbers}
                    keyboardType="numeric"
                    onChangeText={(value) => handleNumbersChange(value)}
                    placeholder="0000"
                    maxLength={4}
                />

                <TextInput
                    style={styles.input}
                    autoCapitalize="characters"
                    value={letters}
                    onChangeText={(value) => handleLettersChange(value)}
                    placeholder="AAA"
                    maxLength={3}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({

    input: {
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        margin: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        width: 140,
    },
    inputs_wrapper: {
        flexDirection: 'row',
    },
    label: {
        color: colors.dark_green,
        fontSize: 16,
        marginBottom: 6,
        marginTop: 18,
    },
    registration_wrapper: {
        alignItems: "center",
        textAlign: "center",
    }
    
})
