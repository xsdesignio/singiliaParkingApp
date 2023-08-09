import React from "react";
import { View, Text, TextInput} from "react-native";
import { useState } from "react";


import { loginUser } from "../session/sessionControler";
import DefaultButton from "../components/atoms/default-button";

import { colors } from "../styles/colorPalette";


// eslint-disable-next-line react/prop-types
export default function LoginScreen({ navigation }) {

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
            navigation.navigate('Tickets')
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
        color: colors.white,
    },
    error: {
        color: colors.error_color,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: 280,
        marginBottom: 20,
        borderWidth: 1, 
        borderColor: colors.dark_green,
        borderRadius:  12,
        backgroundColor: colors.white,
    },
}
