// Fetch the url 
import { setConfigValue } from "./configStorage"
import { API_URL } from "./enviroment"   
import { getSession } from "./session/sessionStorage"

const apiHost = API_URL 

export async function obtainAssignedZone () {
    
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


export async function obtainAvailableZones () {
        
        return new Promise( (resolve) => {
            fetch( `${ apiHost }/zones/get-available-zones`)
            .then( response_json => {
                // Throw an error when server returns an error
                if(response_json.status != 200)
                    throw new Error("Ha ocurrido un error obteniendo las zonas disponibles, inténtelo de nuevo.")
                
                let session_response = response_json.json()
                return session_response
            })
            .then( async (response) =>  {
                // Store the session returned
                // Resolve with the session if stored successfully or reject with an error message otherwise
                if (!(response == null || response == undefined)){

                    await setConfigValue("available_zones",response)

                    resolve(response)
                }
            })
            .catch(error => {
                console.log(error)
                resolve(null)
            })
        })
    
}


export async function assignZone(zone_name) {
    /* Assign new zone to server user */
    
    let session = await getSession()
    let user_id = session.id

    let formData = new FormData()
    formData.append('zone', zone_name)

    return new Promise((resolve) => {
        fetch( `${ apiHost }/users/user/${user_id}/assign-zone/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
        .then((response) => {
            if(response.status != 302)
                throw new Error()
            
            resolve(true)
        }).catch(() => {
            resolve(false)
        })
    })
    
}
