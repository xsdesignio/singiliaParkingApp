import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import DefaultButton from '../components/atoms/default-button';

import { colors } from '../styles/colorPalette';

import { usePrinter } from '../printing/PrintingProvider';

// linear-gradient(135deg,#565b73 0,#233659 100%)
// let serviceUUIDs = ["000018f0-0000-1000-8000-00805f9b34fb", "e7810a71-73ae-499d-8c15-faa9aef0c3f2"]


export default function PrintingSettingsScreen() {
    const { connectedDevice, connectToDevice, allDevices, disconnectFromDevice, scanForPeripherals, stopScan } = usePrinter()


    useEffect(() => {
        return () => {
            stopScan();
        };
    }, []);
    /* 
    useEffect(() => {
        
    }, [connectedDevice]); // Add this useEffect to see if connectedDevice changes trigger a re-render

 */
    function renderItem({ item }) {
        return(
            <TouchableOpacity style={styles.devices_list_item} onPress={() => connectToDevice(item)}>
                <Text>Dispositivo encontrado</Text>
                <Text style={styles.bold_text}>{item.name}</Text>
            </TouchableOpacity>
        )

    }

    return (
        <View style={styles.container}>

            <Text>Printing Settings</Text>
            
            <View>
                { connectedDevice ? (<Text>Conectado al dispositivo { connectedDevice.name }</Text>) : null}
            </View>

            <FlatList
                data={allDevices}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            
            { connectedDevice ? <DefaultButton text='Desconectar' onPress={disconnectFromDevice} /> : <DefaultButton text='Escanear' onPress={scanForPeripherals} /> }
        </View>
    );
}

const styles = StyleSheet.create({
    bold_text: {
        fontWeight: 'bold'
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },

    devices_list_item: {
        alignItems: 'center',
        backgroundColor: colors.light_green,
        borderColor: colors.dark_green,
        borderRadius: 5,
        borderWidth: 1,
        margin: 20,
        padding: 10,
        width: 200
    },

});
