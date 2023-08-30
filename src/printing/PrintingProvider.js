/* eslint-disable react-native/split-platform-components */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMemo } from 'react';

import { requestPermissions } from './PermissionsManager';
import { BleManager } from "react-native-ble-plx";

import { createEncodedTicketToBePrinted, encodedLegalInfoToBePrinted, encodedLogoToBePrinted, encodedSingiliaBarbaInfoToBePrinted } from './ticketCreation';




const PrinterContext = createContext();

// const servicesUUID = ["49535343-fe7d-4ae5-8fa9-9fafd205e455", "e7810a71-73ae-499d-8c15-faa9aef0c3f2", "000018f0-0000-1000-8000-00805f9b34fb"]

// "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
// "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f",


export const PrinterProvider = ({ children }) => {
    const bleManager = useMemo(() => new BleManager(), [])

    const [connectedDevice, setConnectedDevice] = useState(null);
    const [allDevices, setAllDevices] = useState([])

    // const [deviceServicesAndCharacteristics, setDeviceServicesAndCharacteristics] = useState([])
    const [serviceUUID, setServiceUUID] = useState(null)
    const [characteristicUUID, useCharacteristicUUID] = useState(null)

    useEffect(() => {
        requestPermissions();
        return () => {
            if(connectedDevice != null)
                bleManager.disconnectFromDevice()

            bleManager.destroy()
            
        }
    }, []);

    function isDuplicated (devices, nextDevice) {
        return devices.findIndex((device) => nextDevice.id === device.id) > -1;
    }   

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device) {
                setAllDevices((prevState) => {

                    if (!isDuplicated(prevState, device)) {
                            return [...prevState, device];
                    }
                    return prevState;

                });
            }
        });

    async function stopScan() {
        bleManager.stopDeviceScan()
    }

    // Return the connected device if successfully connected or return null otherwise
    async function connectToDevice(device) {

        bleManager.connectToDevice(device.id)
            .then(async (connDevice) => {

                setConnectedDevice(connDevice)

                const characteristics = await connDevice.discoverAllServicesAndCharacteristics()
                const services = await characteristics.services()
                
                services.forEach(async (service) => {
                    const characteristicsOfService = await characteristics.characteristicsForService(service.uuid)
                    
                    
                    let serviceFound = false

                    characteristicsOfService.forEach((characteristic) => {
                        if(characteristic.isWritableWithResponse && !serviceFound) {
                            setServiceUUID(service.uuid)
                            useCharacteristicUUID(characteristic.uuid)
                            serviceFound = true
                        }
                    })
                })
                
                bleManager.stopDeviceScan()
            })
            .catch((error) => {
                console.log(error)
                return null
            })
    }

    async function disconnectFromDevice() {
        if(connectedDevice)
            bleManager.cancelDeviceConnection(connectedDevice.id)
                .then(() => {
                    setConnectedDevice(null)
                    setServiceUUID(null)
                    useCharacteristicUUID(null)

                })
                .catch((error) => {
                    console.log(error)
                })
    }

    // type = "Bulletin" or "Ticket"
    async function sendDataToDevice(data) {
        if(connectedDevice != null) {
            try {
                await printLogo()
                const encoded_data = createEncodedTicketToBePrinted(data)

                await connectedDevice.writeCharacteristicWithResponseForService(
                    serviceUUID,
                    characteristicUUID,
                    encoded_data
                )
                
                await printSingiliaBarbaInfo();
                await printLegalInfo();
                return true

            } catch (error) {
                console.log("Error sending data: ", error)
                return false
            }
            
        } else {
            console.log("Device not connected.");
            return false
        }
    }

    async function printSingiliaBarbaInfo() {
        const info = encodedSingiliaBarbaInfoToBePrinted()
        await connectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            characteristicUUID,
            info
        )
        return true;
    }

    async function printLegalInfo() {
        const info = encodedLegalInfoToBePrinted()
        await connectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            characteristicUUID,
            info
        )
        return true;

    }

    async function printLogo() {
        const logo = encodedLogoToBePrinted()
        await connectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            characteristicUUID,
            logo
        )
        return true;
    }


    return (
        <PrinterContext.Provider
            value={{ connectedDevice, connectToDevice, allDevices, disconnectFromDevice, sendDataToDevice, scanForPeripherals, stopScan }}
        >
            {children}
        </PrinterContext.Provider>
    )
}

export const usePrinter = () => {
    return useContext(PrinterContext)
}

