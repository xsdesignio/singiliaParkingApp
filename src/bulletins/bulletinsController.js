import { Alert } from "react-native"
import { getSession } from "../session/sessionStorage"
import { saveBulletin } from "./storage/bulletinsStorage";

import { check_information, getBulletinPrice } from "./utils";
import { createBulletinOnServer } from "./api_conn/apiConn";
import { getConfigValue } from "../configStorage";
/* 
import { printBulletin } from "./printing/bulletinsPrinting";

 */

export function print(bulletinInfo) {
    createBulletinOnServer(bulletinInfo).then((bulletin) => {
        
        bulletinInfo["responsible_id"] = bulletin["id"]
        createBulletin(bulletinInfo)
        .then(() => {
            Alert.alert("Boletín impreso", "El boletín ha sido impreso con éxito")
        })
        .catch((error) => {
            Alert.alert("No se ha podido imprimir el boletín.", error.message)
        })
    }).catch((error) => {
        console.log(error)
        Alert.alert("Error de conexión con el servidor", "No se ha podido conectar con el servidor")
    })
}



//@param bulletin_info, dictionary with required information to create the bulletin
// (responsible, duration, registration, price, paid, precept, brand, model, color, signature, reference_id, location)
export function createBulletin(bulletin_info) {
    return new Promise((resolve, reject) => {

        getSession().then((session) => {
            getConfigValue("zone").then((zone) => {

                bulletin_info["responsible_id"] = session["id"]

                bulletin_info["reference_id"] = bulletin_info["reference_id"] || -1

                bulletin_info["price"] = getBulletinPrice(bulletin_info["duration"])

                bulletin_info["zone"] = zone

                // Check if bulletin_info has all required information
                check_information(bulletin_info)

                // Try to save the ticket on database
                saveBulletin(bulletin_info).then((result) => {
                    console.log(result)
                    resolve(result)
                }).catch((error) => {
                    reject(error.message)
                })

            }).catch((error) => {
                reject(error.message)
            })
        }).catch((error) => {
            reject(error.message)
        })
    })
}
