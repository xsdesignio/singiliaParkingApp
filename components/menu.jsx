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
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    page_link: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 18,
        textAlign: "center",
        backgroundColor: '#EBEDFF',
    },
    selected_page_link: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 18,
        textAlign: "center",
        backgroundColor: '#CBC7F7',
    }
    
})