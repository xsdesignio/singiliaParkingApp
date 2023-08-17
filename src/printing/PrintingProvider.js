/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState, Alert } from 'react'

import BluetoothManager from './BluetoothManager';

const PrinterContext = createContext();

export const PrinterProvider = ({ children }) => {
    const blManager = new BluetoothManager();

    const [connectedDevice, setConnectedDevice] = useState(null);

    useEffect(() => {
        requestPermissionsAsync();

        return () => {
            if(connectedDevice != null)
                blManager.disconnectFromDevice(connectedDevice)
        }
    });

    async function requestPermissionsAsync () {
        const granted = await blManager.requestPermissions();
        return granted;
    }


    function connectToDevice(device) {
        let connDevice = blManager.connectToDevice(device)
        console.log("Connected device:")
        console.log(connDevice)
        setConnectedDevice(connDevice)
    }

    function disconnectFromDevice() {
        try {
            let disconnectedDevice = blManager.disconnectFromDevice(connectedDevice)

            if(disconnectedDevice) {
                setConnectedDevice(null)
                Alert.alert("Dispositivo desconectado con éxito")
            }
        } catch {
            Alert.alert("Error al desconectar el dispositivo")
        }
        
    }

    return (
        <PrinterContext.Provider
            value={{ blManager, connectedDevice, connectToDevice, disconnectFromDevice }}
        >
            {children}
        </PrinterContext.Provider>
    )
}


export const usePrinter = () => {
    return useContext(PrinterContext)
}