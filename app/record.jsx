import { StyleSheet, View } from "react-native";

import Menu from "../src/components/menu";
import RecordScreen from "../src/screens/RecordScreen";
import Header from "../src/components/header";



export default function recordView() {

    return(<View>
        <Header/>
        <RecordScreen/>
        <Menu/>
    </View>)
}

