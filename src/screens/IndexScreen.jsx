/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { getSession } from '../session/sessionStorage';
import { initApp } from '../app';
import { colors } from '../styles/colorPalette';
import DefaultButton from '../components/atoms/default-button';



// eslint-disable-next-line react/prop-types
export default function IndexScreen({ navigation }) {
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
          <DefaultButton text="Lanzar aplicación" onPress={ () => {
            navigation.replace('Main')
          }}/>
        </View>
      ) : (
        <View style={styles.container_element}>
          <Text style={styles.text}>Para acceder a la aplicación necesitas iniciar sesión</Text>
          {/* eslint-disable-next-line react/prop-types */}
          <DefaultButton text="Iniciar Sesión" onPress={ () => navigation.navigate('Login')}/>
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
  text: {
    color: colors.dark_green,
    textAlign: 'center',
  },
  title: {
    color: colors.dark_green,
    fontSize: 22, 
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  
});
