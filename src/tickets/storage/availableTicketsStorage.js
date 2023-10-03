import AsyncStorage  from "@react-native-async-storage/async-storage"


// @returns the availableTickets dict or null if it doesn't exists or any error happened
export async function getAvailableTicketsDict() {
    try {
        let availableTicketsJSON = await AsyncStorage.getItem("@availableTickets")
        console.log("available_tickets: ",JSON.parse(availableTicketsJSON))
        if(availableTicketsJSON!=null)
            return JSON.parse(availableTicketsJSON)

        return null
    }
    catch {
        return null
    }
}

// @param availableTicketsDict: dictionaty with the availableTickets data to be saved
// @returns true if the availableTickets is saved successfully, and false otherwise.
export async function saveAvailableTicketsDict(availableTicketsDict) {
    try {
        const availableTickets = JSON.stringify(availableTicketsDict)
        await AsyncStorage.setItem("@availableTickets", availableTickets)
        return true
    } catch {
        return false
    }
}