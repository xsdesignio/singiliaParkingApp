import { API_URL } from "../../enviroment"

const apiHost = API_URL 

export function createBulletinOnServer(bulletin_info) {
    return new Promise((resolve) => {
        
        fetch( `${ apiHost }/bulletins/create` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bulletin_info)
        })
        .then( response => {
            if(response.status != 200)
                throw new Error("Los datos introducidos son incorrectos o no se encuentra conectado a internet.")
            
            // If request was made successfully
            return response.json()
        })
        .then(bulletin => resolve(bulletin))
        .catch((error) => {
            console.log("Error here on bulletin api conn:")
            
            console.log(error)
            resolve(null)
        })
    })
}


export function payBulletinOnServer(bulletin_id, payment_method, price, duration) {
    let formData = new FormData()
    formData.append('payment_method', payment_method)
    formData.append('price', price)
    formData.append('duration', duration)

    return new Promise((resolve) => {
        fetch(`${apiHost}/bulletins/pay/${bulletin_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
            body: formData, 
        })
        .then(response => {
            // Throw an error when server returns an error
            console.log(response.status)
            if (response.status === 400) {
                throw new Error("Ha ocurrido un error al pagar el boletín.");
            }
            if (response.status !== 200) {
                throw new Error("Ha ocurrido un error al pagar el boletín.");
            }
            // If request was made successfully
            return response.json();
        })
        .then(response_json => {
            console.log("Response json:")
            resolve(response_json);
        })
        .catch((error) => {
            console.log(error)
            resolve(null)
        });
    });
}



export function fetchBulletinById(id) {
    return new Promise((resolve) => {

        fetch( `${ apiHost }/bulletins/get-bulletin/${id}` , {
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
        .then(bulletin => {
            resolve(Object.keys(bulletin).length === 0 ? null : bulletin)
        })
        .catch((error) => {
            console.log("Error here on bulletins api conn:")
            console.log(error)
            resolve(null)
        })
    })
}

export function fetchBulletinsByRegistration(registration) {
    return new Promise((resolve) => {

        fetch( `${ apiHost }/bulletins/get-bulletins-by-registration/${registration}` , {
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
        .then(bulletin => {
            resolve(Object.keys(bulletin).length === 0 ? null : bulletin)
        })
        .catch((error) => {
            console.log("Error here on bulletins api conn:")
            console.log(error)
            resolve(null)
        })
    })
}


export function fetchAvailableBulletins() {
    return new Promise((resolve) => {

        fetch( `${ apiHost }/bulletins/available` , {
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
        .then(bulletins => {
            resolve(bulletins)
        })
        .catch((error) => {
            console.log("Error here on bulletins api conn:")
            console.log(error)
            resolve(null)
        })
    })
}