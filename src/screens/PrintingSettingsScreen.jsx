import React, { useEffect } from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { BleManager } from 'react-native-ble-plx';

export default function PrintingSettingsScreen() {
    useEffect(() => {
        const manager = new BleManager();
        manager.startDeviceScan(null, null, (error, device) => {
            console.log(device);
        });
    }, []);
    return (
        <View style={styles.container}>
        <Text>Printing Settings</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    }
});

