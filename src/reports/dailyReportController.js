import { Alert } from "react-native";
import { getDailyBulletinsSummary } from "../bulletins/storage/bulletinsStorage";
import { getDailyTicketsSummary } from "../tickets/storage/ticketsStorage";
import { obtainDateTime } from "../date_utils";


export async function printDailyReport(printer, sessionName) {
    try {
        const { connectedDevice, printDailyReport } = printer
            
        if(connectedDevice == null) 
            throw new Error("No se ha encontrado ninguna impresora conectada.")
        
        const report_info = await getReportInfo(sessionName)
    

        // Print the Report
        await printDailyReport(report_info)
    
        // Alert.alert(`Reporte Diario`, JSON.stringify(report_info))
    
        Alert.alert(`Reporte Creado`, "El reporte ha sido creado e impreso con éxito")
        
    }
    catch(error) {
        Alert.alert("Error al imprimir el reporte diario.", error.message)
        return false
    }
}


function roundDecimals(num) {
    return Math.round(num * 100) / 100;
}

export async function getReportInfo(sessionName) {
    let info = {
        date: obtainDateTime().split(" ")[0],
        user_name: sessionName,
        bulletins: {},
        tickets: {},
        total: {}
    }
    let bulletins = await getDailyBulletinsSummary()
    info["bulletins"] = bulletins;

    let tickets = await getDailyTicketsSummary()
    info["tickets"] = tickets

    info["total"] = {
        "Cantidad": bulletins["Cantidad"] + tickets["Cantidad"],
        "Tarjeta": bulletins["Tarjeta"] + tickets["Tarjeta"],
        "Efectivo": bulletins["Efectivo"] + tickets["Efectivo"],
        "Recaudación": roundDecimals(bulletins["Efectivo"] + tickets["Efectivo"]) + " eur",
        "Recaudación Tarjeta": roundDecimals(bulletins["Recaudación Tarjeta"] + tickets["Recaudación Tarjeta"]) + " eur",
        "Recaudación Efectivo": roundDecimals(bulletins["Recaudación Efectivo"] + tickets["Recaudación Efectivo"]) + " eur",
    }

    const list = ["tickets", "bulletins"]

    list.forEach(element => {
        info[element]["Recaudación"] = info[element]["Recaudación"] + " eur"
        info[element]["Recaudación Efectivo"] = info[element]["Recaudación Efectivo"] + " eur"
        info[element]["Recaudación Tarjeta"] = info[element]["Recaudación Tarjeta"] + " eur"

    });
    /* 
    "Cantidad": 0,
    "Tarjeta": 0,
    "Efectivo": 0,
    "Recaudación": 0,
    "Recaudación Tarjeta": 0,
    "Recaudación Efectivo": 0,
    */

    return info;
}