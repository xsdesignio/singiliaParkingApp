import { Alert } from "react-native"
import { getSession } from "../storage/sessionStorage"
import { saveTicket } from "../storage/ticketsStorage"
import { saveBulletin } from "../storage/bulletinsStorage";



export function printBulletin(registration, duration, created_at) {
    // Simulate printing by the moment;
    return new Promise((resolve, reject) => {
        let printing = true;

        Alert.alert('El boletín se está imprimiendo', 'Debería tardar tan solo unos segundos...', [
            {
                text: 'Cerrar',
                onPress: () => console.log(''),
            }]);
        
        setTimeout(() => {
            printing = false
            resolve("Ticket printed successfully")
        }, 6000)
    })
}


export function createBulletin(bulletin_info) {
    return new Promise((resolve, reject) => {

        let session = getSession()

        bulletin_info["responsible"] = session["name"]

        saveBulletin(bulletin_info).then((result) => {
            printTicket(result["registration"], result["duration"], result["created_at"])
            resolve(result)
        }).catch((error) => {
            reject(error.message)
        })
    })
}