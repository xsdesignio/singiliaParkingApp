import * as SQLite from "expo-sqlite"
import { DBNAME } from "./enviroment"

let db_name = DBNAME  

export function getDatabase() {
    const db = SQLite.openDatabase(db_name);
    return db;
}

export function createSQLTables() {
    // Open or create the SQLite database
    const db = getDatabase()
    
    
    // Execute SQL statements to create the tables
    db.transaction(transaction => {
        // Create the 'tickets' table
        transaction.executeSql(`
            CREATE TABLE IF NOT EXISTS tickets (
                id TEXT NOT NULL,
                responsible_id INTEGER NOT NULL,
                zone_name TEXT NOT NULL,
                duration TEXT NOT NULL,
                registration TEXT NOT NULL,
                price REAL NOT NULL,
                payment_method TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );`
        );

        // reference_id INTEGER NOT NULL DEFAULT -1,

        // Create the 'bulletins' table
        transaction.executeSql(`
            CREATE TABLE IF NOT EXISTS bulletins (
                id TEXT NOT NULL,
                responsible_id INTEGER NOT NULL,
                zone_name TEXT NOT NULL,
                duration TEXT,
                registration TEXT NOT NULL,
                price REAL,
                payment_method TEXT,
                paid INTEGER DEFAULT 0,
                precept TEXT NOT NULL DEFAULT 'Estacionar sin ticket de aparcamiento',
                brand TEXT,
                model TEXT,
                color TEXT,
                paid_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );`
        )

        // reference_id INTEGER NOT NULL DEFAULT -1,

    }, (error) => {
        console.log("Error at creating tables: ", error)
    }, () => {
        // console.log("Tables created successfully")
    })
}



export function deleteAllTables() {
    const db = getDatabase()
    db.transaction(transaction => {
        transaction.executeSql(`DROP TABLE tickets;`)
        transaction.executeSql(`DROP TABLE bulletins;`)
    }, (error) => {
        console.log("Error at deleting tables: ", error)
    }, () => {
        // console.log("Tables deleted")
    })
}
