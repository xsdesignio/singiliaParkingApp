import AsyncStorage  from "@react-native-async-storage/async-storage"


// @returns the schedule(For the week) or null if it doesn't exists or any error happened
export async function getScheduleDict() {
    try {
        let schedule = await AsyncStorage.getItem("@schedule")
        if(schedule!=null)
            return JSON.parse(schedule)

        return null
    }
    catch {
        return null
    }
}

// @param scheduleDict: dictionaty with the week days schedule to be saved
// @returns true if the schedule is saved successfully, and false otherwise.
export async function saveScheduleDict(scheduleDict) {
    try {
        const schedule = JSON.stringify(scheduleDict)
        await AsyncStorage.setItem("@schedule", schedule)
        return true
    } catch {
        return false
    }
}