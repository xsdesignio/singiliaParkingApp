import { StyleSheet, View, Text, Button } from "react-native";
import Menu from "../src/components/menu";
import Header from "../src/components/header";
import BulletinsScreen from "../src/screens/BulletinsScreen";


export default function bulletinsView() {
    return(<View style={styles.container}>
        <Header/>
        <BulletinsScreen/>
        <Menu/>
    </View>)
}


const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
}
