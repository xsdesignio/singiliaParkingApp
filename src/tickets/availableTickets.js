import { fetchAvailableTickets } from "./api_conn/apiConn";
import { getAvailableTicketsDict, saveAvailableTicketsDict } from "./storage/availableTicketsStorage";


export async function obtainAvailableTickets() {

    let availableTickets = await getAvailableTicketsDict()

    if(availableTickets==null) {
        availableTickets = await fetchAvailableTickets()
        
        if(availableTickets == null) 
            return null

        await saveAvailableTicketsDict(availableTickets)
        return availableTickets
    }

    return availableTickets
}