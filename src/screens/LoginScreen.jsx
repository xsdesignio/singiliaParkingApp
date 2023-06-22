import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useState } from "react";

import { useFocusEffect, useNavigation  } from "expo-router";

import { storeSession  } from "../storage/sessionStorage";


const apiHost = "http://192.168.1.40:5000"

export default function LoginScreen() {

    const navigation = useNavigation();

    const [responseText, setResponseText] = useState("")


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function login() {
        login_form = {
            'email': email,
            'password': password
        }

        fetch( `${ apiHost }/auth/login` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login_form)
        })
        .then( response_json => {
            if(response_json.status != 200)
                throw new Error("Los datos introducidos son incorrectos o no se encuentra conectado a internet.")
            session_response = response_json.json()
            return session_response
        })
        .then( session => {
            storeSession(session)
            navigation.reset({
                index: 0,
                routes: [{ name: 'printing' }],
              });
        })
        .catch(error => setResponseText(error.toString()))
    }

    

    return(<View style={styles.container}>
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
            <TouchableOpacity
                style={styles.print_button}
                    onPress={login}
                >
                <Text style={styles.print_button_text}>
                    Iniciar sesión
                </Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.error}>{responseText}</Text>
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
    print_button: {
        backgroundColor: "#559f97",
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white',
    },
    print_button_text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 8,
    }
}
