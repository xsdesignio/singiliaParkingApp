import { createTicketOnServer } from "./apiConn.js"
import { getTicketsWithoutReference, addReferenceToTicket } from "../storage/ticketsStorage.js"

export async function synchronizeTickets() {
    let tickets_without_reference = await getTicketsWithoutReference()
    tickets_without_reference.forEach(async (ticket) => {
        try {
            let created_ticket = await createTicketOnServer(ticket)
            if(created_ticket)
                await addReferenceToTicket(ticket["id"], created_ticket["id"])
        } catch(error) {
            console.log(error)
        }
    });

}