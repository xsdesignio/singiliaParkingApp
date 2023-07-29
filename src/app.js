import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveConfigDict } from "./configStorage";
import { createSQLiteTables } from "./database";

import { addReferenceToBulletin, getBulletinsWithoutReference, getNotSyncronizedBulletins, deleteOldBulletins } from "./bulletins/storage/bulletinsStorage";
import { createBulletinOnServer, payBulletinOnServer } from "./bulletins/api_conn/apiConn";
import { createTicketOnServer } from "./tickets/api_conn/apiConn";
import { addReferenceToTicket, deleteOldTickets, getTicketsWithoutReference } from "./tickets/storage/ticketsStorage";


// Function to start all background processes required to run the app
export async function initApp() {
    
    let app_already_started = await firstTimeAppStarts()

    if(!app_already_started) {
        // If it is the first time the app is loaded SQLite tables are created
        // and the default config object is saved
        createSQLiteTables()
        try {
            // Saving default config object
            await saveConfigDict({
                "bulletins_amount": 1,
                "zone": "Plaza de Toros"
            })
            // Setting app_already_started as true for the next time
            await AsyncStorage.setItem("@started", "true")
        } catch(error) {
            console.log(error)
        }
    } 
    await syncronizeAppWithServer()
    await deleteOldTickets()
    await deleteOldBulletins()
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


// Syncronize the app with the server
// @returns true if the syncronization was successful and false otherwise
export async function syncronizeAppWithServer() {
    //get pending bulletins
    let not_syncronized_bulletins = await getNotSyncronizedBulletins()

    not_syncronized_bulletins.forEach(async (bulletin) => {
        // Send each bulletin to the server
        if(bulletin["reference_id"] == -1) {
            let created_bulletin = await createBulletinOnServer(bulletin)
            if(created_bulletin) 
                await addReferenceToBulletin(bulletin["id"], created_bulletin["id"])
        }
        else
            await payBulletinOnServer(bulletin)
    });

    let bulletins_without_reference = await getBulletinsWithoutReference()
    bulletins_without_reference.forEach(async (bulletin) => {
        let created_bulletin = await createBulletinOnServer(bulletin)
        if(created_bulletin)
            await addReferenceToBulletin(bulletin["id"], created_bulletin["id"])
    });

    let tickets_without_reference = await getTicketsWithoutReference()
    tickets_without_reference.forEach(async (ticket) => {
        let created_ticket = await createTicketOnServer(ticket)
        if(created_ticket)
            await addReferenceToTicket(ticket["id"], created_ticket["id"])
    });


}