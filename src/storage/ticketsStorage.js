import { getDatabase } from "./database";
import { getSession } from "./sessionStorage";



function getTicketsSaved(duration) {
    let db = getDatabase()
    
    let results

    db.transaction((tx) => {
        tx.executeSql(
        `select * from items where duration = ?;`,
        [30],
        (_, { rows: { _array } }) => results = _array
        );
    });

    console.log(results)
    return results
}


function payTicket(id) {
    let db =  getDatabase()
}


export function deleteOldTickets() {
    let db = getDatabase()
    db.transaction((tx) => {
        tx.executeSql(`
            DELETE FROM tickets
            WHERE created_at < datetime('now', '-1 day')
                AND paid = 1;
        `)
    })
}



// Save a ticket into database
// @param ticket_info : dictionary with all ticket info 
// (responsible, duration, registration, price, paid, zone_id, created_at)
export function saveTicket(ticket_info) {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction(
            (tx) => {
            tx.executeSql(
                "INSERT INTO tickets (responsible, duration, registration, price, paid, zone_id) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    ticket_info["responsible"], 
                    ticket_info["duration"], 
                    ticket_info["registration"], 
                    ticket_info["price"], 
                    ticket_info["paid"], 
                    ticket_info["zone_id"]
                ], 
                (result) => resolve(result),
                (error) => reject(null));
            },
            null,
            null
        );
    })
}