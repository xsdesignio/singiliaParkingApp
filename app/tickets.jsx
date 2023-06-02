import { StyleSheet, View, Text, Button } from "react-native";

import Menu from "../components/menu";



export default function ticketsView() {
    return(<View>
        <View>
            <Text>Tickets impresos:</Text>
            <Text>Filtrar tickets</Text>
        </View>
        <Menu/>
    </View>)
}
