/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import { useState, useEffect } from "react";

import { getTicketsSaved } from "../tickets/storage/ticketsStorage"
import { getBulletinsSaved } from "../bulletins/storage/bulletinsStorage"

import { colors } from "../styles/colorPalette";

import { payBulletin } from "../bulletins/bulletinsController";
import { usePrinter } from "../printing/PrintingProvider";

export default function RecordScreen({ navigation }) {

    const [ticketsActive, setTicketsActive] = useState(true);

    const [tickets, setTickets] = useState([])

    const { connectedDevice, printTicket, printBulletin } = usePrinter();

    
    const [bulletins, setBulletins] = useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setData();
        });
    
        return unsubscribe;
    }, []);
    // Set the data to the states if data is not empty
    function setData() {

        getTicketsSaved().then((tickets) => {
            
            if (tickets.length > 0) {
                setTickets(tickets.reverse())
            }
        }).catch((error) => {
            Alert.alert("Error al cargar los datos", error, [
                {
                    text: "Ok",
                }
            ])
        })

        getBulletinsSaved().then((bulletins) => {
            
            if (bulletins.length > 0) {
                setBulletins(bulletins.reverse())
            }
        }).catch((error) => {
            Alert.alert("Error al cargar los datos", error, [
                {
                    text: "Vale",
                }
            ])
        })
        
    }

    function openBulletin(bulletin) {
        // Open an alert where the user can print the bulletin again such as pay it

        let title = `Boletín de matrícula ${bulletin["registration"]}`

        let date = bulletin["created_at"].split(" ")[0]
        let time = bulletin["created_at"].split(" ")[1]

        let bulletin_data = ''
        bulletin_data += `Fecha: ${ date } \n`
        bulletin_data += `Hora: ${ time }`

        Alert.alert(title, bulletin_data, [
            {
                text: "Cerrar",
            },
            {
                text: "Volver a imprimir",
                onPress: () => {
                    
                    if(connectedDevice == null) {
                        Alert.alert("Error al imprimir el boletín", "No se ha encontrado ninguna impresora contectada.", [
                            {
                                text: "Ok",
                            }
                        ]
                        )
                        return
                    }

                    let data_to_print = {
                        "Zona": bulletin["zone_name"],
                        "Duración": bulletin["duration"] + " min",
                        "Matrícula": bulletin["registration"],
                        "Precio": bulletin["price"] + " eur",
                        "Precepto": bulletin["precept"],
                        "Fecha": new Date().toLocaleDateString('es-ES'),
                        "Hora": new Date().toLocaleTimeString('es-ES'),
                    }
                    printBulletin(data_to_print)
                }
            },
            {
                text: "pagar",
                onPress: () => {
                    try {
                        payBulletin(bulletin["id"])
                    } catch (error) {
                        Alert.alert("Error al pagar", error, [
                            {
                                text: "Vale",
                            }
                        ])
                    }
                }
            }
        ])
    }

    function openTicket(ticket) {
        // Make the same as openBulletin but with tickets. Just delete the pay option and the "color", "model" and "brand" fields
        
        let title = `Ticket de matrícula ${ticket["registration"]}`

        
        let date = ticket["created_at"].split(" ")[0]
        let time = ticket["created_at"].split(" ")[1]

        let ticket_data = ''
        ticket_data += `Fecha: ${ date } \n`
        ticket_data += `Hora: ${ time }`
        


        Alert.alert(title, ticket_data, [
            {
                text: "Cerrar",
            },
            {
                text: "Volver a imprimir",
                onPress: () => {
                    if(connectedDevice == null) {
                        Alert.alert("Error al imprimir el ticket", "No se ha encontrado ninguna impresora contectada.", [
                            {
                                text: "Ok",
                            }
                        ]
                        )
                        return
                    }
                    
                    let data_to_print = {
                        "Zona": ticket["zone_name"],
                        "Duración": ticket["duration"] + " min",
                        "Matrícula": ticket["registration"],
                        "Precio": ticket["price"] + " eur",
                        "Precepto": ticket["precept"],
                        "Fecha": new Date().toLocaleDateString('es-ES'),
                        "Hora": new Date().toLocaleTimeString('es-ES'),
                    }
                    printTicket(data_to_print)
                }
            }
        ])
    }
    

    const renderTicket = ({ item }) => {
        if(item == null || item == undefined)
            return

        let ticket_style = getTicketAppareanceByDuration(item["duration"])
        let date = item["created_at"].split(" ")[0]
        let time = item["created_at"].split(" ")[1]
        let payment_method = item["payment_method"] == "CASH"? "efectivo":"tarjeta"

        return (<View style={[styles.ticket, ticket_style]}>
            <TouchableOpacity style={styles.ticket_button} onPress={() => openTicket(item)}>
                <Image source={require("../../assets/icons/logo.png")} style={{width: 50, height: 50, justifyContent: "center"}}></Image>
                <Text>Matrícula { item["registration"] }</Text>
                <Text>Duración { item["duration"] }</Text>
                <Text>Precio: { item["price"] } €</Text>
                <Text>Fecha: { date } </Text>
                <Text>Hora: { time }</Text>
                <Text>Método de pago: { payment_method }</Text>
            </TouchableOpacity>
        </View>);
    }
    

    const renderBulletin = ({item}) => {
        if(item == null || item == undefined)
            return

        let date = item["created_at"].split(" ")[0]
        let time = item["created_at"].split(" ")[1]
        let payment_method = item["payment_method"] == "CASH"? "efectivo":"tarjeta"

        let payment_status = item["paid"] ? "Sí" : "No"

        return(<View style={[styles.ticket, styles.bulletin_box]}>
            <TouchableOpacity style={styles.ticket_button} onPress={() => openBulletin(item)}>
                <Image source={require("../../assets/icons/logo.png")} style={{width: 50, height: 50, justifyContent: "center"}}></Image>
                <Text>Matrícula { item["registration"] }</Text>
                <Text>Duración { item["duration"] }</Text>
                <Text>Precio: { item["price"] } €</Text>
                <Text>Pagado: { payment_status }</Text>
                <Text>Precept: { item["precept"] }</Text>
                <Text>Fecha: { date } </Text>
                <Text>Hora: { time }</Text>
                <Text>Método de pago: { payment_method }</Text>
            </TouchableOpacity>
        </View>)
    }


    const tickets_list = (tickets==[] || tickets.length === 0 ? (<Text>Aún no has impreso ningún ticket</Text>) : (<FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(ticket) => ticket.id.toString()}
    />))

    const bulletins_list = (bulletins==[] || bulletins.length === 0 ? (<Text>Aún no has impreso ningún boletín</Text>) : (<FlatList
        data={bulletins}
        renderItem={renderBulletin}
        keyExtractor={(ticket) => ticket.id.toString()}
    />))


    function getTicketAppareanceByDuration(duration) {
        switch(duration) {
            case 30:
                return styles.yellow_box
            case 60:
                return styles.green_box
            case 90:
                return styles.orange_box
            case 120:
                return styles.pink_box
        }
    }

    return(<View style={styles.container}>
            <Text style={styles.title} horizontal="true">Historial de impresión:</Text>
            
            <View style={styles.selector}>
                <TouchableOpacity 
                    style={[styles.selector_button, {
                        backgroundColor: ticketsActive ? 
                            colors.light_green_selected : colors.light_green
                        }
                    ]}
                    onPress={() => setTicketsActive(true)}>
                    <Text>Tickets</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.selector_button, {
                        backgroundColor: ticketsActive ? 
                            colors.light_green : colors.light_green_selected
                        }
                    ]}
                    onPress={() => setTicketsActive(false)}>
                    <Text>Boletines</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.tickets_list}>
                { ticketsActive? tickets_list: bulletins_list }
            </View>
        </View>)
}


const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        zIndex: -20,
        height: "100%",
    },
    selector: {
        flexDirection: "row",
        marginBottom: 20,
    },
    selector_button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        borderColor: colors.dark_green,
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
        fontWeight: '400',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginTop: 20,
        color: colors.black,
    },
    tickets_list: {
        width: "80%",
        height: "76%",
        marginTop: 10,
        marginBottom: 0,
        borderRadius: 12,
        backgroundColor: colors.white,
    },
    ticket: {
        padding: 20,
        margin: 20,
        borderRadius:  4,
        justifyContent: 'center',
        alignItems: "center",
        height: "auto",
        backgroundColor: colors.white,
    },
    ticket_image: {
        width: 50,
        height: 50
    },
    ticket_selector_image: {
        width: 280,
        height: 160,
        borderRadius: 8,
    },
    green_box: {
        /* Create a green border */
        borderColor: "rgba(58, 175, 25, 0.8)",
        borderWidth: 2,
    },
    yellow_box: {
        /* Create a green border */
        borderColor: "rgba(253, 246, 50, 0.8)",
        borderWidth: 2,
    },
    orange_box: {
        /* Create a green border */
        borderColor: "rgba(255, 141, 3, 0.8)",
        borderWidth: 2,
    },
    pink_box: {
        /* Create a green border */
        borderColor: "rgba(228, 68, 121, 0.8)",
        borderWidth: 2,
    },
    bulletin_box: {
        borderColor: "rgba(63, 77, 202, 0.8)",
        borderWidth: 2,
    }
}
