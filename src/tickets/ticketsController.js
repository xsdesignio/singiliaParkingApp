import { getSession } from "../session/sessionStorage"
import { saveTicket } from "./storage/ticketsStorage"

import { obtainAssignedZone } from "../zone_manager"

import { createTicketOnServer } from "./api_conn/apiConn";
import { getConfigValue } from "../configStorage"
import { Alert } from "react-native";

import { obtainDateTime } from "../date_utils";


// Create the ticket (such in server as locally) and Print it
// @param duration, duration of the ticket
// @param registration, registration of the vehicle
// @param paymentMethod, payment method used to pay the ticket ('CASH' or 'CARD')
// @return Promise with the created ticket information
export async function createAndPrintTicket(printer, ticketInfo) {

    try {
        
        const { connectedDevice, printTicket } = printer
        
        if(connectedDevice == null) 
            throw new Error("No se ha encontrado ninguna impresora conectada.")
        
        
        let session = await getSession()
        let zone = await getConfigValue("zone")
        if (zone == null || zone == undefined)
            zone = await obtainAssignedZone()

        // console.log("Creation time ", ticketInfo["created_at"])
        // console.log("Finalization time ", ticketInfo["finalization_time"])
        
        let ticket_dict = {
            "responsible_id": session["id"],
            "zone": zone,
            "paid": true,
            "created_at": ticketInfo["created_at"] || obtainDateTime(),
            ...ticketInfo,
        }

        // Check if ticket_info has all required information and create the ticket on the server
        check_information(ticket_dict)
        
        // Create the ticket on server
        let server_ticket = await createTicketOnServer(ticket_dict)
        if (!server_ticket) 
            throw new Error("Error al crear el ticket en el servidor")
        else
            ticket_dict["id"] = server_ticket["id"]  // Adding the id received from server

        
        // Print the ticket
        await printTicket(formatTicketToBePrinted(ticket_dict))

        // Once printed, save the ticket locally
        let saved_ticket = await saveTicket(ticket_dict)
        if(saved_ticket == null) 
            throw new Error("Error al guardar el ticket en el dispositivo")
        
        // If everything went well, show a success message
        Alert.alert(`Ticket Creado`, "El ticket ha sido creado he impreso con éxito")
        return true
    }
    catch(error) {
        Alert.alert(`Ha ocurrido un error al crear el ticket`, error.message)
        return false
    }
}


export function formatTicketToBePrinted(ticket) {

    let date = formatDate(ticket["finalization_time"]?.split(" ")[0]);
    // Extracting hours and minutes separately and ensuring leading zeros
    let timeParts = ticket["finalization_time"]?.split(" ")[1]?.split(":") || [];
    let hours = timeParts[0]?.padStart(2, '0') || '00'; // Defaulting to '00' if hours are not available
    let minutes = timeParts[1]?.padStart(2, '0') || '00'; // Defaulting to '00' if minutes are not available

    let time = `${hours}:${minutes} h`;

    return{
        "Id": ticket["id"],
        "Zona": ticket["zone"],
        "Duración": ticket["duration"],
        "Matrícula": ticket["registration"],
        "Importe": ticket["price"] + " eur",
        "Finalización": date,
        "Hora":time,
    }

}

function formatDate(date) {
    let elements = date.split(/[/-]/)
    let day = elements[2]
    let month = elements[1]
    let year = elements[0]

    return `${day}/${month}/${year}`
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
        throw new Error("Aún no eres responsable de ninguna zona.")
}

