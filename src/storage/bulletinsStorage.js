import { getDatabase } from "./database";
import { getSession } from "./sessionStorage";



export function getBulletinsSaved(duration) {
    let db = getDatabase()

    return new Promise(() => {
        db.transaction((tx) => {
            tx.executeSql(
            `SELECT * FROM bulletins WHERE duration = ?;`,
            [duration],
            (_, { rows: { _array } }) => resolve(_array)
            );
        }, (error) => {
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
export function saveBulletin(bulletin_info) {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction(
            (tx) => {
            tx.executeSql(
                "INSERT INTO bulletins (responsible, duration, registration, price, paid, zone_id) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    bulletin_info["responsible"], 
                    bulletin_info["duration"], 
                    bulletin_info["registration"], 
                    bulletin_info["price"], 
                    bulletin_info["paid"], 
                    bulletin_info["zone_id"]
                ], 
                (result) => resolve(result),
                (error) => reject(null));
            },
            null,
            null
        );
    })
}