// Synchronize device data with server

import { createTicketOnServer } from "./apiConn"

export default function syncData() {
    
}



function sendTicketsToServer(tickets) {
    tickets.forEach(ticket => {
        createTicketOnServer(ticket.duration, ticket.registration, ticket.paid)
    })
}

