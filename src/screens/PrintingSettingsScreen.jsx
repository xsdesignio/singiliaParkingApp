import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from 'react-native';

import DefaultButton from '../components/atoms/default-button';

import { colors } from '../styles/colorPalette';

import * as ExpoDevice from "expo-device";


export default function PrintingSettingsScreen() {

    const bleManager = useMemo(() => new BleManager(), []);

    const [allDevices, setAllDevices] = useState([]);

    const [connectedDevice, setConnectedDevice] = useState(null);



    useEffect(() => {
        const requestPermissionsAsync = async () => {
            const granted = await requestPermissions();
            console.log("granted")
            console.log(granted)
        };
        requestPermissionsAsync();
        return () => {
            bleManager.stopDeviceScan();
        };
    }, []);

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };


    //Create, using flatlist, a list to show all devices if they exist
    /* const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.devices_list_item} onPress={() => connectToDevice(item)}>
            <Text style={styles.title}>Dispositivo</Text>
            <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
    ); */

    function renderItem ({ item }) {
        console.log(item)
        return (
            <TouchableOpacity style={styles.devices_list_item} onPress={() => connectToDevice(item)}>
                <Text style={styles.title}>Dispositivo</Text>
                <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    

    const requestPermissions = async () => {
        console.log("requestPermissions")
        if (Platform.OS === "android") {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "Bluetooth Low Energy requires Location",
                    buttonPositive: "OK",
                }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionsGranted =await requestAndroid31Permissions();
                console.log("else")

                return isAndroid31PermissionsGranted;
            }
        } else {
            return true;
        }
    };

    const isDuplicteDevice = (devices, nextDevice) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    function scanForPeripherals () {
        console.log(bleManager)

        bleManager.startDeviceScan(null, null, (error, device) => {
            console.log("This do happens");
            console.log(device);
            if (error) {
                console.log(error);
            }

            setAllDevices((prevState) => {
                if (!isDuplicteDevice(prevState, device)) {
                    return [...prevState, device];
                }
                return prevState;
            });
        });
    }


    
    const connectToDevice = async (device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
                setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            //startStreamingData(deviceConnection);
        } catch (e) {
            console.log("FAILED TO CONNECT", e);
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
        bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        //setHeartRate(0);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Printing Settings</Text>
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
        padding: 10,
    }

});
