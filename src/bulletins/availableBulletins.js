import { getAvailableBulletinsDict, saveAvailableBulletinsDict } from "./storage/availableBulletinsStorage";
import { fetchAvailableBulletins } from "./api_conn/apiConn";


export async function obtainAvailableBulletins() {
    let availableTickets = await getAvailableBulletinsDict()

    if(availableTickets==null) {
        availableTickets = await fetchAvailableBulletins()
        
        if(availableTickets == null) 
            return null

        await saveAvailableBulletinsDict(availableTickets)
        return availableTickets
    }

    return availableTickets
}
