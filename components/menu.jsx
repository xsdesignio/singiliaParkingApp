import { StyleSheet, View } from "react-native";
import { Link } from 'expo-router'



export default function Menu() {
    return (<View style={styles.pages}>
        <Link href='/tickets' style={styles.page_link}>Tickets</Link>
        <Link href='/printing' style={styles.page_link}>Impresión</Link>
        <Link href='/zones' style={styles.page_link}>Zonas</Link>
    </View>)
}



let styles = StyleSheet.create({
    pages: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: '#EBEDFF',
    },
    page_link: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 18,
    }
    
})