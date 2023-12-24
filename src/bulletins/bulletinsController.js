import { Alert } from "react-native"
import { getSession } from "../session/sessionStorage"
import { saveBulletin, payBulletinLocally, addPendingBulletinToPayOnServer } from "./storage/bulletinsStorage";
import { createBulletinOnServer, payBulletinOnServer } from "./api_conn/apiConn";
import { getConfigValue } from "../configStorage";
import { obtainAssignedZone } from "../zone_manager";




// Create a bulletin (such in server as locally) and print it
// Create an alert with the result of the operation
// @param printer, printer provider containing functions to work with the printer
// @param bulletinInfo, dictionary with the bulletin information
export async function createAndPrintBulletin(printer, bulletinInfo) {
    try {

        // obtain required functions from printer provider
        const { connectedDevice, printBulletin } = printer
        
        if(connectedDevice == null) {
            throw new Error("No se ha encontrado ninguna impresora conectada.")
        }

        let session = await getSession()
        let zone = await getConfigValue("zone")
        if (zone == null || zone == undefined)
            zone = await obtainAssignedZone()

        let bulletin_dict = {
            "responsible_id": session["id"],
            "zone_name": zone,
            "created_at": obtainDateTime(),
            ...bulletinInfo,
        }

         // Check if ticket_info has all required information and crete the ticket on server
        check_information(bulletin_dict)
        
        // Creating the ticket in the server
        let server_bulletin = await createBulletinOnServer(bulletin_dict)
        if(!server_bulletin) 
            throw new Error("Error al crear el boletín en el servidor. Inténtalo de nuevo o Revisa la conexión a internet.")
        else
            bulletin_dict["id"] = server_bulletin["id"] // Adding id reveived from server
        

        // Print bulletin
        await printBulletin(formatBulletinToBePrinted(bulletin_dict))

        // Once printed, save the bulletin locally
        let result = await saveBulletin(bulletin_dict) // Save bulletin on local db
        if(result == null) {
            throw new Error("Error al guardar el boletín")
        } 

        // If everything went well, show a success message
        Alert.alert("Boletín Creado", "El boletín ha sido creado he impreso con éxito", 
            [
                {text: "Cancelar"}, 
                {text: "Volver a imprimir", onPress: async () => {
                    await printBulletin(formatBulletinToBePrinted(bulletin_dict))
                }}
            ]
        );
 
        return bulletin_dict
    }
    catch(error) {
        Alert.alert("Error al imprimir el boletín", error.message)
    }
}


export function formatBulletinToBePrinted(bulletin) {

    let date = formatDate(bulletin["created_at"].split(" ")[0])
    let time = `${ bulletin["created_at"].split(" ")[1].substring(0, 5) } h`


    let result = {
        "Id": bulletin["id"],
        "Hora": time,
        "Zona": bulletin["zone_name"],
        "Matrícula": bulletin["registration"],
        "Precepto": bulletin["precept"],
        "Fecha": date,
    }

    if(bulletin["brand"] != undefined && bulletin["brand"] != "") 
        result["Marca"] = bulletin["brand"]

    if(bulletin["model"] != undefined && bulletin["model"] != "") 
        result["Modelo"] = bulletin["model"]

    if(bulletin["color"] != undefined && bulletin["color"] != "") 
        result["Color"] = bulletin["color"]

    return result
    
}


// Pay a certain bulletin, updating it's paid status on the server and locally
// Create an alert with the result of the operation
// @param bulletin_id, id of the bulletin to pay (from the local database)
export async function cancelBulletin(printer, id, payment_method, duration, price) {
    try {

        const { connectedDevice, printBulletinCancellation } = printer
        
        if (connectedDevice == null) {
            throw new Error("No se ha encontrado ninguna impresora conectada.")
        }
        
        let paid_bulletin = await payBulletinOnServer(id, payment_method, price, duration)

        if(paid_bulletin == null) 
            throw new Error("Error al pagar el boletín")
            //await addBulletinToUploadQueue(id, payment_method, duration, price)
        
            
        await payBulletinLocally(id, payment_method, duration, price)

        await printBulletinCancellation(formatBulletinCancellationToBePrinted(paid_bulletin))

        setTimeout(() => {
            Alert.alert("Boletín Pagado", "El boletín ha sido pagado con éxito", [{
                text: "Ok",
            }]);
        }, 100); // Show the second alert after a 100ms delay
        
        return true
    } catch (error) {
        setTimeout(() => {
            Alert.alert("Error", error.message, [{
                text: "Ok",
            }]);
        }, 100);
        return false // Show the second alert after a 100ms delay
    }
}



export function formatBulletinCancellationToBePrinted(bulletin) {
    let date = formatDate(bulletin["created_at"].split(" ")[0]);
    let time = `${bulletin["created_at"].split(" ")[1].substring(0, 5)} h`;

    return  {
        "Id": bulletin["id"],
        "Matrícula": bulletin["registration"],
        "Duración": bulletin["duration"],
        "Importe": bulletin["price"] + " eur",
        "Estado": bulletin["paid"] ? "pagado" : "aún por pagar",
        "Método de pago": bulletin["payment_method"] === "CASH" ? "Efectivo" : "Tarjeta",
        "Fecha": date,
        "Hora": time
    }
}

function formatDate(date) {
    let elements = date.split(/[/-]/)
    let day = elements[2]
    let month = elements[1]
    let year = elements[0]

    return `${day}/${month}/${year}`
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