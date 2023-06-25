import { Image, StyleSheet, Text, View } from "react-native"
import { Link, usePathname } from 'expo-router'
import { useEffect, useState, useRef } from "react"
import { Animated } from 'react-native'

export default function Menu() {
    let path_name = usePathname()

    const [jsxLinks, setJsxLinks] = useState()
    const [links, setLinks] = useState([
        {
            name: 'Tickets',
            href: '/tickets',
            active: false,
            source: require('../assets/ticket.png'),
        },
        {
            name: 'Printing',
            href: '/printing',
            active: false,
            source: require('../assets/printing.png'),
        },
        {
            name: 'Bulletins',
            href: '/bulletins',
            active: false,
            source: require('../assets/ticket.png'),
        }
    ])

    useEffect(() => {
        setLinks(links.map(el => {
            if (path_name == el.href) {
                el.active = true
            }
            return el
        }))

        setJsxLinks(links.map((link) => {
            return (
                <Link key={link.name} href={link.href} style={link.active ? styles.selected_page_link : styles.page_link}>
                    <Image style={styles.link_icon} source={link.source} />
                    {link.active ? (<Text> {link.name}</Text>) : ""}
                </Link>
            );
        }));

    }, []);

    return (
        <View style={styles.pages}>
            {jsxLinks}
        </View>
    )
}


let styles = StyleSheet.create({
    pages: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderTopColor: "#C2D9C9",
        borderTopWidth: 1,
        backgroundColor: '#F9FFFF'
    },
    page_link: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        paddingHorizontal: 20,
        height: 50,
        borderRadius: 28,
        backgroundColor: '#d4faec',
    },
    link_icon: {
        width: 28,
        height: 28,
        
    },
    link_text: {
        paddingLeft: 20,
    },
    selected_page_link: {
        padding: 8,
        paddingHorizontal: 20,
        height: 60,
        borderRadius: 28,
        textAlign: "center",
        backgroundColor: '#95e8c9',
    }
    
})