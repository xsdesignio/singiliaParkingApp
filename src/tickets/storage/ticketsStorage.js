import { getDatabase } from "../../database";


function roundDecimals(num) {
    return Math.round(num * 100) / 100;
}


// Function to get bulletins created today and categorize them
export function getDailyTicketsSummary() {
    return new Promise((resolve, reject) => {
        let db = getDatabase();
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM tickets WHERE created_at >= date('now', 'localtime')",
                // "SELECT * FROM tickets WHERE date(created_at, 'localtime') = date('now', 'localtime')",
                [],
                (_, result) => {
                    const tickets = result.rows._array;

                    // Initialize summary structure
                    const summary = {
                        "Cantidad": 0,
                        "Tarjeta": 0,
                        "Efectivo": 0,
                        "Recaudación": 0,
                        "Recaudación Tarjeta": 0,
                        "Recaudación Efectivo": 0,
                    };

                    tickets.forEach(ticket => {
                        const { price, payment_method } = ticket;
                        // Update total count
                        summary["Cantidad"] += 1;
                        /* 
                        const income_duration_key = `Recaudación ${duration}`;

                        // Update count for duration
                        if (!summary[duration]) {
                            summary[duration] = 0;
                            summary[income_duration_key] = 0;
                        }

                        summary[duration] += 1;
                        summary[income_duration_key] =  roundDecimals(summary[income_duration_key] + parseFloat(price));
                        */
                        // Update payment method counts and revenues
                        if (payment_method === 'CASH') {
                            summary["Efectivo"] += 1;
                            summary["Recaudación Efectivo"] = roundDecimals(summary["Recaudación Efectivo"] + parseFloat(price));
                        } else if (payment_method === 'CARD') {
                            summary["Tarjeta"] += 1;
                            summary["Recaudación Tarjeta"] = roundDecimals(summary["Recaudación Tarjeta"] += parseFloat(price));
                        }

                        // Update total revenue
                        summary["Recaudación"] = roundDecimals(summary["Recaudación"] + parseFloat(price));
                    });

                    resolve(summary);
                },
                (_, error) => reject(error.message)
            );
        }, (transactionError) => reject(transactionError.message));
    });
}



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
            () => { }
        );
    });
}



// Get all tickets saved in the database
// @returns a promise with the tickets array
export function getTicketsSavedByPage(page) {
    let page_size = 10
    // Return the tickets of the page given
    return new Promise((resolve, reject) => {
        let db = getDatabase();

        db.transaction(
            (tx) => {
                tx.executeSql(
                    "SELECT * FROM tickets LIMIT ? OFFSET ?;",
                    [page_size, page_size * page],
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
            () => { }
        );
    });
}


// Get all tickets saved in the database
// @returns a promise with the tickets array
// @param duration: if given, only tickets with the given duration will be returned
export function getTicketsByDuration(duration = null) {

    if (duration != null && duration != undefined && duration <= 0)
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
            () => { } // Opcional: función de éxito para la transacción
        );
    });
}



// Delete all tickets older than 1 day
// @returns a promise with the deleted tickets
export function deleteOldTickets() {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM tickets WHERE created_at < datetime('now', '-1 day')",
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
// Required keys (rid, responsible_id, zone_name, duration, registration, price, payment_method, created_at
export function saveTicket(ticket_info) {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        let created_at = ticket_info["created_at"]?.replace(/\//g, '-') || new Date(Date.now()).toISOString()

        db.transaction(
            (tx) => {
                tx.executeSql(
                    "INSERT INTO tickets (id, responsible_id, zone_name, duration, registration, price, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        ticket_info["id"],
                        ticket_info["responsible_id"],
                        ticket_info["zone"],
                        ticket_info["duration"],
                        ticket_info["registration"],
                        ticket_info["price"],
                        ticket_info["payment_method"],
                        created_at,
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