import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveConfigDict } from "./configStorage";
import { createSQLiteTables } from "./database";


// Function to start all background processes required to run the app
export async function initApp() {
    createSQLiteTables()
    
    let app_already_started = await firstTimeAppStarts()

    if(!app_already_started) {
        console.log("This do start")

        // If it is the first time the app is loaded SQLite tables are created
        // and the default config object is saved
        createSQLiteTables()
        try {
            // Saving default config object
            await saveConfigDict({
                "bulletins_amount": 1,
                "zone": "Plaza de Toros"
            })
            await AsyncStorage.setItem("@started", "true")
        } catch(error) {
            console.log(error)
        }
    } 

}


// @returns true if is the first time the app is opened and false otherwise
async function firstTimeAppStarts() {
    try {
        let alreadyStarted = await AsyncStorage.getItem("@started")
        console.log("The app already started?", alreadyStarted)
        if(alreadyStarted == "true")
            return true
        else
            return false
    }
    catch {
        return false
    }
}