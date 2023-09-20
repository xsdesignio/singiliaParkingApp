import { getDatabase } from "../../database";


// Get all tickets saved in the database
// @returns a promise with the tickets array
export function getTicketsSaved() {
    return new Promise((resolve, reject) => {
      let db = getDatabase();
  
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT * FROM tickets;",
            [],
            (_, result) => {
              resolve(result.rows._array);
            },
            (_, error) => {
                reject(error.message)
                return true
            }
          );
        },
        (error) => reject(error.message),
        () => {}
      );
    });
  }

// Get all tickets saved in the database
// @returns a promise with the tickets array
// @param duration: if given, only tickets with the given duration will be returned
export function getTicketsByDuration(duration = null) {

    if(duration != null && duration != undefined && duration <= 0)
        return getTicketsSaved()

    return new Promise((resolve, reject) => {
      let db = getDatabase();
      let query = "SELECT * FROM tickets WHERE duration = ?";

      db.transaction(
        (tx) => {
          tx.executeSql(
            query,
            [duration],
            (_, result) => {
              resolve(result.rows._array);
            },
            (_, error) => {
                reject(error.message)
                return true
            }
          );
        },
        (error) => reject(error.message), // Manejo de errores de la transacción
        () => {} // Opcional: función de éxito para la transacción
      );
    });
  }
  

// Set the ticket with the given id as paid
// @param id: id of the ticket to be paid
// @returns a promise with the ticket paid
// @throws an error if the ticket doesn't exist or the ticket is already paid
export function payTicket(id) {
    // check if the ticket exists and is not paid
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction((tx) => {

            // check if the ticket exists and is not paid
            tx.executeSql(
                "SELECT * FROM tickets WHERE id = ?",
                [id],
                (_, result) => {
                    if(result.rows._array.length == 0) {
                        reject("Ticket doesn't exist")
                        return
                    }
                    if(result.rows._array[0]["paid"] == 1) {
                        reject("Ticket already paid")
                        return
                    }
                    resolve(result.rows._array[0])
                },
                (_, error) => reject(error.message)
            )

            // set the ticket as paid
            tx.executeSql(
                "UPDATE tickets SET paid = 1 WHERE id = ?",
                [id],
                (_, result) => resolve(result.rows._array),
                (_, error) => reject(error.message)
            )
        }, 
        (error) => {
            reject(error.message)
        }, null)
    })
}



// Delete all tickets older than 1 day and paid
// @returns a promise with the deleted tickets
export function deleteOldTickets() {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM tickets WHERE paid = 1 AND created_at < datetime('now', '-1 day')",
                [],
                (_, result) => resolve(result.rows._array),
                (_, error) => reject(error.message)
            )
        })
    })
    
}


export function deleteAllTickets() {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM tickets",
                [],
                (_, result) => resolve(result.rows._array),
                (_, error) => reject(error.message)
            )
        })
    })
}


// Save a ticket into database
// @param ticket_info : dictionary with all ticket information
// Required keys (responsible, duration, registration, price, paid, zone_id, created_at)
export function saveTicket(ticket_info) {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction(
            (tx) => {
            tx.executeSql(
                "INSERT INTO tickets (responsible_id, zone_name, duration, registration, price, payment_method, paid, reference_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    ticket_info["responsible_id"], 
                    ticket_info["zone"], 
                    ticket_info["duration"], 
                    ticket_info["registration"], 
                    ticket_info["price"], 
                    ticket_info["payment_method"], 
                    ticket_info["paid"], 
                    ticket_info["reference_id"] || -1, 
                ], 
                (_, result) => {
                    resolve(result)
                },
                (_, error) => reject(error.message));
            },
            (error) => {
                console.log("Error here on saveTicket:")
                console.log(error.message)
                reject(error.message)
            }
        );
    })
}


// get all bulletins with reference_id = -1
// @returns a promise with the bulletins array
export function getTicketsWithoutReference() {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction(
            (tx) => {
                tx.executeSql(
                    "SELECT * FROM tickets WHERE reference_id = -1",
                    [],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error.message)
                )
            }
        )
    })
}


export function addReferenceToTicket(id, reference_id) {
    /* Generate the code to modify the reference_if for the ticket with the id given */
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction(
            (tx) => {
                tx.executeSql(
                    "UPDATE tickets SET reference_id = ? WHERE id = ?",
                    [reference_id, id],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error.message)
                )
            }
        )
    })
}