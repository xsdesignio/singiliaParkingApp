import * as SQLite from "expo-sqlite"

db_name = "tickets.db"

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
                responsible TEXT NOT NULL,
                duration INTEGER NOT NULL,
                registration TEXT NOT NULL,
                price REAL NOT NULL,
                paid INTEGER NOT NULL DEFAULT 0,
                location TEXT NOT NULL,
                sent_to_server INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );`
        );

        // Create the 'bulletins' table
        transaction.executeSql(`
            CREATE TABLE IF NOT EXISTS bulletins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                responsible TEXT NOT NULL,
                location TEXT NOT NULL,
                duration INTEGER NOT NULL,
                price REAL NOT NULL,
                paid INTEGER NOT NULL DEFAULT 0,
                precept TEXT NOT NULL,
                registration TEXT NOT NULL,
                brand TEXT,
                model TEXT,
                signature TEXT NOT NULL,
                sent_to_server INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
            );`
        )
    }, null, null)
}

/* 
db.transaction((tx) => {
    tx.executeSql(
      `select * from items where price = ?;`,
      [doneHeading ? 1 : 0],
      (_, { rows: { _array } }) => setItems(_array)
    );
  });



db.transaction(
    (tx) => {
      tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
      tx.executeSql("select * from items", [], (_, { rows }) =>
        console.log(JSON.stringify(rows))
      );
    },
    null,
    forceUpdate
);

 */