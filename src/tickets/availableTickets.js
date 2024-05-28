import { fetchAvailableTickets } from "./api_conn/apiConn";
import { getAvailableTicketsDict, saveAvailableTicketsDict } from "./storage/availableTicketsStorage";


export async function obtainAvailableTickets() {

    let availableTickets = await fetchAvailableTickets()

    if(availableTickets==null) {
        availableTickets = await getAvailableTicketsDict()
        
        if(availableTickets == null) 
            return null

        return availableTickets
    } else {
        await saveAvailableTicketsDict(availableTickets)
    }

    return availableTickets.reverse()
}