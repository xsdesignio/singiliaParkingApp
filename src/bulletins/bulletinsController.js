import { Alert } from "react-native"
import { getSession } from "../session/sessionStorage"
import { saveBulletin, payBulletinLocally, addPendingBulletinToPayOnServer } from "./storage/bulletinsStorage";
import { createBulletinOnServer, payBulletinOnServer } from "./api_conn/apiConn";
import { obtainAvailableBulletins } from "./availableBulletins";
import { getConfigValue } from "../configStorage";
import { obtainAssignedZone } from "../zone_manager";


export async function createAndPrintBulletin(printer, bulletinInfo) {
    try {

        const { connectedDevice, printBulletin } = printer

        if(connectedDevice == null) {
            console.log("Simulando impresión: no se ha encontrado ninguna impresora conectada.")
            //throw new Error("No se ha encontrado ninguna impresora conectada.")
        }

        let session = await getSession()
        let zone = await getConfigValue("zone")
        if (zone == null || zone == undefined)
            zone = await obtainAssignedZone()


        let bulletin_dict = {
            ...bulletinInfo,
            "responsible_id": session["id"],
            "zone_name": zone,
            "created_at": new Date().toLocaleString('es-ES').replace(",", ""),
        }

         // Check if ticket_info has all required information and create the ticket on the server
        check_information(bulletin_dict)


        bulletin_dict["created_at"] = convertDateFormat(bulletin_dict["created_at"])
        
        let server_bulletin = await createBulletinOnServer(bulletin_dict)


        // If the bulletin has been successfully created on the server, saave it locally
        // Otherwise, save it locally with a reference_id of -1 so it can be uploaded later
        if(!server_bulletin) {
            throw new Error("Error al crear el boletín")
        }

        bulletin_dict["id"] = server_bulletin["id"]
        bulletin_dict["created_at"] = server_bulletin["created_at"]
        
        let available_bulletins = await obtainAvailableBulletins()
        printBulletin(formatBulletinToBePrinted(bulletin_dict), available_bulletins)
        
        let result = await saveBulletin(bulletin_dict)
        if(result == null) {
            throw new Error("Error al guardar el boletín")
        } 

        Alert.alert("Boletín Creado", "El boletín ha sido creado he impreso con éxito", 
            [
                {text: "Cancelar"}, 
                {text: "Volver a imprimir", onPress: () => {
                    printBulletin(formatBulletinToBePrinted(bulletin_dict))
                }}
            ]
        );
 
        return bulletin_dict
    }
    catch(error) {
        Alert.alert("Error al imprimir el boletín", error.message)
    }
}


function formatBulletinToBePrinted(bulletin) {
    return {
        "Id": bulletin["id"],
        "Zona": bulletin["zone_name"],
        "Matrícula": bulletin["registration"],
        "Precepto": bulletin["precept"],
        "Fecha": bulletin["created_at"].split(" ")[0],
        "Hora": bulletin["created_at"].split(" ")[1] +"h",
    }
}


// Pay a certain bulletin, updating it's paid status on the server and locally
// Create an alert with the result of the operation
// @param bulletin_id, id of the bulletin to pay (from the local database)
export async function cancelBulletin(printer, id, payment_method, duration, price) {
    try {

        const { connectedDevice, printBulletinCancellation } = printer
        
        if (connectedDevice == null) {
            console.log("Simulando impresión: no se ha encontrado ninguna impresora conectada.")
            //throw new Error("No se ha encontrado ninguna impresora conectada.")
        }
        
        let paid_bulletin = await payBulletinOnServer(id, payment_method, price, duration)

        if(paid_bulletin == null) 
            throw new Error("Error al pagar el boletín")
            //await addBulletinToUploadQueue(id, payment_method, duration, price)
        
        let paid_locally = await payBulletinLocally(id, payment_method, duration, price)

        printBulletinCancellation(formatBulletinCancellationToBePrinted(paid_bulletin))

        if(!paid_locally)
            throw new Error("Error al pagar el boletín")

        setTimeout(() => {
            Alert.alert("Boletín Pagado", "El boletín ha sido pagado con éxito", [{
                text: "Ok",
            }]);
        }, 100); // Show the second alert after a 100ms delay
        
        return true
    } catch (error) {
        console.log(error)
        setTimeout(() => {
            Alert.alert("Error", "Ha ocurrido un error al pagar el boletín", [{
                text: "Ok",
            }]);
        }, 100); // Show the second alert after a 100ms delay
    }
}



function formatBulletinCancellationToBePrinted(bulletin) {
    return  {
        "Id": bulletin["id"],
        "Matrícula": bulletin["registration"],
        "duration": bulletin["duration"],
        "price": bulletin["price"],
        "created_at": bulletin["created_at"],
        "paid": bulletin["paid"],
        "payment_method": bulletin["payment_method"]
    }
}


function check_information(bulletin_info) {
    // Check if bulletin_info has all required information

    if (!bulletin_info["responsible_id"] || bulletin_info["responsible_id"] == "") 
        throw new Error("No se ha encontrado el nombre del responsable.")
    
    if (!bulletin_info["registration"] || bulletin_info["registration"] == "") 
        throw new Error("No se ha encontrado la matrícula del vehículo.")
    
    if (!bulletin_info["zone_name"] || bulletin_info["zone_name"] == "") 
        throw new Error("No se ha encontrado la ubicación del boletín.")
    
}


// Add a bulletin to the upload queue
// @param bulletin_id, id of the bulletin to add to the upload queue
export async function addBulletinToUploadQueue(bulletin_id) {
    // Save on async storage the id of the bulletin to upload
    await addPendingBulletinToPayOnServer(bulletin_id)
}




function convertDateFormat(input) {
    const [day, month, yearTime] = input.split('/');
    const [year, time] = yearTime.split(' ');

    return `${year}/${month}/${day} ${time}`;
}