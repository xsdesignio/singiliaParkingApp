/* eslint-disable react-native/split-platform-components */
import { Platform, PermissionsAndroid } from "react-native";
import * as ExpoDevice from "expo-device";


export async function requestPermissions () {
    if (Platform.OS === "android") {

        if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Permiso de localización",
                message: "Bluetooth Low Energy requiere conocer tu localización.",
                buttonPositive: "OK",
            }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const isAndroid31PermissionsGranted = await _requestAndroid31Permissions();
            return isAndroid31PermissionsGranted;
        }
    } else {
        return true;
    }
}

// This function is executed depending if the android api version is inferior to 31
// Because more permissions seem to be required
async function _requestAndroid31Permissions () {
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
}
