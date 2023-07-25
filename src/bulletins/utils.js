


export function check_information(bulletin_info) {
    // Check if bulletin_info has all required information
    if (!bulletin_info["responsible_id"] || bulletin_info["responsible_id"] == "") 
        throw new Error("No se ha encontrado el nombre del responsable.")
    
    if (!bulletin_info["duration"] || bulletin_info["duration"] == "") 
        throw new Error("No se ha encontrado la duración del boletín.")
    
    if (!bulletin_info["registration"] || bulletin_info["registration"] == "") 
        throw new Error("No se ha encontrado la matrícula del vehículo.")
    
    if (!bulletin_info["price"] || bulletin_info["price"] == "") 
        throw new Error("No se ha encontrado el precio del boletín.")
    
    if (bulletin_info["paid"] == undefined || bulletin_info["paid"] == null)
        throw new Error("No se ha encontrado el estado de pago del boletín.")
    
    if (!bulletin_info["location"] || bulletin_info["location"] == "") 
        throw new Error("No se ha encontrado la ubicación del boletín.")
    
}



// get the bulletin price depending on the duration
// @param duration, duration of the bulletin
// @return price of the bulletin
export function getBulletinPrice(duration) {
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
