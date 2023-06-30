import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

import { getSession, deleteSession } from '../session/sessionStorage';
import { initApp } from '../app';


const apiHost = "http://192.168.1.40:5000"

export default function IndexScreen() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkLogin();
    initApp();
  }, []);

  async function checkLogin() {
    session = await getSession();

    if(session != null)
      if ("id" in session && "role" in session && "name" in session && "email" in session) {
        setUserName(session["name"])
        setLoggedIn(true);
        return;
      }
      
    setLoggedIn(false);
  }

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <View style={styles.container_element}>
          <Text style={styles.title}>¡Hola { userName }!</Text>
          <Text style={styles.text}>¿Estás listo para imprimir tickets?</Text>
          <Link style={styles.link_button} href='/tickets' replace="/tickets">Lanzar aplicación</Link>
        </View>
      ) : (
        <View style={styles.container_element}>
          <Text style={styles.text}>Para acceder a la aplicación necesitas iniciar sesión</Text>
          <Link style={styles.link_button} href='/login' replace="/login">Iniciar Sesión</Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FFFF',
    marginTop: 40,
  },
  text: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center', 
    fontSize: 22, 
    fontWeight: 'bold'
  },
  container_element: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
  },
  link_button: {
    backgroundColor: "#559f97",
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: 'white',
    borderRadius: 20,
  }
  
});
