import { getSession } from "../storage/sessionStorage"
import { saveTicket } from "../storage/ticketsStorage"

import { Alert } from "react-native";


export function printTicket(registration, duration, created_at) {
    // Simulate printing by the moment;
    return new Promise((resolve, reject) => {
        Alert.alert('El ticket se está imprimiendo', 'Debería tardar tan solo unos segundos...', [
        {
            text: 'Cerrar',
            onPress: () => console.log('Ask me later pressed'),
        }]);

        setTimeout(() => {
            resolve("Ticket printed successfully")
        }, 6000)
    })
}

export function createTicket(duration, registration, paid = false) {
    return new Promise((resolve, reject) => {

        let session = getSession()

        let ticket_info = {
            "responsible": session["name"],
            "duration": duration,
            "registration": registration,
            "paid": paid,
            "location": "La Moraleda",
        }

        saveTicket(ticket_info).then((result) => {
            printTicket(result["registration"], result["duration"], result["created_at"])
            resolve(result)
        }).catch((error) => {
            reject(error.message)
        })
    })
    let session = getSession()

    let ticket_info = {
        "responsible": session["name"],
        "duration": duration,
        "registration": registration,
        "paid": paid,
        "location": "La Moraleda",
    }
    
    saveTicket(ticket_info).then((result) => {
        printTicket(result["registration"], result["duration"], result["created_at"])
    }).catch((e) => {
        Alert.alert('Ha ocurrido un error creando el ticket', e.message, [
            {
                text: 'Cerrar',
            }]);
    })

    return ticket
}

