import { getDatabase } from "./database";
import { getSession } from "./sessionStorage";



export function getTicketsSaved(duration) {
    return new Promise((resolve, reject) => {
        let db = getDatabase()
        db.transaction((tx) => {
            tx.executeSql(
            `SELECT * FROM tickets WHERE duration = ?;`,
            [duration],
            (_, { rows: { _array } }) => resolve(_array),
            (_, error) => reject(error.message))
        }, 
        (error) => {
            reject(error.message)
        });
    })
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
                "INSERT INTO tickets (responsible, duration, registration, price, paid, location) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    ticket_info["responsible"], 
                    ticket_info["duration"], 
                    ticket_info["registration"], 
                    ticket_info["price"], 
                    ticket_info["paid"], 
                    ticket_info["location"]
                ], 
                (_, result) => resolve(result),
                (_, error) => reject(error.message));
            },
            (error) => {
                reject(error.message)
            }
        );
    })
}