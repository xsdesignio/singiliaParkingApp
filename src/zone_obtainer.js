// Fetch the url 
import { setConfigValue } from "./configStorage"   

const apiHost = "http://192.168.232.96:5000"



export async function obtainAssignedZone () {
    console.log("Entering obtainAssignedZone")
    return new Promise( (resolve) => {
        fetch( `${ apiHost }/users/get-assigned-zone`)
        .then( response_json => {
            // Throw an error when server returns an error
            if(response_json.status != 200)
                throw new Error("Ha ocurrido un error obteniendo la zona asignada, inténtelo de nuevo.")
            
            let session_response = response_json.json()
            return session_response
        })
        .then( async (response) =>  {
            // Store the session returned
            // Resolve with the session if stored successfully or reject with an error message otherwise
            if (!(response.zone == null || response.zone == undefined)){
                await setConfigValue("zone", response.zone)
                resolve(response.zone)
            }
        })
        .catch(error => {
            console.log(error)
            resolve(null)
        })
    })
}