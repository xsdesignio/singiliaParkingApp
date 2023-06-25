import { StyleSheet, View, Text, Button, TouchableOpacity, Image, ScrollView } from "react-native";


export default function TicketsScreen() {

    return(<View style={styles.container}>
            <Text style={styles.title} horizontal="true">Tickets impresos:</Text>
            <ScrollView style={styles.tickets}>
                <View style={styles.ticket}>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Image style={styles.ticket_selector_image} source={require("../assets/tickets/30.png")} />
                    </TouchableOpacity>
                </View>
                <View style={styles.ticket}>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Image style={styles.ticket_selector_image} source={require("../assets/tickets/30.png")} />
                    </TouchableOpacity>
                </View>
                <View style={styles.ticket}>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Image style={styles.ticket_selector_image} source={require("../assets/tickets/90.png")} />
                    </TouchableOpacity>
                </View>
                <View style={styles.ticket}>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Image style={styles.ticket_selector_image} source={require("../assets/tickets/60.png")} />
                    </TouchableOpacity>
                </View>

                <View style={styles.ticket}>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Image style={styles.ticket_selector_image} source={require("../assets/tickets/120.png")} />
                    </TouchableOpacity>
                </View>
                <View style={styles.ticket}>
                    <TouchableOpacity style={styles.ticket_button}>
                        <Image style={styles.ticket_selector_image} source={require("../assets/tickets/90.png")} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>)
}


const styles = {
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
        width: "100%",
        height: "100%",
        gap: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
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
