import { getSession } from "../storage/sessionStorage"
import { saveTicket } from "../storage/ticketsStorage"



export function printTicket(registration, duration, created_at) {
    // Simulate printing by the moment;

    createTicket
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Ticket printed successfully")
        }, 6000)
    })
}

export function createTicket(duration, registration, paid) {
    let session = getSession()

    let ticket_info = {
        "responsible": session["name"],
        "duration": duration,
        "registration": registration,
        "paid": paid,
        "zone_id": 0,
    }
    
    saveTicket(ticket_info).then((result) => {
        
    })

    console.log(ticket)

    return ticket
}

