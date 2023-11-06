import { Alert } from "react-native"
import { getSession } from "../session/sessionStorage"
import { saveBulletin, payBulletinLocally, addPendingBulletinToPayOnServer } from "./storage/bulletinsStorage";
import { createBulletinOnServer, payBulletinOnServer } from "./api_conn/apiConn";
import { obtainAvailableBulletins } from "./availableBulletins";
import { getConfigValue } from "../configStorage";
import { obtainAssignedZone } from "../zone_manager";


// Pay a certain bulletin, updating it's paid status on the server and locally
// Create an alert with the result of the operation
// @param printer, printer provider containing functions to work with the printer
// @param bulletinInfo, dictionary with the bulletin  information
export async function createAndPrintBulletin(printer, bulletinInfo) {
    try {

        // obtain required functions from printer provider
        const { connectedDevice, printBulletin } = printer

        if(connectedDevice == null) {
            // console.log("Simulando impresión: no se ha encontrado ninguna impresora conectada.")
            throw new Error("No se ha encontrado ninguna impresora conectada.")
        }

        let zone = await getConfigValue("zone")
        if (zone == null || zone == undefined)
            zone = await obtainAssignedZone()


        let bulletin_dict = {
            ...bulletinInfo,
            "responsible_id": (await getSession())["id"],
            "zone_name": zone,
            "created_at": obtainDateTime()
        }

         // Check if ticket_info has all required information and crete the ticket on server
        check_information(bulletin_dict)
        let server_bulletin = await createBulletinOnServer(bulletin_dict)
        if(!server_bulletin) {
            throw new Error("Error al crear el boletín en el servidor. Inténtalo de nuevo o Revisa la conexión a internet.")
        }

        bulletin_dict["id"] = server_bulletin["id"]
        bulletin_dict["created_at"] = server_bulletin["created_at"]
        

        // Print bulletin
        let formatted_bulletin = formatBulletinToBePrinted(bulletin_dict)
        let available_bulletins = await obtainAvailableBulletins()
        await printBulletin(formatted_bulletin, available_bulletins)

        // Save bulletin locally after printing
        let result = await saveBulletin(bulletin_dict) // Save bulletin on local db
        if(result == null) {
            throw new Error("Error al guardar el boletín")
        } 

        Alert.alert("Boletín Creado", "El boletín ha sido creado he impreso con éxito", 
            [
                {text: "Cancelar"}, 
                {text: "Volver a imprimir", onPress: async () => {
                    await printBulletin(formatted_bulletin, available_bulletins)
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
            // console.log("Simulando impresión: no se ha encontrado ninguna impresora conectada.")
            throw new Error("No se ha encontrado ninguna impresora conectada.")
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
        }, 100);
        return false // Show the second alert after a 100ms delay
    }
}



function formatBulletinCancellationToBePrinted(bulletin) {
    return  {
        "Id": bulletin["id"],
        "Matrícula": bulletin["registration"],
        "Duración": bulletin["duration"],
        "Precio": bulletin["price"],
        "Fecha": bulletin["created_at"],
        "Estado": bulletin["paid"] ? "pagado" : "aún por pagar",
        "Método de pago": bulletin["payment_method"]
    }
}


function check_information(bulletin_info) {
    // Check if bulletin_info has all required information

    if (!bulletin_info["responsible_id"] || bulletin_info["responsible_id"] == "") 
        throw new Error("No se ha encontrado el nombre del responsable.")
    
    if (!bulletin_info["registration"] || bulletin_info["registration"] == "") 
        throw new Error("No se ha encontrado la matrícula del vehículo.")
    
    if (!bulletin_info["precept"] || bulletin_info["precept"] == "") 
        throw new Error("No se ha encontrado el precepto del boletín.")

    if (!bulletin_info["zone_name"] || bulletin_info["zone_name"] == "") 
    throw new Error("No se ha encontrado la ubicación del boletín.")
    
}


// Add a bulletin to the upload queue
// @param bulletin_id, id of the bulletin to add to the upload queue
export async function addBulletinToUploadQueue(bulletin_id) {
    // Save on async storage the id of the bulletin to upload
    await addPendingBulletinToPayOnServer(bulletin_id)
}



function obtainDateTime() {
    let date = new Date().toLocaleString('es-ES').replace(",", "")
    const [day, month, yearTime] = date.split('/');
    const [year, time] = yearTime.split(' ');
    return `${year}/${month}/${day} ${time}`;
}