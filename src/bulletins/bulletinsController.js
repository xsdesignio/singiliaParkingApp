import { Alert } from "react-native"
import { getSession } from "../session/sessionStorage"
import { saveBulletin, payBulletinLocally, addPendingBulletinToPayOnServer } from "./storage/bulletinsStorage";
import { createBulletinOnServer, payBulletinOnServer } from "./api_conn/apiConn";
import { getConfigValue } from "../configStorage";




export async function createAndPrintBulletin(printer, bulletinInfo) {
    try {

        const { connectedDevice, printBulletin } = printer

        // Obtaining required data to create the ticket
        console.log(connectedDevice)
        if(connectedDevice == null) {
            throw new Error("No se ha encontrado ninguna impresora conectada.")
        }

        let session = await getSession()
        let zone = await getConfigValue("zone")

        let price = getBulletinPrice(bulletinInfo["duration"])

        console.log("Fecha:", new Date().toLocaleString('es-ES').replace(",", ""))

        let bulletin_dict = {
            ...bulletinInfo,
            "responsible_id": session["id"],
            "zone_name": zone,
            "price": price,
            "created_at": new Date().toLocaleString('es-ES').replace(",", ""),
        }

         // Check if ticket_info has all required information and create the ticket on the server
        check_information(bulletin_dict)

        printBulletin({
            "Zona": bulletin_dict["zone_name"],
            "Duración": bulletin_dict["duration"] + " min",
            "Matrícula": bulletin_dict["registration"],
            "Importe": bulletin_dict["price"] + "0 eur",
            "Precepto": bulletin_dict["precept"],
            "Fecha": bulletin_dict["created_at"].split(" ")[0],
            "Hora": bulletin_dict["created_at"].split(" ")[1] + "h",
        })


        let server_bulletin = await createBulletinOnServer(bulletin_dict)


        // If the bulletin has been successfully created on the server, saave it locally
        // Otherwise, save it locally with a reference_id of -1 so it can be uploaded later
        if(server_bulletin) {
            bulletin_dict["reference_id"] = server_bulletin["id"]
            bulletin_dict["created_at"] = server_bulletin["created_at"]
        } else {
            bulletin_dict["reference_id"] = -1
        }
        
        let result = await saveBulletin(bulletin_dict)
            
        if(result == null) {
            throw new Error("Error al guardar el boletín")
        } 
 
        // If everything went well, show a success message
        Alert.alert(`Boletín Creado`, "El boletín ha sido creado he impreso con éxito")
        return(bulletin_dict)
    }
    catch(error) {
        console.log(error)
        Alert.alert("Error al imprimir el boletín", error.message)
    }
}



// Pay a certain bulletin, updating it's paid status on the server and locally
// Create an alert with the result of the operation
// @param bulletin_id, id of the bulletin to pay (from the local database)
export async function payBulletin(bulletin_id) {
    const paymentMethods = [
        {
            text: "Efectivo",
            method: "CASH",
        },
        {
            text: "Tarjeta",
            method: "CARD",
        },
    ];

    Alert.alert("Pagar Boletín", "Elige el método de pago", paymentMethods.map((method) => ({
        text: method.text,
        onPress: () => {
            pay(bulletin_id, method.method);
        },
    })));
}



async function pay(bulletin_id, payment_method) {
    try {
        let paid_locally = await payBulletinLocally(bulletin_id, payment_method)

        if(!paid_locally)
            throw new Error("Error al pagar el boletín")
            
        let sent_to_server = await payBulletinOnServer(bulletin_id, payment_method)

        if(!sent_to_server) 
            await addBulletinToUploadQueue(bulletin_id, payment_method)

        setTimeout(() => {
            Alert.alert("Boletín Pagado", "El boletín ha sido pagado con éxito", [{
                text: "Ok",
            }]);
        }, 100); // Show the second alert after a 100ms delay
        
    } catch (error) {
        
        setTimeout(() => {
            Alert.alert("Error al pagar el boletín", "Ha ocurrido un error", [{
                text: "Ok",
            }]);
        }, 100); // Show the second alert after a 100ms delay
    }
}



function check_information(bulletin_info) {
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
    
    if (!bulletin_info["zone_name"] || bulletin_info["zone_name"] == "") 
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

    if(duration <= 30) 
        return 0.7
    
    if(duration <= 60) 
        return 0.9
    
    if(duration <= 90) 
        return 1.4
    
    return 1.8
    
}



// Add a bulletin to the upload queue
// @param bulletin_id, id of the bulletin to add to the upload queue
export async function addBulletinToUploadQueue(bulletin_id) {
    // Save on async storage the id of the bulletin to upload
    await addPendingBulletinToPayOnServer(bulletin_id)
}