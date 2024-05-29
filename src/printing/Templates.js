import TemplateCreator from "./TemplateCreator";




export function dailyReportTemplate(report_info) {

    let template = new TemplateCreator();


    let day = report_info["date"];


    let title = "REPORTE USUARIO\n "+report_info["user_name"]
    delete report_info["user_name"];


    template.initialize()
        .alignCenter()
        .Logo()
        .margin()
        .Title(title)
        .margin()
        .Title(day)
        .margin()
        .Title("Tickets")
        .Dict(report_info["tickets"])
        .margin()
        .Title("Boletines")
        .Dict(report_info["bulletins"])
        .margin()
        .Title("Total")
        .Dict(report_info["total"])
        .margin(5)

    return template.obtainTemplateArray()

}


export function ticketTemplate(ticket_data) {

    let template = new TemplateCreator();

    let date = ticket_data["Fecha"];
    delete ticket_data["Fecha"];
    let time = ticket_data["Hora"];
    delete ticket_data["Hora"];

    let duration = ticket_data["Duración"]
    delete ticket_data["Duración"];

    template.initialize()
        .alignCenter()
        .Logo()
        .margin()
        .Title("SERVICIO MUNICIPAL\nESTACIONAMIENTO\nREGULADO")
        .margin()
        .Title(date)
        .Title(`Hasta: ${time}`)
        .Title(duration)
        .margin()
        .Dict(ticket_data)
        .SingiliaInfo()
        .LegalInfo()
        .margin(5)

    return template.obtainTemplateArray()

}

export function bulletinTemplate(bulletin_data, available_bulletins) {

    let template = new TemplateCreator();

    let id = bulletin_data["Id"];
    delete bulletin_data["Id"];

    let date = bulletin_data["Fecha"];
    delete bulletin_data["Fecha"];

    let time = bulletin_data["Hora"];
    delete bulletin_data["Hora"];

    template.initialize()
        .alignCenter()
        .Logo()
        .margin()
        .Title("BOLETÍN\nESTACIONAMIENTO\nREGULADO")
        .margin()
        .Title(id)
        .Title(date)
        .Title(time)
        .margin()
        .Dict(bulletin_data)
        .PricesTable(available_bulletins)
        .SingiliaInfo()
        .BulletinLegalInfo()
        .margin(5)
        
    return template.obtainTemplateArray()
}



export function bulletinCancellationTemplate(bulletin_data) {
    let template = new TemplateCreator();

    let id = bulletin_data["Id"];
    delete bulletin_data["Id"];

    let date = bulletin_data["Fecha"];
    delete bulletin_data["Fecha"];

    let time = bulletin_data["Hora"];
    delete bulletin_data["Hora"];

    template.initialize()
        .alignCenter()
        .Logo()
        .margin()
        .Title("ANULACIÓN DE\nBOLETÍN")
        .margin()
        .Title(id)
        .Title(date)
        .Title(time)
        .margin()
        .Dict(bulletin_data)
        .SingiliaInfo()
        .margin(4)
        
    return template.obtainTemplateArray()
}

