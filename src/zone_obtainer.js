// Fetch the url 
import { setConfigValue } from "./configStorage"   

const apiHost = "http://192.168.0.24:5000"



export async function obtainAssignedZone () {
    return new Promise( (resolve, reject) => {
        fetch( `${ apiHost }/users/get-assigned-zone`)
        .then( response_json => {
            console.log("response json: ")
            console.log(response_json)
            // Throw an error when server returns an error
            if(response_json.status != 200)
                throw new Error("Ha ocurrido un error obteniendo la zona asignada, inténtelo de nuevo.")
            
            // If request was made successfully
            let session_response = response_json.json()
            return session_response
        })
        .then( async (response) =>  {
            // Store the session returned
            // Resolve with the session if stored successfully or reject with an error message otherwise
            console.log(response.zone)

            if (!(response.zone == null || response.zone == undefined)){
                await setConfigValue("zone", response.zone)
                resolve(response.zone)
            }
        })
        .catch(error => {
            console.log("Leaving obtainAssignedZone with error: " + error.toString())
            reject(error.toString())
        })
    })
}