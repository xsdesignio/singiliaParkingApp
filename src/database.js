import * as SQLite from "expo-sqlite"
import { DBNAME } from "@env"

let db_name = DBNAME  || process.env.DBNAME

export function getDatabase() {
    const db = SQLite.openDatabase(db_name);
    return db;
}

export function createSQLiteTables() {
    // Open or create the SQLite database
    const db = getDatabase()
    
    
    // Execute SQL statements to create the tables
    db.transaction(transaction => {
        // Create the 'tickets' table
        transaction.executeSql(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                responsible_id INTEGER NOT NULL,
                zone_name TEXT NOT NULL,
                duration INTEGER NOT NULL,
                registration TEXT NOT NULL,
                price REAL NOT NULL,
                payment_method TEXT NOT NULL,
                paid INTEGER NOT NULL DEFAULT 0,
                reference_id INTEGER NOT NULL DEFAULT -1,
                created_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );`
        );

        // Create the 'bulletins' table
        transaction.executeSql(`
            CREATE TABLE IF NOT EXISTS bulletins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                responsible_id INTEGER NOT NULL,
                zone_name TEXT NOT NULL,
                duration INTEGER NOT NULL,
                registration TEXT NOT NULL,
                price REAL NOT NULL,
                payment_method TEXT,
                paid INTEGER NOT NULL DEFAULT 0,
                reference_id INTEGER NOT NULL DEFAULT -1,
                precept TEXT NOT NULL DEFAULT 'Estacionar sin ticket de aparcamiento',
                brand TEXT,
                model TEXT,
                color TEXT,
                created_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );`
        )
    }, (error) => {
        console.log("Error at creating tables: ", error)
    }, () => {
        console.log("Tables created successfully")
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
        console.log("Tables deleted")
    })
}
