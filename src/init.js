import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveConfigDict } from "./configStorage";
import { createSQLTables } from "./database";

import { deleteOldBulletins } from "./bulletins/storage/bulletinsStorage";
import { deleteOldTickets } from "./tickets/storage/ticketsStorage";
/* 
import { synchronizeTickets } from "./tickets/api_conn/syncTickets";
import { synchronizeBulletins } from "./bulletins/api_conn/syncBulletins";
 */
import { obtainAssignedZone, obtainAvailableZones } from "./zone_manager";

// Function to start all background processes required to run the app
export async function initApp() {
    
    let app_already_started = await firstTimeAppStarts()


    createSQLTables()
    if(!app_already_started) {
        // If it is the first time the app is loaded SQLite tables are created
        // and the default config object is saved
        try {
            // Save default config object and set app_already_started as true for the next time
            await saveConfigDict({})
            await AsyncStorage.setItem("@started", "true")
        } catch(error) {
            console.log(error)
        }
    } 
    
    await obtainAssignedZone()
    await obtainAvailableZones()
    await deleteOldTickets()
    await deleteOldBulletins()
    // await synchronizeAppWithServer() -- Syncronization turned off for now
}


// @returns true if is the first time the app is opened and false otherwise
async function firstTimeAppStarts() {
    try {
        let alreadyStarted = await AsyncStorage.getItem("@started")
        
        if(alreadyStarted == "true")
            return true
        else
            return false
    }
    catch {
        return false
    }
}



// REFACTORIZE TO ADD INDIVIDUAL SYNC FUNCTIONS FOR TICKETS AND BULLETINS INSIDE THEIR RESPECTIVE FOLDERS (/api_conn/syncData.js)

// Syncronize the app with the server
// @returns true if the syncronization was successful and false otherwise
/* export async function synchronizeAppWithServer() {
    //get pending bulletins
    await synchronizeBulletins()
    
    await synchronizeTickets()

} */