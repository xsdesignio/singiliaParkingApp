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

    // const [connectedDevice, setConnectedDevice] = useState(null);
    // const [heartRate, setHeartRate] = useState(0);



    useEffect(() => {
        const requestPermissionsAsync = async () => {
            const granted = await requestPermissions();
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
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
        </View>
    );

    

    const requestPermissions = async () => {
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
                const isAndroid31PermissionsGranted =
                await requestAndroid31Permissions();

                return isAndroid31PermissionsGranted;
            }
        } else {
            return true;
        }
    };

    const isDuplicteDevice = (devices, nextDevice) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    function scanForPeripherals () {

        console.log("This do happens");
        bleManager.startDeviceScan(null, null, (error, device) => {
            console.log("This nor ever happens");
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


    /*
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
    }; */

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
            <DefaultButton text='scan' onPress={scanForPeripherals} />
            <TouchableOpacity style={styles.print_button} onPress={scanForPeripherals}>
                <Text style={styles.print_button_text}>
                    Escanear
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },

    print_button: {
        backgroundColor: colors.green_button,
        borderColor: colors.white,
        borderRadius: 20,
        borderWidth: 1,
        color: colors.background,
        elevation: 10,
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        width: 200,
    },
    print_button_text: {
        borderRadius: 8,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
