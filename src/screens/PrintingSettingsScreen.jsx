import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import DefaultButton from '../components/atoms/default-button';

import { colors } from '../styles/colorPalette';

import { usePrinter } from '../printing/PrintingProvider';

// linear-gradient(135deg,#565b73 0,#233659 100%)
// let serviceUUIDs = ["000018f0-0000-1000-8000-00805f9b34fb", "e7810a71-73ae-499d-8c15-faa9aef0c3f2"]


export default function PrintingSettingsScreen() {
    const { blManager, connectedDevice, connectToDevice, disconnectFromDevice } = usePrinter()

    const [allDevices, setAllDevices] = useState([]);


    useEffect(() => {
        return () => {
            blManager.stopScan();
        };
    });


    function scanForPeripherals() {
        blManager.scan(addDeviceFound)
    }

    function addDeviceFound(device) {
        if (!isDuplicatedDevice(allDevices, device))
            setAllDevices(devices => [...devices, device])
    }

    const isDuplicatedDevice = (devices, nextDevice) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;


    function renderItem({ item }) {
        return(
            <TouchableOpacity style={styles.devices_list_item} onPress={() => connectToDevice(item)}>
                <Text style={styles.title}>Dispositivo</Text>
                <Text style={styles.title}>{item.name}</Text>
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
            {/* <Text>{ allDevices }</Text> */}
            {/* <Button title='scan' onPress={scanForPeripherals} /> */}
            <DefaultButton text='Escanear' onPress={scanForPeripherals} />
            { connectedDevice ? <DefaultButton text='Desconectar' onPress={disconnectFromDevice} /> : null }
        </View>
    );
}

const styles = StyleSheet.create({
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
    }

});
