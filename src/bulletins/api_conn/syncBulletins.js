import { getNotSynchronizedBulletins, getBulletinsWithoutReference, addReferenceToBulletin } from "../storage/bulletinsStorage"
import { createBulletinOnServer, payBulletinOnServer } from "./apiConn"



export async function synchronizeBulletins() {
    //get pending bulletins
    let not_synchronized_bulletins = await getNotSynchronizedBulletins()

    not_synchronized_bulletins.forEach(async (bulletin) => {
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
}