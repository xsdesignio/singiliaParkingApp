import { getTicketPrice } from "../utils"
import { getConfigValue, check_information } from "../utils"


const apiHost = "http://192.168.0.24:5000"


export function createTicketOnServer(duration, registration, paid = false) {
    return new Promise((resolve, reject) => {
        let price = getTicketPrice(duration)

        let location = getConfigValue("location")
        
        let ticket_info = {
            "duration": duration || 30,
            "registration": registration,
            "price": price || 0.7,
            "paid": paid,
            "location": location,
        }

        check_information(ticket_info)

        fetch( `${ apiHost }/tickets/create` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket_info)
        })
        .then( response => {
            // Throw an error when server returns an error

            if(response.status != 200)
                throw new Error("Los datos introducidos son incorrectos o no se encuentra conectado a internet.")
            
            // If request was made successfully
            return response.json()
        })
        .then( ticket => {
            resolve(ticket)
        })
        .catch(error => reject(error.message))
    })
}


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
