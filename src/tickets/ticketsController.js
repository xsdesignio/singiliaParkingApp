import { getSession } from "../session/sessionStorage"
import { saveTicket } from "./storage/ticketsStorage"

import { getConfigValue } from "../configStorage";

import { printTicket } from "./printing/ticketsPrinting";

import { getTicketPrice } from "./utils"

import { Alert } from "react-native";



// Print a ticket
// @param duration, duration of the ticket
// @param registration, registration of the vehicle
// @param paymentMethod, payment method used to pay the ticket (true for card and false for cash)
// @return Promise with the created ticket information
export function print(duration, registration, paymentMethod) {
    
    createTicket(duration, registration, paymentMethod)

    .then((ticket) => {

        printTicket(ticket).then((ticket) => {
            Alert.alert(`Ticket con matrícula: ${ ticket["registration"] }`, "El ticket ha sido creado he impreso con éxito")
        }).catch((error) => {
            Alert.alert("No se ha podido imprimir el ticket.", error)
        })

    })
    .catch((error) => {
        Alert.alert("No se ha podido crear el ticket.", error)
    })
}



// Create a ticket and print it
// @param duration, duration of the ticket
// @param registration, registration of the vehicle
// @param paid, if the ticket has been paid or not
// @return Promise with the created ticket information
export function createTicket(duration, registration, paid = false, reference_id = -1) {
    return new Promise((resolve, reject) => {
        // Try to save the ticket on database
        getSession().then((session) => {

            let price = getTicketPrice(duration)

            let location = getConfigValue("location")

            let ticket_info = {
                "duration": duration || 30,
                "registration": registration,
                "price": price || 0.7,
                "paid": paid,
                "location": location,
            }
            ticket_info["responsible"] = session["name"]
            ticket_info["reference_id"] = reference_id


            // Try to save the ticket on database
            // If creation is successful, print the ticket. If creation is not successful, reject the promise
            saveTicket(ticket_info).then((result) => {
                if(result == null) {
                    reject("Error saving the ticket")
                    return
                } 
                resolve(result)

            }).catch((error) => {
                reject('Ha habido un error creando el ticket', error.toString())
            })

        }).catch((error) => {
            reject('Ha habido un error obteniendo la sesión', error.toString())
        })
    })
}


