import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

import { getSession } from '../session/sessionStorage';
import { initApp } from '../app';
import { colors } from '../styles/colorPalette';



export default function IndexScreen() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  /* const [userName, setUserName] = useState(""); */

  useEffect(() => {
    initApp();
    checkLogin();
  }, []);

  async function checkLogin() {
    let session = await getSession();

    if(session != null)
      if ("id" in session && "role" in session && "name" in session && "email" in session) {
        /* setUserName(session["name"]) */
        setLoggedIn(true);
        return;
      }
      
    setLoggedIn(false);
  }

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <View style={styles.container_element}>
          <Text style={styles.title}>¡Hola!</Text>
          <Text style={styles.text}>¿Estás listo para imprimir tickets?</Text>
          <Link style={styles.link_button} href='/tickets' replace="/tickets">
            <Text>
              Lanzar aplicación
            </Text>
          </Link>
        </View>
      ) : (
        <View style={styles.container_element}>
          <Text style={styles.text}>Para acceder a la aplicación necesitas iniciar sesión</Text>
          <Link style={styles.link_button} href='/login' replace="/login">
            <Text>
              Iniciar Sesión
            </Text>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    marginTop: 40,
  },
  container_element: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    width: "80%",
  },
  link_button: {
    backgroundColor: colors.green_button,
    borderColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    color: colors.white,
    elevation: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,

    shadowColor: colors.black,
    shadowOffset: {
        width: 0,
        height: 5,
    },
    
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

  },
  text: {
    color: colors.white,
    textAlign: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 22, 
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  
});
