/* eslint-disable react-native/split-platform-components */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState /*, Alert */ } from 'react';
import { useMemo } from 'react';
import { requestPermissions } from './PermissionsManager';
import { BleManager } from "react-native-ble-plx";
import { obtainAvailableBulletins } from "../bulletins/availableBulletins";

// import { createEncodedTicketToBePrinted, encodedLegalInfoToBePrinted, encodedLogoToBePrinted, encodedSingiliaBarbaInfoToBePrinted } from './PrinterCommunication';

// import PrinterCommunicationEncoder from './PrinterCommunication';

import { ticketTemplate, bulletinTemplate, bulletinCancellationTemplate } from './Templates';



const PrinterContext = createContext();


export const PrinterProvider = ({ children }) => {
    const bleManager = useMemo(() => new BleManager(), [])

    const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
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

    const checkBluetoothStatus = async () => {
        try {
            let state = false;
            if(bleManager)
                state = await bleManager.state();

            setBluetoothEnabled(state === 'PoweredOn');

            if(!bluetoothEnabled) {
                setConnectedDevice(null)
                setServiceUUID(null)
                setCharacteristicUUID(null)
                setAllDevices([])
            }
            
        } catch (error) {
            console.error('Error checking Bluetooth status:', error);
        }
    };

    // Helper function to check if found devices are duplicated before pushing them to the "allDevices" array
    function isDuplicated (devices, nextDevice) {
        return devices.findIndex((device) => nextDevice.id === device.id) > -1;
    }   

    const scanForPeripherals = () =>{
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
    }
        

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


    async function sendDataToDevice(encoded_info) {
        await connectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            characteristicUUID,
            encoded_info
        )
    }


    // FUNCTIONS RELATED WITH PRINTING THE DIFFERENT TEMPLATES
    // The templates returns an array of encoded chunks 
    // These chunks contains the commands, logos and content provided by each template
    async function printTicket(ticket_data) {
        const ticket_template = await ticketTemplate(ticket_data)
        await printTemplate(ticket_template)
    }

    async function printBulletin(bulletin_data) {
        let available_bulletins = await obtainAvailableBulletins()
        const bulletin_template = await bulletinTemplate(bulletin_data, available_bulletins)
        await printTemplate(bulletin_template)
    }

    async function printBulletinCancellation(bulletin_data) {
        const bulletin_cancellation_template = await bulletinCancellationTemplate(bulletin_data)
        await printTemplate(bulletin_cancellation_template)
    }


    // send each chunk to the printer
    async function printTemplate(template) {
        for(let chunk of template) {
            await sendDataToDevice(chunk)
        }
        return 
    }


    return (
        <PrinterContext.Provider
            value={{ bluetoothEnabled, checkBluetoothStatus, connectedDevice, connectToDevice, allDevices, disconnectFromDevice, printTicket, printBulletin, printBulletinCancellation, scanForPeripherals, stopScan }}
        >
            {children}
        </PrinterContext.Provider>
    )
}

export const usePrinter = () => {
    return useContext(PrinterContext)
}

