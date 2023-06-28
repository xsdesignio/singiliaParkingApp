import { saveConfigDict } from "../storage/configStorage";
import { createSQLiteTables } from "../storage/database";

import AsyncStorage from "@react-native-async-storage/async-storage";


// Function to start all background processes required to run the app
export async function initApp() {
    /* let app_already_started = await firstTimeAppStarts()

    if(!app_already_started) {
        // If it is the first time the app is loaded SQLite tables are created
        createSQLiteTables()
        try {
            await AsyncStorage.setItem("@started", "true")
        } catch(error) {
            
        }
    } */
    createSQLiteTables()

    // Saving default config object
    saveConfigDict({
        "bulletins_amount": 1,
        "printer_identifier": "qeqjiwi"
    })
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