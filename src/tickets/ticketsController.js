import { getSession } from "../session/sessionStorage"
import { saveTicket } from "./storage/ticketsStorage"

import { createTicketOnServer } from "./api_conn/apiConn";
import { getTicketPrice } from "./utils"
import { getConfigValue } from "../configStorage"
import { Alert } from "react-native";



// Print a ticket
// @param duration, duration of the ticket
// @param registration, registration of the vehicle
// @param paymentMethod, payment method used to pay the ticket (true for card and false for cash)
// @return Promise with the created ticket information
export function print(duration, registration, paymentMethod) {

    getSession().then((session) => {
        getConfigValue("zone").then((zone) => {

            let ticket_dict = {
                "responsible": session["name"],
                "zone": zone,
                "duration": duration,
                "registration": registration,
                "price": getTicketPrice(duration),
                "payment_method": paymentMethod,
                "paid": true,
            }


            createTicketOnServer(ticket_dict).then((ticket) => {
                console.log("ticket: ", ticket)
                
                createTicket(duration, registration, paymentMethod, ticket["id"])
                .then(() => {
                    Alert.alert(`Ticket Creado`, "El ticket ha sido creado he impreso con éxito")
                })

                .catch((error) => {
                    console.log(error)
                    Alert.alert("Error al crear el Ticket", error.message)
                })

            // Server Catch
            }).catch((error) => {
                console.log("Error de conexión con el servidor")
                console.log(error)
                Alert.alert("Error al imprimir el ticket", "No se ha podido crear el ticket.")
            })

        
        // Zone Catch
        }).catch((error) => {
            console.log(error)
            Alert.alert("Error al imprimir el ticket", "No se ha podido obtener la zona.")
        })

    // Session Catch
    }).catch((error) => {
        console.log(error)
        Alert.alert("Error al imprimir el ticket", "No se ha podido obtener el responsable.")
    })
}



// Create a ticket and print it
// @param duration, duration of the ticket
// @param registration, registration of the vehicle
// @param paid, if the ticket has been paid or not
// @return Promise with the created ticket information
function createTicket(duration, registration, paid = false, reference_id = -1) {
    return new Promise((resolve, reject) => {
        // Try to save the ticket on database
        getSession().then(async (session) => {

            getConfigValue("zone").then((zone) => {

                let price = getTicketPrice(duration)
                console.log("Hasta aquí si llega")


                let ticket_info = {
                    "responsible": session["name"],
                    "zone": zone,
                    "duration": duration || 30,
                    "registration": registration,
                    "price": price || 0.7,
                    "paid": paid,
                    "reference_id": reference_id,
                }

                
                // Try to save the ticket on database
                // If creation is successful, print the ticket. If creation is not successful, reject the promise
                saveTicket(ticket_info).then((result) => {
                    
                    if(result == null) {
                        reject("Error saving the ticket")
                        return
                    } 
                    resolve(result)

                }).catch((error) => {
                    console.log(error)
                    reject('Ha habido un error creando el ticket', "1")
                })
            }).catch(() => {
                reject('Ha habido un error obteniendo la sesión', "error")
            })

        }).catch(() => {
            reject('Ha habido un error obteniendo la sesión', "error")
        })
    })
}


