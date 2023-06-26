import AsyncStorage  from "@react-native-async-storage/async-storage"



// @returns the config dict or null if it doesn't exists or any error happened
export async function getConfigDict() {
    try {
        let configJSON = await AsyncStorage.getItem("@config")
        
        if(configJSON!=null)
            return JSON.parse(configJSON)

        return null
    }
    catch {
        return null
    }
}


// @param configDict: dictionaty with the configuration data to be saved
// @returns true if the config is saved successfully, and false otherwise.
export async function saveConfigDict(configDict) {
    try {
        const config = JSON.stringify(configDict)
        await AsyncStorage.setItem("@config", config)
        return true
    } catch {
        return false
    }
}