import { getSession } from "../session/sessionStorage"
import { saveTicket } from "./storage/ticketsStorage"

import { createTicketOnServer } from "./api_conn/apiConn";
import { getConfigValue } from "../configStorage"
import { Alert } from "react-native";

// Print a ticket
// @param duration, duration of the ticket
// @param registration, registration of the vehicle
// @param paymentMethod, payment method used to pay the ticket ('CASH' or 'CARD')
// @return Promise with the created ticket information
export async function createAndPrintTicket(duration, registration, paymentMethod) {

    try {
        // Obtaining required data to create the ticket
        let session = await getSession()
        let zone = await getConfigValue("zone")

        let ticket_dict = {
            "responsible_id": session["id"],
            "zone": zone,
            "duration": duration,
            "registration": registration,
            "price": getTicketPrice(duration),
            "payment_method": paymentMethod,
            "paid": true,
        }
        // Check if ticket_info has all required information and create the ticket on the server
        check_information(ticket_dict)
        let server_ticket = await createTicketOnServer(ticket_dict)

        // If the ticket has been created on the server, save it on the local storage with the server id
        // If not, save it with a negative id so it can be identified as a local ticket that has not been created on the server yet
        if (server_ticket) {
            ticket_dict["created_at"] = server_ticket["created_at"]
            ticket_dict["reference_id"] = server_ticket["id"]
        } else {
            ticket_dict["reference_id"] = -1
        }

        let result_ticket = await saveTicket(ticket_dict)

        if(result_ticket == null) {
            throw new Error("Error al guardar el ticket")
        }

        // If everything went well, show a success message
        Alert.alert(`Ticket Creado`, "El ticket ha sido creado he impreso con éxito")
    }
    catch(error) {
        console.log(error)
        Alert.alert(`Ha ocurrido un error al crear el ticket`, error.message)
    }
}


export async function printTicket(ticket) {
}



// get the ticket price depending on the duration
// @param duration, duration of the ticket
// @return price of the ticket
function getTicketPrice(duration) {
    if(duration == null || 
        duration == undefined || 
        duration <= 0) 
        return 0

    if(duration <= 30) 
        return 0.7
    
    if(duration <= 60) 
        return 0.9
    
    if(duration <= 90) 
        return 1.4
    
    return 1.8
    
}


// Check if ticket_info has all required information
function check_information(ticket_info) {
    print(ticket_info)
    
    if (!ticket_info["responsible_id"] || ticket_info["responsible_id"] == "") 
        throw new Error("No se ha encontrado el nombre del responsable.")
    
    if (!ticket_info["duration"] || ticket_info["duration"] == "") 
        throw new Error("No se ha encontrado la duración del ticket.")
    
    if (!ticket_info["registration"] || ticket_info["registration"] == "") 
        throw new Error("No se ha encontrado la matrícula del vehículo.")

    if (!ticket_info["payment_method"] || ticket_info["payment_method"] == "") 
        throw new Error("No se ha seleccionado ningún método de pago.")
    
    if (!ticket_info["price"] || ticket_info["price"] == "") 
        throw new Error("No se ha encontrado el precio del ticket.")
    
    if (!("paid" in ticket_info) || ticket_info["paid"] == "") 
        throw new Error("No se ha encontrado el estado de pago del ticket.")
    
    if (!ticket_info["zone"] || ticket_info["zone"] == "") 
        throw new Error("No se ha encontrado la ubicación del ticket.")
}