import { Alert } from "react-native"
import { getSession } from "../session/sessionStorage"
import { saveBulletin } from "./storage/bulletinsStorage";


import { printBulletin } from "./printing/bulletinsPrinting";



export function print(bulletinInfo) {
    createBulletin(bulletinInfo)
    .then((bulletin) => {
        
        printBulletin(bulletin)

        Alert.alert("Boletín impreso", "El boletín ha sido impreso con éxito")
    })
    .catch((error) => {
        Alert.alert("No se ha podido imprimir el boletín.", error.message)
    })
}



//@param bulletin_info, dictionary with required information to create the bulletin
// (responsible, duration, registration, price, paid, precept, brand, model, color, signature, reference_id, location)
export function createBulletin(bulletin_info) {
    return new Promise((resolve, reject) => {

        getSession().then((session) => {


            bulletin_info["responsible"] = session["name"]

            bulletin_info["reference_id"] = -1

            bulletin_info["price"] = getBulletinPrice(bulletin_info["duration"])


            // Check if bulletin_info has all required information
            check_information(bulletin_info)

            // Try to save the ticket on database
            saveBulletin(bulletin_info).then((result) => {
                console.log(result)
                resolve(result)
            }).catch((error) => {
                reject(error.message)
            })

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
