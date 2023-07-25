import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveConfigDict } from "./configStorage";
import { createSQLiteTables, deleteAllTables } from "./database";


// Function to start all background processes required to run the app
export async function initApp() {
    deleteAllTables()
    let app_already_started = await firstTimeAppStarts()

    app_already_started = false

    if(!app_already_started) {
        
        // If it is the first time the app is loaded SQLite tables are created
        createSQLiteTables()
        try {
            await AsyncStorage.setItem("@started", "true")
            // Saving default config object
            await saveConfigDict({
                "bulletins_amount": 1,
                "printer_identifier": "qeqjiwi",
                "zone": "Plaza de Toros"
            })
        } catch(error) {
            console.log(error)
        }
    } 
    
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