/* eslint-disable react/prop-types */
//import "expo-router/entry";
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { registerRootComponent } from 'expo';

import IndexScreen from './src/screens/IndexScreen';
import LoginScreen from './src/screens/LoginScreen';

import MainContainer from './src/MainContainer';

const InitStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
        <InitStack.Navigator initialRouteName='Home'>
            <InitStack.Screen
                name="Home"
                component={IndexScreen}
                options={{title: 'Inicio'}}
            />
            <InitStack.Screen name="Login" component={LoginScreen} options={{title: 'Inicia Sesión'}}/>
            <InitStack.Screen name="Main" component={MainContainer} options={{headerShown: false}}/>
        </InitStack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
