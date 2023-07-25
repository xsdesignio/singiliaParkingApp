import AsyncStorage  from "@react-native-async-storage/async-storage"



export async function storeSession(session) {
    try {
      const jsonValue = JSON.stringify(session)
      await AsyncStorage.setItem('@session', jsonValue)
      return true
    } catch (e) {
      throw Error("No se ha podido guardar la sesión")
    }
  }



export async function getSession() {
    try {
        let session = await AsyncStorage.getItem("@session")
        if(session != null)
          return JSON.parse(session)
        return session
    } catch(e) {
        return null
    }
}


export async function deleteSession() {
  try {
      await AsyncStorage.removeItem("@session")
      return true
  } catch(e) {
      return false
  }
}

