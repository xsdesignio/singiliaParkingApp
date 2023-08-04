import { View } from "react-native";

import TicketsScreen from "../src/screens/TicketsScreen";
import Menu from "../src/components/menu";
import Header from "../src/components/header";


export default function tickets() {

    return(<View>
        <Header/>
        <TicketsScreen/>
        <Menu/>
    </View>)
}

