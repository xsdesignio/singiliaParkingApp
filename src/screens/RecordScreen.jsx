import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";

import { getTicketsSaved } from "../tickets/storage/ticketsStorage"
import { getBulletinsSaved } from "../bulletins/storage/bulletinsStorage"

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
                setTickets(tickets)
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
                console.log("Si hay boletines")
                setBulletins(bulletins)
            }
        }).catch((error) => {
            Alert.alert("Error al cargar los datos", error, [
                {
                    text: "Ok",
                }
            ])
        })
        
    }

    

    const renderTicket = ({ item }) => {
        let img = getTicketAppareanceByDuration(item.duration)
        return (<View style={styles.ticket}>
            <TouchableOpacity style={styles.ticket_button}>
                <Image style={styles.ticket_selector_image} source={img} />
                <Text>{item.id}</Text>
            </TouchableOpacity>
        </View>);
    }

    const renderBulletin = ({item}) =>
        (<View style={styles.ticket}>
            <TouchableOpacity style={styles.ticket_button}>
                <Image style={styles.ticket_selector_image} source={require("../../assets/bulletins/bulletin.png")} />
                <Text>{item.id}</Text>
            </TouchableOpacity>
        </View>)

    const tickets_list = (<FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
    />)

    const bulletins_list = (<FlatList
        data={bulletins}
        renderItem={renderBulletin}
        keyExtractor={(item) => item.id.toString()}
    />)


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
                    style={[styles.selector_button, {backgroundColor: ticketsActive ? "#95e8c9": "#d4faec"}]}
                    onPress={() => setTicketsActive(true)}>
                    <Text>Tickets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.selector_button, {backgroundColor: ticketsActive ? "#d4faec": "#95e8c9"}]}
                    onPress={() => setTicketsActive(false)}>
                    <Text>Boletines</Text>
                </TouchableOpacity>
            </View>
            { ticketsActive? tickets_list: bulletins_list }
        </View>)
}


const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        width: "100%",
        height: "100%",
        gap: 0,
    },
    selector: {
        flexDirection: "row"
    },
    selector_button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        padding: 0,
    },
    tickets: {
        borderRadius:  4,
        width: "100%",
        height: "100%",
        marginTop: 20,
        padding: 20,
        paddingBottom: 60,
        backgroundColor: '#f5f5f5',
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
