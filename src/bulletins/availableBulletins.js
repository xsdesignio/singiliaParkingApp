import { getAvailableBulletinsDict, saveAvailableBulletinsDict } from "./storage/availableBulletinsStorage";
import { fetchAvailableBulletins } from "./api_conn/apiConn";


export async function obtainAvailableBulletins() {
    let availableTickets = await fetchAvailableBulletins()

    if(availableTickets==null) {
        availableTickets = await getAvailableBulletinsDict()
        
        if(availableTickets == null) 
            return null

        return availableTickets
    } else {
        await saveAvailableBulletinsDict(availableTickets)
    }

    return availableTickets.reverse()
}
