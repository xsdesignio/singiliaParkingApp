import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";


import { loginUser } from "../session/sessionControler";
import { useLogin } from "../session/LoginProvider";
import DefaultButton from "../components/atoms/default-button";

import { colors } from "../styles/colorPalette";
import Logo from "../components/atoms/logo";


// eslint-disable-next-line react/prop-types
export default function LoginScreen() {

    const { setIsLoggedIn } = useLogin()

    // Form data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [errorMessage, setErrorMessage] = useState("")

    function login() {
        // Login user and redirects to printing page if login successfull or show error message otherwise
        
        let form = {
            'email': email,
            'password': password
        }

        loginUser(form).then((session) => {
            if(session == null) 
                throw Error("Ha ocurrido un error a la hora de iniciar sesión")
            
            // eslint-disable-next-line react/prop-types
            setIsLoggedIn(true)
        })
        .catch( error => {
            setErrorMessage(error)
        })

    }

    return(
        <View style={styles.container}>
            {/* Create an image with a width and height of 50px */}  
            <Logo></Logo>
            <Text style={styles.title}>Inicio de sesión:</Text>
            
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
            { errorMessage != "" && <Text style={styles.error}>{errorMessage}</Text> }

            <View style={styles.buttonContainer}>
                <DefaultButton onPress={login} text={"Iniciar Sesión"} />
            </View>

            <Text style={styles.normal_text}>
                Administración de zona azul de parking en Antequera.
            </Text>
            <Text style={styles.normal_text_small}>
                Página solo disponible para Administradores.
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
    error: {
        backgroundColor: colors.white,
        borderRadius: 12,
        color: colors.error_color,
        fontSize: 14,
        margin: 10,
        padding: 14,
        textAlign: "center",
    },
    input: {
        backgroundColor: colors.white,
        borderColor: colors.dark_green,
        borderRadius:  12,
        borderWidth: 1, 
        marginBottom: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: 280,
    },
    normal_text: {
        color: colors.dark_green,
        fontSize: 14,
        paddingHorizontal: 20,
        paddingVertical: 6,
        textAlign: "center",
    },

    normal_text_small: {
        color: colors.dark_green,
        fontSize: 12,
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
