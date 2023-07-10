import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { useEffect, useState } from "react";

import { getTicketsSaved } from "../tickets/storage/ticketsStorage"
import { getBulletinsSaved } from "../bulletins/storage/bulletinsStorage"

import { colors } from "../styles/colorPalette";



export default function RecordScreen() {

    const [ticketsActive, setTicketsActive] = useState(true);

    const [tickets, setTickets] = useState([])

    
    const [bulletins, setBulletins] = useState([])

    useEffect(() => {
        setData()
    }, [])

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
            console.log("bulletins", bulletins.length)
            if (bulletins.length > 0) {
                setBulletins(bulletins.reverse())
            }
        }).catch((error) => {
            Alert.alert("Error al cargar los datos", error, [
                {
                    text: "Ok",
                }
            ])
        })
        
    }

    function openItem(item) {
        console.log(item)
    }
    

    const renderTicket = ({ item }) => {
        let img = getTicketAppareanceByDuration(item.duration)
        return (<View style={styles.ticket}>
            <TouchableOpacity style={styles.ticket_button}>
                <Image style={styles.ticket_selector_image} source={img} />
            </TouchableOpacity>
        </View>);
    }
    

    const renderBulletin = ({item}) => {
        return(<View style={styles.ticket}>
            <TouchableOpacity style={styles.ticket_button} onPress={openItem(item)}>
                <Image style={styles.ticket_selector_image} source={require("../../assets/bulletins/bulletin.png")} />
            </TouchableOpacity>
        </View>)
    }


    const tickets_list = (tickets==[]? (<Text>Aún no has impreso ningún ticket</Text>) : (<FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
    />))

    const bulletins_list = (bulletins==[]? (<Text>Aún no has impreso ningún boletín</Text>) : (<FlatList
        data={bulletins}
        renderItem={renderBulletin}
        keyExtractor={(item) => item.id.toString()}
    />))


    function getTicketAppareanceByDuration(duration) {
        switch(duration) {
            case 30:
                return require("../../assets/tickets/30.png")
            case 60:
                return require("../../assets/tickets/60.png")
            case 90:
                return require("../../assets/tickets/90.png")
            case 120:
                return require("../../assets/tickets/120.png")
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
    },
    selector: {
        flexDirection: "row"
    },
    selector_button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        marginTop: 20,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        color: "white",
        padding: 0,
    },
    tickets: {
        width: "100%",
        height: "100%",
        marginTop: 20,
        padding: 20,
        paddingBottom: 60,
        backgroundColor: '#f5f5f5',
    },

    tickets_list: {
        borderRadius:  40,
        width: "80%",
        height: "90%",
        paddingTop: 20,
        marginTop: 10,
        marginBottom: 40,
        backgroundColor: colors.dark_green
    },
    ticket: {
        borderRadius:  4,
        justifyContent: 'flex-start',
        alignItems: "center",
        height: 190
    },
    ticket_selector_image: {
        width: 280,
        height: 160,
        borderRadius: 8,
    },
}
