/* eslint-disable react/prop-types */
import React, {memo} from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Image, TextInput } from "react-native";
import { useState, useEffect } from "react";

import { getTicketsSaved } from "../tickets/storage/ticketsStorage"
import { getBulletinsSaved } from "../bulletins/storage/bulletinsStorage"

import BulletinCancellationModel from "../components/bulletinCancellationModel";

import { colors } from "../styles/colorPalette";

import { usePrinter } from "../printing/PrintingProvider";



export default function RecordScreen({ navigation }) {

    const { connectedDevice, printTicket, printBulletin } = usePrinter();

    const [ticketsActive, setTicketsActive] = useState(true);
    const [tickets, setTickets] = useState([])
    
    const [bulletins, setBulletins] = useState([])
    const [filteredBulletins, setFilteredBulletins]  = useState([])

    
    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            await setData();
        });
    
        return unsubscribe;
    }, []);


    // Set the data to the states if data is not empty
    function setData() {
        getTicketsSaved().then((tickets) => {
            if (tickets.length > 0) {
                setTickets(tickets.reverse());
            }
        }).catch((error) => {
            Alert.alert("Error al cargar los datos", error, [{
                text: "Ok",
            }]);
        });
    
        getBulletinsSaved().then((obtained_bulletins) => {
            if (obtained_bulletins.length > 0) {
                setBulletins(obtained_bulletins.reverse());
                // Filter bulletins based on filterId
                if (filterId !== null) {
                    const updated_bulletins = obtained_bulletins.filter((bulletin) => {
                        return bulletin.id && bulletin.id.toString().includes(filterId);
                    });
                    setFilteredBulletins(updated_bulletins);
                } else {
                    setFilteredBulletins(obtained_bulletins);
                }
            }
        }).catch((error) => {
            Alert.alert("Error al cargar los datos", error, [{
                text: "Vale",
            }]);
        });
    }
    

    function openBulletin(bulletin) {
        // Open an alert where the user can print the bulletin again such as pay it

        let title = `Boletín de matrícula ${bulletin["registration"]}`

        let date = formatDate(bulletin["created_at"].split(" ")[0])
        let time = bulletin["created_at"].split(" ")[1].substring(0, 5)

        let bulletin_data = ''
        bulletin_data += `Fecha: ${ date } \n`
        
        bulletin_data += `Hora: ${ time } h`

        let alertOptions = [
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
                        "Precio": bulletin["price"] + "0 eur",
                        "Precepto": bulletin["precept"],
                        "Fecha": new Date(bulletin["created_at"]).toLocaleDateString('es-ES'),
                        "Hora": new Date(bulletin["created_at"]).toLocaleTimeString('es-ES'),
                    }
                    printBulletin(data_to_print)
                }
            }
        ];
    
        // If the bulletin is not paid, add the "pay" option
        if (!bulletin["paid"]) {
            alertOptions.push({
                text: "pagar",
                onPress: () => {
                    try {
                        managePayment(bulletin)/* 
                            .then(() => {
                                setData(); // Call setData() to refresh the data after successful payment
                                
                            }); */
                    } catch (error) {
                        Alert.alert("Error al pagar", error, [
                            {
                                text: "Vale",
                            }
                        ])
                    }
                }
            })
        }
    
        Alert.alert(title, bulletin_data, alertOptions);

    }


    function managePayment(bulletin) {
        setSelectedBulletin(bulletin)
        setBulletinPayment(true)
    }
    
    function openTicket(ticket) {
        // Make the same as openBulletin but with tickets. Just delete the pay option and the "color", "model" and "brand" fields
        
        let title = `Ticket de matrícula ${ticket["registration"]}`

        
        let date = formatDate(ticket["created_at"].split(" ")[0])
        let time = ticket["created_at"].split(" ")[1].substring(0, 5)

        let ticket_data = ''
        ticket_data += `Fecha: ${ date } \n`
        ticket_data += `Hora: ${ time } h`
        


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
                        "Precio": ticket["price"] + "0 eur",
                        "Precepto": ticket["precept"],
                        "Fecha": new Date().toLocaleDateString('es-ES'),
                        "Hora": new Date().toLocaleTimeString('es-ES'),
                    }
                    printTicket(data_to_print)
                }
            }
        ])
    }
    
    const RenderTicket = memo(({ ticket }) => {
        if(ticket == null || ticket == undefined)
            return

        let ticket_style = styles.green_box
        let date = formatDate(ticket["created_at"].split(" ")[0])
        let time = ticket["created_at"].split(" ")[1].substring(0, 5)
        let payment_method = ticket["payment_method"] == "CASH"? "efectivo":"tarjeta"

        return (<View style={[styles.ticket, ticket_style]}>
            <TouchableOpacity style={styles.ticket_button} onPress={() => openTicket(ticket)}>
                <Image source={require("../../assets/icons/logo.png")} style={styles.ticket_image}></Image>
                <Text style={styles.ticket_title}>Ticket Estacionamiento Regulado</Text>
                <Text style={styles.ticket_important_text}>Id: { ticket["id"] }</Text>
                <Text style={styles.ticket_text}>Matrícula { ticket["registration"] }</Text>
                <Text style={styles.ticket_text}>Fecha: { date } </Text>
                <Text style={styles.ticket_important_text}>Hora: { time } h</Text>
                <Text style={styles.ticket_text}>Zona: { ticket["zone_name"] }</Text>
                <Text style={styles.ticket_text}>Duración { ticket["duration"] }</Text>
                <Text style={styles.ticket_text}>Precio: { ticket["price"] } €</Text>
                <Text style={styles.ticket_text}>Método de pago: { payment_method }</Text>
            </TouchableOpacity>
        </View>);
    })
    RenderTicket.displayName = 'RenderedTicket';
    
    const RenderedBulletin = memo(({ bulletin }) => {
        if (bulletin == null || bulletin == undefined)
            return null;
    
        let date = formatDate(bulletin["created_at"].split(" ")[0]);
        let time = bulletin["created_at"].split(" ")[1].substring(0, 5);
    
        let payment_method = bulletin["payment_method"] ? (bulletin["payment_method"] == "CASH" ? "efectivo" : "tarjeta") : null;
    
        let payment_status = bulletin["paid"] ? "Sí" : "No";
    
        return (
            <View style={[styles.ticket, styles.bulletin_box]}>
                <TouchableOpacity style={styles.ticket_button} onPress={() => openBulletin(bulletin)}>
                    <Image source={require("../../assets/icons/logo.png")} style={styles.ticket_image} />
                    <Text style={styles.ticket_title}>Boletín Estacionamiento Regulado</Text>
                    <Text style={styles.ticket_important_text}>Id: {bulletin["id"]}</Text>
                    <Text style={styles.ticket_text}>Matrícula: {bulletin["registration"]}</Text>
                    <Text style={styles.ticket_text}>Fecha: {date}</Text>
                    <Text style={styles.ticket_important_text}>Hora: {time} h</Text>
                    <Text style={styles.ticket_text}>Pagado: {payment_status}</Text>
                    {bulletin["duration"] != null && bulletin["duration"].length > 0 ? (
                        <Text style={styles.ticket_text}>Duración: {bulletin["duration"]}</Text>
                    ) : (
                        <></>
                    )}
                    {bulletin["price"] != null && bulletin["price"] > 0 ? (
                        <Text style={styles.ticket_text}>Precio: {bulletin["price"]} €</Text>
                    ) : (
                        <></>
                    )}
                    {payment_method != null ? (
                        <Text style={styles.ticket_text}>Método de pago: {payment_method} €</Text>
                    ) : (
                        <></>
                    )}
    
                    {bulletin["brand"] != null && bulletin["brand"].length > 0 ? (
                        <Text style={styles.ticket_text}>Marca: {bulletin["brand"]}</Text>
                    ) : (
                        <></>
                    )}
                    {bulletin["model"] != null && bulletin["model"] > 0 ? (
                        <Text style={styles.ticket_text}>Modelo: {bulletin["model"]}</Text>
                    ) : (
                        <></>
                    )}
                    {bulletin["color"] != null && bulletin["color"].length > 0 ? (
                        <Text style={styles.ticket_text}>Color: {bulletin["color"]}</Text>
                    ) : (
                        <></>
                    )}
                    <Text style={styles.ticket_text}>Precept: {bulletin["precept"]}</Text>
                </TouchableOpacity>
            </View>
        );
    });
    RenderedBulletin.displayName = 'RenderedBulletin';

    function formatDate(date) {
        let elements = date.split("-")
        let day = elements[2]
        let month = elements[1]
        let year = elements[0]

        return `${day}/${month}/${year}`
    }

    const tickets_list = (tickets==[] || tickets.length === 0 ? (<Text style={styles.no_elements_text}>Aún no has impreso ningún ticket</Text>) : (<FlatList
        data={tickets}
        renderItem={({item}) => <RenderTicket ticket={item} />}
        keyExtractor={(ticket) => ticket.id.toString()}
    />))

    const bulletins_list = (filteredBulletins==[] || filteredBulletins.length === 0 ? (<Text style={styles.no_elements_text}>Aún no has impreso ningún boletín</Text>) : 
    (<FlatList
        data={filteredBulletins}
        renderItem={({ item }) => <RenderedBulletin bulletin={item} />}
        keyExtractor={(bulletin) => bulletin.id.toString()}
    />))


    const [selectedBulletin, setSelectedBulletin] = useState()

    const [bulletinPayment, setBulletinPayment] = useState(false)

    const [filterId, setFilterId] = useState(null)

    
    function filterBulletins(id) {
        setFilterId(id);
        
        let updated_bulletins = bulletins.filter((bulletin) => {
            return bulletin && bulletin.id !== undefined && bulletin.id.toString().includes(id);
        });
    
        setFilteredBulletins(updated_bulletins);
    }


    return(<View style={styles.container}>

            {/* Bulletin Modal to manage bulletin cancellation and printing */}
            { bulletinPayment ? <BulletinCancellationModel bulletin={selectedBulletin} closeModal={() => setBulletinPayment(false)}></BulletinCancellationModel> : <></>}

            {/* Selector to switch between tickets and bulletins list */}
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

            {/* The choosen list */}
            <View style={styles.tickets_list}>
                
                {/* If tickets are not active, it means that bulletins are active */}
                { !ticketsActive ? (
                    <>
                        <Text style={styles.label}>Filtrar boletines mediante id:</Text>
                        <TextInput
                                style={styles.input}
                                value = {filterId}
                                keyboardType="numeric"
                                onChangeText={(value) => filterBulletins(value)}
                                placeholder="000">
                        </TextInput>
                    </>
                    
                    
                ) : (<></>) }

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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        width: "80%",
        alignSelf: "center",
        backgroundColor: colors.white,
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
    no_elements_text: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        padding: 20,
        color: colors.black,
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
    label: {
        fontSize: 14,
        fontWeight: '400',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginTop: 20,
        color: colors.black,
    },
    tickets_list: {
        width: "80%",
        height: "84%",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 0,
        borderRadius: 12,
        backgroundColor: colors.white,
    },
    ticket: {
        paddingVertical: 20,
        paddingHorizontal: 14,
        margin: 20,
        borderRadius:  4,
        justifyContent: 'center',
        alignItems: "center",
        height: "auto",
        backgroundColor: colors.white,
    },
    ticket_image: {
        width: 50,
        height: 50,
    },
    ticket_title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 0,
        marginTop: 20,
        marginBottom: 20,
        color: colors.black,
    },
    ticket_text: {
        fontSize: 16,
        fontWeight: '400',
        margin: 2,
        padding: 0,
        color: colors.black,
    },

    ticket_important_text: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 0,
        color: colors.black,
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
