import { BleManager } from 'react-native-ble-plx';


export default class BluetoothManager {
    constructor() {
        this.bleManager = new BleManager()
    }

    async scan() {
        this.bleManager.startDeviceScan(null, null, (error, device) => {
            console.log("Scanning...")
            if (error) {
                console.log(error)
                return
            }
            console.log(device)
        })
    }

    async stopScan() {
        this.bleManager.stopDeviceScan()
    }

    async connectToDevice(device) {
        this.bleManager.connectToDevice(device.id)
            .then((device) => {
                console.log("Connected to device", device)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async disconnectFromDevice(device) {
        this.bleManager.cancelDeviceConnection(device.id)
            .then(() => {
                console.log("Disconnected from device", device)
            })
            .catch((error) => {
                console.log(error)
            })
    }

}