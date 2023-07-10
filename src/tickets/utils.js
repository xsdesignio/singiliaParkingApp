
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


// Check if ticket_info has all required information
export function check_information(ticket_info) {
    
    if (!ticket_info["responsible"] || ticket_info["responsible"] == "") 
        throw new Error("No se ha encontrado el nombre del responsable.")
    
    if (!ticket_info["duration"] || ticket_info["duration"] == "") 
        throw new Error("No se ha encontrado la duración del boletín.")
    
    if (!ticket_info["registration"] || ticket_info["registration"] == "") 
        throw new Error("No se ha encontrado la matrícula del vehículo.")
    
    if (!ticket_info["price"] || ticket_info["price"] == "") 
        throw new Error("No se ha encontrado el precio del boletín.")
    
    if (!ticket_info["paid"] || ticket_info["paid"] == "") 
        throw new Error("No se ha encontrado el estado de pago del boletín.")
    
    if (!ticket_info["location"] || ticket_info["location"] == "") 
        throw new Error("No se ha encontrado la ubicación del boletín.")
    
}