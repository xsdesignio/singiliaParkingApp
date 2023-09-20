import { API_URL } from "@env"

const apiHost = API_URL || process.env.API_URL

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
        .then(ticket => {
            resolve(ticket)
        })
        .catch((error) => {
            console.log("Error here on tickets api conn:")
            console.log(error)
            resolve(null)
        })
    })
}
