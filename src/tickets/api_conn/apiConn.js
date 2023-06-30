


const apiHost = "http://192.168.0.24:5000"



export function registerTicket(ticket_data) {

    fetch( `${ apiHost }/tickets/create` , {
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
}

export function payTicket(ticket_id) {

}

export function registerBulletin() {

}


export function payBulletin() {
    
}
