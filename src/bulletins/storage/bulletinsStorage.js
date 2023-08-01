import { getDatabase } from "../../database";
import { AsyncStorage } from "react-native";



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
export function getBulletinsByDuration(duration = null) {

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
export function payBulletinLocally(id, payment_method) {
  return new Promise((resolve, reject) => {
      let db = getDatabase();

      db.transaction((tx) => {
          // Check if the bulletin exists and is not paid
          tx.executeSql(
              "SELECT * FROM bulletins WHERE id = ?",
              [id],
              (_, result) => {
                  if (result.rows.length === 0) {
                      resolve(null);
                  } else if (result.rows.item(0)["paid"] === 1) {
                      reject("Bulletin already paid");
                  } else {
                      // Bulletin exists and is not paid, proceed with the update
                      tx.executeSql(
                          "UPDATE bulletins SET paid = 1, payment_method = ? WHERE id = ?",
                          [payment_method, id],
                          (_, updateResult) => {
                              resolve(updateResult);
                          },
                          () => {
                              resolve(null);
                          }
                      );
                  }
              },
              () => {
                  console.log(null)
                  resolve(null);
              }
          );
      }, () => {
          resolve(null);
      });
  });
}


export function deleteOldBulletins() {
  return new Promise((resolve, reject) => {
    let db = getDatabase()

    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM bulletins WHERE paid = 1 AND created_at < datetime('now', '-1 day')",
            [],
            (_, result) => resolve(result.rows._array),
            (_, error) => reject(error.message)
        )
    })
})
}



export function addReferenceToBulletin(id, reference_id) {
    return new Promise((resolve, reject) => {
        let db = getDatabase()
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE bulletins SET reference_id = ? WHERE id = ?",
                [reference_id, id],
                (_, result) => resolve(result.rows._array),
                (_, error) => reject(error.message)
            )
        },
        (error) => {
            reject(error.message)
        }, null)
    })
}

// get all bulletins with reference_id = -1
// @returns a promise with the bulletins array
export function getBulletinsWithoutReference() {
  return new Promise((resolve, reject) => {
    let db = getDatabase();

    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM bulletins WHERE reference_id = -1;",
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
      



// Save a bulletin into database
// @param bulletin_info : dictionary with all bulletin information
// (responsible, duration, registration, price, paid, precept, brand, model, color, signature, reference_id, location)
export function saveBulletin(bulletin_info) {
    return new Promise((resolve, reject) => {
        let db = getDatabase()

        db.transaction(
            (tx) => {
            tx.executeSql(
                "INSERT INTO bulletins (responsible_id, zone_name, duration, registration, price, payment_method, paid, precept, brand, model, color, reference_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    bulletin_info["responsible_id"], 
                    bulletin_info["zone_name"], 
                    bulletin_info["duration"], 
                    bulletin_info["registration"], 
                    bulletin_info["price"], 
                    bulletin_info["payment_method"], 
                    bulletin_info["paid"], 
                    bulletin_info["precept"],
                    bulletin_info["brand"] || "", 
                    bulletin_info["model"] || "", 
                    bulletin_info["color"] || "",
                    bulletin_info["reference_id"] || -1 
                ], 
                (_, result) => {
                  resolve(result)
                },
                (_, error) => reject(error.message));
            },
            (error) => {
              reject(error.message)
            }, 
            null
        );
    })
}



// ASYNC STORAGE FUNCTIONS
// Save the list of bulletins pending to be paid on Server
// @param id: id of the bulletin to be paid
// @returns a promise with true if the bulletin was saved successfully or false if not
export async function addPendingBulletinToPayOnServer(id) {
  try {
    let pending_bulletins = await AsyncStorage.getItem("pending_bulletins");
    pending_bulletins = JSON.parse(pending_bulletins ?? '[]');
    pending_bulletins.push(id);
    await AsyncStorage.setItem("pending_bulletins", JSON.stringify(pending_bulletins));
    return true;
  } catch (error) {
    return false;
  }
}


// Get the list of bulletins pending to be paid on Server
// @returns a promise with the list of bulletins pending to be paid
export async function getNotSynchronizedBulletins() {
    try {
        let pending_bulletins = await AsyncStorage.getItem("pending_bulletins")
        return pending_bulletins
    } catch (error) {
        return []
    }
}