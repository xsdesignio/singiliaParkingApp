import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { useState } from "react";

import { useFocusEffect, useNavigation  } from "expo-router";




export default function loginView() {

    const navigation = useNavigation();


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
            placeholder='contraseña'
        />
        <View style={styles.buttonContainer}>
            <Button 
                style={styles.loginButton}
                title="Iniciar sesión"
            />
        </View>
    </View>)
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: 280,
        marginVertical: 16,
        marginBottom: 20,
        borderWidth: 1, 
        borderColor: 'gray',
        borderRadius:  12,
    },

    buttonContainer: {
        marginTop: 20,
    },
    loginButton: {
        borderRadius: 12,
        paddingVertical: 20,
        width: 120,
        textTransform: 'none',
    }
}
