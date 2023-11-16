import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import DefaultButton from '../components/atoms/default-button';

import { colors } from '../styles/colorPalette';

import { usePrinter } from '../printing/PrintingProvider';
import LoadingCircle from '../components/atoms/loading-circle';

// linear-gradient(135deg,#565b73 0,#233659 100%)
// let serviceUUIDs = ["000018f0-0000-1000-8000-00805f9b34fb", "e7810a71-73ae-499d-8c15-faa9aef0c3f2"]


export default function PrintingSettingsScreen() {
    const { bluetoothEnabled, checkBluetoothStatus, connectedDevice, connectToDevice, allDevices, disconnectFromDevice, scanForPeripherals, stopScan } = usePrinter()

    const [scanning, setScanning] = useState(false)


    useEffect(() => {
        try {
            checkBluetoothStatus()
        } catch(e) {
            console.log("Error en el estaus")
        }
        return () => {
            if(scanning)
                stopScan();
        };
    }, []);
    

    function renderItem({ item }) {
        if(!item.name) 
            return null
        
        return(
            <TouchableOpacity style={styles.devices_list_item} onPress={() => {
                connectToDevice(item)
                stopScanning()
            }}>
                <Text>Dispositivo encontrado</Text>
                <Text style={styles.bold_text}>{item.name}</Text>
            </TouchableOpacity>
        )

    }


    function startScanning() {
        scanForPeripherals()
        setScanning(true)
    }

    function stopScanning() {
        stopScan()
        setScanning(false)
    }

    return (
        <View style={styles.container}>

            { connectedDevice ? 
                (
                    <Text style={styles.title}>Conectado</Text>
                ) : 
                (
                    <Text style={styles.title}>Encuentra impresoras disponibles.</Text>
                )
            }
            
            <View style={ styles.devices_list_wrapper }>
                { connectedDevice ? 
                (
                    <View style={ styles.connected_device }>
                        <Text style={ styles.connected_device_text }>Conectado al dispositivo</Text>
                        <Text style={ styles.connected_device_name }>{ connectedDevice.name }</Text>
                    </View>
                ) : 
                ( scanning ? (
                    <>

                        <View style={styles.devices_list}>
                            <FlatList
                                data={allDevices}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>  
                        
                        <LoadingCircle></LoadingCircle>
                     </>) : 
                    (
                        <>
                        
                        { bluetoothEnabled ? 
                            <Text style={styles.normal_text}>
                                Escanea para mostrar dispositivos cercanos
                            </Text> :
                            <Text style={ styles.advice_text }>
                                    Activa el blutooth y vuelve a entrar a esta pantalla para poder escanear en busca de impresoras.
                            </Text>
                        }</>
                        
                    )        
                )}
            </View>
            {
                bluetoothEnabled ?
                <>
                    { connectedDevice ? 
                    <DefaultButton text='Desconectar' onPress={disconnectFromDevice} /> : 
                    ( 
                        !scanning ? 
                        (
                            <DefaultButton text='Escanear dispositivos' onPress={ startScanning } />
                        ) : (
                            <DefaultButton text='Parar de escanear' onPress={ stopScanning } />
                        )
                    )
                }</>:
                <></>
            }
            
        </View>
    );
}

const styles = StyleSheet.create({
    advice_text: {
        color: colors.error_color,
        fontSize: 18,
        maxWidth: 300,
        textAlign: "center",
    },
    connected_device: {
        alignItems: 'center',
        backgroundColor: colors.light_green,
        borderColor: colors.dark_green,
        borderRadius: 5,
        borderWidth: 1,
        margin: 20,
        padding: 20,
        width: 320,
    },
    connected_device_name: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: "center"
    },
    connected_device_text: {
        fontSize: 22,
        textAlign: "center",
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },

    devices_list: {
        backgroundColor: colors.white,
        borderColor: colors.dark_green,
        borderRadius: 5,
        borderWidth: 1,
        height: 300,
        justifyContent: "center",
        marginTop: 20,
        padding: 20,
        width: 320,
        
    },
    devices_list_item: {
        alignItems: 'center',
        backgroundColor: colors.light_green,
        borderColor: colors.dark_green,
        borderWidth: 1,
        justifyContent: "center",
        marginVertical: 20,
        padding: 10,
        width: "100%"
    },
    devices_list_wrapper: {
        gap: 20,

    },
    normal_text: {
        fontSize: 18,
        textAlign: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center',
    }

});
