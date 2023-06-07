import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { useState } from "react";

import { useFocusEffect, useNavigation  } from "expo-router";




export default function loginView() {

    const navigation = useNavigation();

    const [responseText, setResponseText] = useState("")


    useFocusEffect(() => {
      // When the page comes into focus, hide the base layout
      navigation.setOptions({ tabBarVisible: false });
  
      // Clean up when the page loses focus
      return () => {
        navigation.setOptions({ tabBarVisible: true });
      };
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function login() {
        login_form = {
            'email': email,
            'password': password
        }

        fetch("http://192.168.1.42:5000/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login_form)
        })
        .then( response_json => response_json.json())
        .then( response => navigation.navigate('printing'))
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
            <Button 
                style={styles.loginButton}
                onPress={login}
                title="Iniciar sesión"
            />
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

    loginButton: {
        borderRadius: 12,
        paddingVertical: 20,
        width: 120,
        textTransform: 'none',
    }
}
