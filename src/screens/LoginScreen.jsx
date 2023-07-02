import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useState } from "react";

import { useFocusEffect, useNavigation  } from "expo-router";

import { loginUser } from "../session/sessionControler";
import DefaultButton from "../components/atoms/default-button";


export default function LoginScreen() {

    // Form data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const navigation = useNavigation();
    const [errorMessage, setErrorMessage] = useState("")

    function login() {
        // Login user and redirects to printing page if login successfull or show error message otherwise
        
        form = {
            'email': email,
            'password': password
        }

        loginUser(form).then((session) => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'tickets' }],
            });
        })
        .catch( error => {
            setErrorMessage(error)
        })

    }

    return(
        <View style={styles.container}>

            <Text style={styles.title}>Inicia sesión:</Text>
            
            <TextInput
                style={styles.input}
                onChangeText={(value) => {
                    setEmail(value)
                }}
                placeholder='email'
            />

            <TextInput
                style={styles.input}
                onChangeText={(value) => {
                    setPassword(value)
                }}
                secureTextEntry={true}
                placeholder='contraseña'
            />

            <View style={styles.buttonContainer}>
                <DefaultButton onPress={login} text={"Iniciar Sesión"} />
            </View>

            <Text style={styles.error}>{errorMessage}</Text>

        </View>
    )
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
    error: {
        color: "red",
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: 280,
        marginBottom: 20,
        borderWidth: 1, 
        borderColor: 'gray',
        borderRadius:  12,
    },
}
