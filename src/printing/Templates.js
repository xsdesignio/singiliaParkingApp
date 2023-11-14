import TemplateCreator from "./TemplateCreator";



export async function ticketTemplate(ticket_data) {

    const template = new TemplateCreator();

    let created_at = ticket_data["Hora"];
    delete ticket_data["Hora"];

    let duration = ticket_data["Duración"]
    delete ticket_data["Duración"];
    
    template.initialize()
        .alignCenter()
        .SingiliaLogo()
        .Title("SERVICIO MUNICIPAL\nESTACIONAMIENTO\nREGULADO")
        .margin()
        .Title(created_at)
        .Title(duration)
        .margin()
        .Dict(ticket_data)
        .SingiliaInfo()
        .LegalInfo()
        .AntequeraLogo()
        .margin(4)

    return template.obtainTemplateArray()

}

export async function bulletinTemplate(bulletin_data, available_bulletins) {

    const template = new TemplateCreator();

    let id = bulletin_data["Id"];
    delete bulletin_data["Id"];
    let created_at = bulletin_data["Hora"];
    delete bulletin_data["Hora"];

    template.initialize()
        .alignCenter()
        .SingiliaLogo()
        .Title("BOLETÍN\nESTACIONAMIENTO\nREGULADO")
        .margin()
        .Title(id)
        .Title(created_at)
        .margin()
        .Dict(bulletin_data)
        .PricesTable(available_bulletins)
        .SingiliaInfo()
        .BulletinLegalInfo()
        .AntequeraLogo()
        .margin(4)
        
    return template.obtainTemplateArray()
}



export async function bulletinCancellationTemplate(bulletin_data) {
    const template = new TemplateCreator();

    let id = bulletin_data["Id"];
    delete bulletin_data["Id"];
    let created_at = bulletin_data["Hora"];
    delete bulletin_data["Hora"];

    template.initialize()
        .alignCenter()
        .SingiliaLogo()
        .Title("ANULACIÓN DE\nBOLETÍN")
        .margin()
        .Title(id)
        .Title(created_at)
        .margin()
        .Dict(bulletin_data)
        .SingiliaInfo()
        .BulletinLegalInfo()
        .AntequeraLogo()
        .margin(4)
        
    return template.obtainTemplateArray()
}

