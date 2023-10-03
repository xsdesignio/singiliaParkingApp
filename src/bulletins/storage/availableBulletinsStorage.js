import AsyncStorage  from "@react-native-async-storage/async-storage"


// @returns the availableTickets dict or null if it doesn't exists or any error happened
export async function getAvailableBulletinsDict() {
    try {
        let availableBulletinsJSON = await AsyncStorage.getItem("@availableBulletins")
        
        if(availableBulletinsJSON!=null)
            return JSON.parse(availableBulletinsJSON)

        return null
    }
    catch {
        return null
    }
}

// @param availableBulletinsDict: dictionaty with the availableTickets data to be saved
// @returns true if the availableTickets is saved successfully, and false otherwise.
export async function saveAvailableBulletinsDict(availableBulletinsDict) {
    try {
        const availableBulletins = JSON.stringify(availableBulletinsDict)
        await AsyncStorage.setItem("@availableBulletins", availableBulletins)
        return true
    } catch {
        return false
    }
}