import { storeSession, deleteSession  } from "./sessionStorage";
import { setConfigValue } from "../configStorage";
import { deleteAllBulletins } from "../bulletins/storage/bulletinsStorage";
import { API_URL } from "@env"
import { deleteAllTickets } from "../tickets/storage/ticketsStorage";

const apiHost = API_URL

// Login user, store the session and redirect to printing page
// @param form: dict with email and password keys
// @reurns a promise where "resolve" returns a dict with the session info and ""reject" returns a message indicating the produced error during login
export function loginUser(form) {
    return new Promise( (resolve, reject) => {

        fetch( `${ apiHost }/auth/login` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        .then( response_json => {
            // Throw an error when server returns an error
            if(response_json.status != 200)
                throw new Error("Los datos introducidos son incorrectos o no se encuentra conectado a internet.")
            
            // If request was made successfully
            let session_response = response_json.json()
            return session_response
        })
        .then( session => {
            // Store the session returned
            // Resolve with the session if stored successfully or reject with an error message otherwise
            console.log(session.associated_zone)

            if (!(session.associated_zone == null || session.associated_zone == undefined))
                setConfigValue("zone", session.associated_zone)


            storeSession(session)
                .then(isStored => {

                    if(isStored == true)
                        resolve(session)
                    else
                        throw new Error("Los datos son correctos pero no se han podido almacenar correctamente. Inténtalo de nuevo")
                
                })
                .catch(error => {
                    reject(error)
                })
        })
        .catch(error => {
            console.log("Error here on login:")
            console.log(error.message)
            reject(error.message)
        })
    }) 
}



export async function logoutUser() {
    return new Promise( (resolve) => {
        fetch( `${ apiHost }/auth/logout`)
        .then( async (response_json) => {
            // Throw an error when server returns an error
            console.log("Response json")
            console.log(response_json.toString())
            console.log("loging out 3")
            if(response_json.status != 200)
                throw new Error("Ha ocurrido un error cerrando sesión, si no ha sido cerrada inténtelo de nuevo.")
            
            await setConfigValue("zone", undefined)
            await deleteAllTickets()
            await deleteAllBulletins()
            await deleteSession()
            resolve(true)

        }).catch(error => {
            console.log("Error here at logout:")
            console.log(error.message)
            resolve(false)
        })
    })
}

// Check if the user is logged in and if so, return the session info
// @returns a promise where "resolve" returns a dict with the session info and "reject" returns a message indicating the produced error during login
export function getServerSession() {
    return new Promise( (resolve) => {
        fetch( `${ apiHost }/auth/session` )
        .then( response_json => {
            if(response_json.status != 200)
                throw new Error("No se ha podido obtener la sesión actual")
            
            // If request was made successfully
            let session_response = response_json.json()
            return session_response
        })
        .then( session => {
            // Resolve with the session if stored successfully or reject with an error message otherwise
            resolve(session)
        })
        .catch(error => {
            resolve(null)
        })
    }) 
}

