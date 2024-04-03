import TemplateCreator from "./TemplateCreator";



export function ticketTemplate(ticket_data) {

    let template = new TemplateCreator();

    let created_at = ticket_data["Hora"];
    delete ticket_data["Hora"];

    let duration = ticket_data["Duración"]
    delete ticket_data["Duración"];

    template.initialize()
        .alignCenter()
        .Logo()
        .margin()
        .Title("SERVICIO MUNICIPAL\nESTACIONAMIENTO\nREGULADO")
        .margin()
        .Title(created_at)
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
    let created_at = bulletin_data["Hora"];
    delete bulletin_data["Hora"];

    template.initialize()
        .alignCenter()
        .Logo()
        .margin()
        .Title("BOLETÍN\nESTACIONAMIENTO\nREGULADO")
        .margin()
        .Title(id)
        .Title(created_at)
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
    let created_at = bulletin_data["Hora"];
    delete bulletin_data["Hora"];

    template.initialize()
        .alignCenter()
        .Logo()
        .margin()
        .Title("ANULACIÓN DE\nBOLETÍN")
        .margin()
        .Title(id)
        .Title(created_at)
        .margin()
        .Dict(bulletin_data)
        .SingiliaInfo()
        .margin(4)
        
    return template.obtainTemplateArray()
}

