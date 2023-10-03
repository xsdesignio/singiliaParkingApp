/* eslint-disable react-native/split-platform-components */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState /*, Alert */ } from 'react';
import { useMemo } from 'react';

import { requestPermissions } from './PermissionsManager';
import { BleManager } from "react-native-ble-plx";

// import { createEncodedTicketToBePrinted, encodedLegalInfoToBePrinted, encodedLogoToBePrinted, encodedSingiliaBarbaInfoToBePrinted } from './PrinterCommunication';

import PrinterCommunicationEncoder from './PrinterCommunication';



const PrinterContext = createContext();


export const PrinterProvider = ({ children }) => {
    const bleManager = useMemo(() => new BleManager(), [])

    const communicationEncoder = useMemo(() => new PrinterCommunicationEncoder(), [])

    const [connectedDevice, setConnectedDevice] = useState(null);
    const [allDevices, setAllDevices] = useState([])

    // const [deviceServicesAndCharacteristics, setDeviceServicesAndCharacteristics] = useState([])
    const [serviceUUID, setServiceUUID] = useState(null)
    const [characteristicUUID, setCharacteristicUUID] = useState(null)

    useEffect(() => {
        requestPermissions();
        return () => {
            if(connectedDevice != null) {
                bleManager.disconnectFromDevice()
                setConnectedDevice(null)
            }

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
                if(device.name == null)
                    return
                setAllDevices((prevState) => {

                    if (!isDuplicated(prevState, device)) {
                            return [...prevState, device];
                    }
                    return prevState;

                });
            }
        });

    async function stopScan() {
        setAllDevices([])
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
                            setCharacteristicUUID(characteristic.uuid)
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
                    setCharacteristicUUID(null)

                })
                .catch((error) => {
                    console.log(error)
                })
    }


    async function printTicket(ticket_data) {
        
        if(connectedDevice == null) {
            console.log("Simulando impresión: no se ha encontrado ninguna impresora conectada.")
            return true
            // Alert.alert("Error", "No se ha encontrado ninguna impresora conectada. Puedes conectar una desde ajustes")
            
        }

        try {
            const logo = communicationEncoder.getSingiliaLogo()
            await sendDataToDevice(logo)

            const title = communicationEncoder.getEncodedTitle("Servicio Municipal \nEstacionamiento Regulado")
            await sendDataToDevice(title)

            const encoded_ticket_data = communicationEncoder.getEncodedDict(ticket_data)
            await sendDataToDevice(encoded_ticket_data)

            const singilia_barba_info =communicationEncoder. getSingiliaInfo()
            await sendDataToDevice(singilia_barba_info)

            const legal_info = communicationEncoder.getLegalInfo()
            await sendDataToDevice(legal_info)

            return true

        } catch (error) {
            console.log("Error sending data: ", error)
            return false
        }

    }

    async function printBulletin(bulletin_data, available_bulletins) {

        console.log("Available Bulletins: ", available_bulletins)

        if(connectedDevice == null) {
            console.log("Simulando impresión: no se ha encontrado ninguna impresora conectada.")
            return true
            // Alert.alert("Error", "No se ha encontrado ninguna impresora conectada. Puedes conectar una desde ajustes.")
        }

        try {
            const logo = communicationEncoder.getSingiliaLogo()
            await sendDataToDevice(logo)

            const title = communicationEncoder.getEncodedTitle("Anulación de Boletín")
            await sendDataToDevice(title)

            const encoded_bulletin_data = communicationEncoder.getEncodedDict(bulletin_data)
            await sendDataToDevice(encoded_bulletin_data)

            const prices_table = communicationEncoder.getEncodedPricesTable(available_bulletins)
            await sendDataToDevice(prices_table)

            const singilia_barba_info = communicationEncoder.getSingiliaInfo()
            await sendDataToDevice(singilia_barba_info)

            const legal_info = communicationEncoder.getBulletinLegalInfo()
            await sendDataToDevice(legal_info)

            return true

        } catch (error) {
            console.log("Error sending data: ", error)
            return false
        }

    }


    async function printBulletinCancellation(bulletin_data) {

        if(connectedDevice == null) {
            console.log("Simulando impresión: no se ha encontrado ninguna impresora conectada.")
            return true
            // Alert.alert("Error", "No se ha encontrado ninguna impresora conectada. Puedes conectar una desde ajustes.")
        }

        try {
            const logo = communicationEncoder.getSingiliaLogo()
            await sendDataToDevice(logo)

            const title = communicationEncoder.getEncodedTitle("Boletín \nEstacionamiento Regulado")
            await sendDataToDevice(title)

            const encoded_bulletin_data = communicationEncoder.getEncodedDict(bulletin_data)
            await sendDataToDevice(encoded_bulletin_data)

            const singilia_barba_info = communicationEncoder.getSingiliaInfo()
            await sendDataToDevice(singilia_barba_info)

            const legal_info = communicationEncoder.getBulletinLegalInfo()
            await sendDataToDevice(legal_info)

            return true

        } catch (error) {
            console.log("Error sending data: ", error)
            return false
        }

    }


    // type = "Bulletin" or "Ticket"
    async function sendDataToDevice(encoded_info) {
        try {
            await connectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                characteristicUUID,
                encoded_info
            )
            return true

        } catch (error) {
            console.log("Error sending data: ", error)
            return false
        }
    }


    return (
        <PrinterContext.Provider
            value={{ connectedDevice, connectToDevice, allDevices, disconnectFromDevice, printTicket, printBulletin, printBulletinCancellation, scanForPeripherals, stopScan }}
        >
            {children}
        </PrinterContext.Provider>
    )
}

export const usePrinter = () => {
    return useContext(PrinterContext)
}

