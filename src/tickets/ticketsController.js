import { getSession } from "../session/sessionStorage"
import { saveTicket } from "./storage/ticketsStorage"

import { Alert } from "react-native";



// Create a ticket and print it
// @param duration, duration of the ticket
// @param registration, registration of the vehicle
// @param paid, if the ticket has been paid or not
// @return Promise with the created ticket information
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

        // Try to save the ticket on database
        // If creation is successful, print the ticket
        // If creation is not successful, reject the promise
        saveTicket(ticket_info).then((result) => {
            if(result == null) {
                reject("Error saving the ticket")
                return
            }
            printTicket(result["registration"], result["duration"], result["created_at"])
            resolve(result)
        }).catch((error) => {
            reject(error)
        })
    })
}




// Print the ticket
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