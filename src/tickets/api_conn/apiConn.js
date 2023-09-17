import { API_URL } from "@env"

const apiHost = API_URL

export function createTicketOnServer(ticket_info) {
    console.log("This is ticket that is going to be created on server:")
    console.log(ticket_info)
    return new Promise((resolve) => {

        fetch( `${ apiHost }/tickets/create` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket_info)
        })
        .then( response => {
            console.log("Trying to create ticket on server")
            console.log(response.status)
            if(response.status != 200)
                throw new Error("Los datos introducidos son incorrectos o no se encuentra conectado a internet.")
            
            return response.json()
        })
        .then(ticket => {
            console.log("Ticket created on server:", ticket)
            resolve(ticket)
        })
        .catch((error) => {
            console.log("Error here on tickets api conn:")
            console.log(error)
            resolve(null)
        })
    })
}
