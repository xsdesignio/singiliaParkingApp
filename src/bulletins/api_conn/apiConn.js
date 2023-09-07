

const apiHost = "http://192.168.232.96:5000"


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
        .catch(() => resolve(null))
    })
}



export function payBulletinOnServer(bulletin_id, payment_method) {
    return new Promise((resolve) => {
        fetch(`${apiHost}/bulletins/pay/${bulletin_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: `payment_method=${encodeURIComponent(payment_method)}`, 
        })
        .then(response => {
            // Throw an error when server returns an error
            if (response.status === 400) {
                throw new Error("El boletín introducido no existe.");
            }
            if (response.status !== 200) {
                throw new Error("Ha ocurrido un error al pagar el boletín.");
            }
            // If request was made successfully
            return response.json();
        })
        .then(response_json => {
            let message = response_json["message"];
            resolve(message);
        })
        .catch(() => resolve(null));
    });
}
