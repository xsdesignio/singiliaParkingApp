import { Alert } from "react-native"
import { getSession } from "../session/sessionStorage"
import { saveBulletin } from "./storage/bulletinsStorage";



// Create a dialog to print the ticket and close the dialog after 6 seconds
export function printBulletin(bulletin_info) {
    // Simulate printing by the moment;
    return new Promise((resolve, reject) => {
        let printing = true;

        Alert.alert('El boletín se está imprimiendo', 'Debería tardar tan solo unos segundos...', [
            {
                text: 'Cerrar',
                onPress: () => console.log(''),
            }]);
        
        setTimeout(() => {
            printing = false
            resolve("Ticket printed successfully")
        }, 6000)
    })
}

//@param bulletin_info, dictionary with required information to create the bulletin
//(responsible, duration, registration, price, paid, location)
export function createBulletin(bulletin_info) {
    return new Promise((resolve, reject) => {

        let session = getSession()

        bulletin_info["responsible"] = session["name"]

        // Check if bulletin_info has all required information
        check_information(bulletin_info)

        // Try to save the ticket on database
        // If creation is successful, print the ticket
        saveBulletin(bulletin_info).then((result) => {
            printBulletin(bulletin_info)
            resolve(result)
        }).catch((error) => {
            reject(error.message)
        })
    })
}



function check_information(bulletin_info) {
    // Check if bulletin_info has all required information
    if (!bulletin_info["responsible"] || bulletin_info["responsible"] == "") 
        throw new Error("No se ha encontrado el nombre del responsable.")
    
    if (!bulletin_info["duration"] || bulletin_info["duration"] == "") 
        throw new Error("No se ha encontrado la duración del boletín.")
    
    if (!bulletin_info["registration"] || bulletin_info["registration"] == "") 
        throw new Error("No se ha encontrado la matrícula del vehículo.")
    
    if (!bulletin_info["price"] || bulletin_info["price"] == "") 
        throw new Error("No se ha encontrado el precio del boletín.")
    
    if (!bulletin_info["paid"] || bulletin_info["paid"] == "") 
        throw new Error("No se ha encontrado el estado de pago del boletín.")
    
    if (!bulletin_info["location"] || bulletin_info["location"] == "") 
        throw new Error("No se ha encontrado la ubicación del boletín.")
    
}