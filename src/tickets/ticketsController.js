import { getSession } from "../session/sessionStorage"
import { saveTicket } from "./storage/ticketsStorage"

import { obtainAssignedZone } from "../zone_manager"

import { createTicketOnServer } from "./api_conn/apiConn";
import { getConfigValue } from "../configStorage"
import { Alert } from "react-native";


// Print a ticket
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


        let ticket_dict = {
            "responsible_id": session["id"],
            "zone": zone,
            "paid": true,
            "created_at": obtainDateTime(),
            ...ticketInfo,
        }

        // Check if ticket_info has all required information and create the ticket on the server
        check_information(ticket_dict)
        
        await printTicket(formatTicketToBePrinted(ticket_dict))
        
        let server_ticket = await createTicketOnServer(ticket_dict)

        // If the ticket has been created on the server, save it on the local storage with the server id
        // If not, save it with a negative id so it can be identified as a local ticket that has not been created on the server yet
        if (!server_ticket) 
            throw new Error("Error al crear el ticket")

         
        // Obtaining required informtion from server
        ticket_dict["created_at"] = server_ticket["created_at"]
        ticket_dict["id"] = server_ticket["id"]


        // Saving ticket locally
        let result_ticket = await saveTicket(ticket_dict)

        if(result_ticket == null) 
            throw new Error("Error al guardar el ticket")
        
        // If everything went well, show a success message
        Alert.alert(`Ticket Creado`, "El ticket ha sido creado he impreso con éxito")
    }
    catch(error) {
        console.log(error)
        Alert.alert(`Ha ocurrido un error al crear el ticket`, error.message)
    }
}


function formatTicketToBePrinted(ticket) {
    
    return{
        "Zona": ticket["zone"],
        "Duración": ticket["duration"],
        "Matrícula": ticket["registration"],
        "Importe": ticket["price"] + " eur",
        "Fecha": formatDate(ticket["created_at"].split(" ")[0]),
        "Hora": ticket["created_at"].split(" ")[1].substring(0, 5) + " h",
    }

}

function formatDate(date) {
    let elements = date.split("/")
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



function obtainDateTime() {
    let date = new Date().toLocaleString('es-ES').replace(",", "")
    const [day, month, yearTime] = date.split('/');
    const [year, time] = yearTime.split(' ');
    return `${year}/${month}/${day} ${time}`;
}