import { storeSession, deleteSession, getSessionFromDatabase  } from "./sessionStorage";


const apiHost = "http://192.168.0.24:5000"


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
            session_response = response_json.json()
            return session_response
        })
        .then( session => {
            // Store the session returned
            // Resolve with the session if stored successfully or reject with an error message otherwise
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
        .catch(error => reject(error.toString()))
    }) 
}



export async function logoutUser() {
    return new Promise( (resolve, reject) => {
        fetch( `${ apiHost }/auth/logout`)
        .then( response_json => {
            // Throw an error when server returns an error
            if(response_json.status != 200)
                throw new Error("Ha ocurrido un error cerrando sesión, si no ha sido cerrada inténtelo de nuevo.")
            
            deleteSession()
            resolve(true)

        }).catch(error => {
            reject(error)
        })
    })
}

