import { API_URL } from "../../enviroment"   

const apiHost = API_URL 


export default async function fetchSchedule () {
    
    return new Promise((resolve) => {

        fetch( `${ apiHost }/schedule/obtain` , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then( response => {
            
            if(response.status != 200)
                throw new Error("Los datos introducidos son incorrectos o no se encuentra conectado a internet.")
            
            return response.json()
        })
        .then(schedule => {
            resolve(schedule)
        })
        .catch((error) => {
            console.log("Error here on schedule api conn:")
            console.log(error)
            resolve(null)
        })
    })
}
