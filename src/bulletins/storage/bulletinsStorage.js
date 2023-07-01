import { getDatabase } from "../../database";




// Get all bulletins saved in the database
// @returns a promise with the bulletins array
export function getBulletinsSaved() {
    return new Promise((resolve, reject) => {
      let db = getDatabase();
  
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT * FROM bulletins;",
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

// Get all bulletins saved in the database
// @returns a promise with the bulletins array
// @param duration: if given, only bulletins with the given duration will be returned
export function getBulletinsFilteredByDuration(duration = null) {

    if(duration != null && duration != undefined && duration <= 0)
        return getBulletinsSaved()

    return new Promise((resolve, reject) => {
      let db = getDatabase();
      let query = "SELECT * FROM bulletins WHERE duration = ?";

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
        (error) => reject(error.message), 
        () => {} 
      );
    });
  }
  


// Set the bulletin with the given id as paid
// @param id: id of the bulletin to be paid
// @returns a promise with the bulletin paid
// @throws an error if the bulletins doesn't exist or the bulletin is already paid
export function payBulletin(id) {
    // check if the bulletin exists and is not paid
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction((tx) => {

            // check if the bulletin exists and is not paid
            tx.executeSql(
                "SELECT * FROM bulletins WHERE id = ?",
                [id],
                (_, result) => {
                    if(result.rows._array.length == 0) {
                        reject("Bulletin doesn't exist")
                        return
                    }
                    if(result.rows._array[0]["paid"] == 1) {
                        reject("Bulletin already paid")
                        return
                    }
                    resolve(result.rows._array[0])
                },
                (_, error) => reject(error.message)
            )

            // set the bulletin as paid after checking that this exists and hasn't been paid
            tx.executeSql(
                "UPDATE bulletins SET paid = 1 WHERE id = ?",
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




export function deleteOldBulletins() {
    let db = getDatabase()
    db.transaction((tx) => {
        tx.executeSql(`
            DELETE FROM bulletins
            WHERE created_at < datetime('now', '-1 day')
                AND paid = 1;
        `)
    })
}



// Save a bulletin into database
// @param bulletin_info : dictionary with all bulletin information
// (responsible, duration, registration, price, paid, location)
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
                    bulletin_info["location"]
                ], 
                (result) => resolve(result),
                (error) => reject(null));
            },
            null,
            null
        );
    })
}