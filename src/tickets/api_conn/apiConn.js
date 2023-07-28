

const apiHost = "http://192.168.0.24:5000"


export function createTicketOnServer(ticket_info) {
    
    return new Promise((resolve) => {

        fetch( `${ apiHost }/tickets/create` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket_info)
        })
        .then( response => {
            if(response.status != 200)
                throw new Error("Los datos introducidos son incorrectos o no se encuentra conectado a internet.")
                    
            return response.json()
        })
        .then(ticket => resolve(ticket))
        .catch(() => resolve(null))
    })
}

/* 
export function payTicket(ticket_id) {
    return new Promise((resolve, reject) => {


        fetch( `${ apiHost }/tickets/pay/${ticket_id}` , {
            method: 'POST',
        })
        .then( response => {
            // Throw an error when server returns an error

            if(response.status == 400)
                throw new Error("El ticket introducido no existe.")
            
            if(response.status != 200)
                throw new Error("Ha ocurrido un error al pagar el ticket.")
            
            // If request was made successfully
            return response.json()
        })
        .then( response_json => {

            let message = response_json["message"]
            resolve(message)

        })
        .catch(error => reject(error.message))
    })

}
 */