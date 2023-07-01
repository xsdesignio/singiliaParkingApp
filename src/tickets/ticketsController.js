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

        getSession().then((session) => {

            let price = getTicketPrice(duration)

            let ticket_info = {
                "responsible": session["name"],
                "duration": duration || 30,
                "registration": registration,
                "price": price,
                "paid": paid,
                "sent_to_server": false,
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
                Alert.alert('Ha habido un error creando el ticket', error, [
                {
                    text: 'Cerrar',
                }]);
                reject(error)
            })
        }).catch((error) => {
            Alert.alert('Ha habido un error con la sesión', error, [
            {
                text: 'Cerrar',
            }]);
            reject(error)
        })
    })
}



// get the ticket price depending on the duration
// @param duration, duration of the ticket
// @return price of the ticket
export function getTicketPrice(duration) {
    if(duration == null || 
        duration == undefined || 
        duration <= 0) 
        return 0

    if(duration < 30) 
        return 0.7
    
    if(duration < 60) 
        return 0.9
    
    if(duration < 90) 
        return 1.4
    
    return 1.8
    
}



// Print the ticket
export function printTicket(registration, duration, created_at) {
    // Simulating printing by the moment;
    return new Promise((resolve, reject) => {
        Alert.alert('El ticket se está imprimiendo', 'Debería tardar tan solo unos segundos...', [
        {
            text: 'Cerrar',
        }]);

        setTimeout(() => {
            resolve("Ticket printed successfully")
        }, 6000)
    })
}