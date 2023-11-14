/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors } from '../styles/colorPalette';
import DefaultButton from '../components/atoms/default-button';
import Logo from '../components/atoms/logo';



// eslint-disable-next-line react/prop-types
export default function IndexScreen({ navigation }) {


  return (
    <View style={styles.container}>
        <View style={styles.container_element}>
          <Logo></Logo>
          <Text style={styles.text}>Para acceder a la aplicación necesitas iniciar sesión</Text>
          {/* eslint-disable-next-line react/prop-types */}
          <DefaultButton text="Iniciar Sesión" onPress={ () => navigation.navigate("Login") }/>
        </View>
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
});
