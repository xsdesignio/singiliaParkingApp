import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Link } from 'expo-router';



export default function HomeView() {
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const loggedInStatus = checkLogin();
    setLoggedIn(loggedInStatus);
  }, []);

  function checkLogin() {
    // Simulated login check
    return true;
  }

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <View style={styles.container_element}>
          <Text style={{textAlign: 'center'}}>¡Hola Pablo! ¿Estás listo para imprimir tickets?</Text>
          <Link style={styles.link_button}href="/printing">Lanzar aplicación</Link>
        </View>
      ) : (
        <View style={styles.container_element}>
          <Text style={{textAlign: 'center'}}>Para acceder a la aplicación necesitas iniciar sesión</Text>
          <Link style={styles.link_button} href="/login">Iniciar Sesión</Link>
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
  container_element: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
  },
  link_button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    color: 'white',
    height: 48,
    borderRadius: 8,
    fontSize: 18
  }
});
