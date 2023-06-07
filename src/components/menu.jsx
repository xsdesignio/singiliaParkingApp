import { Image, StyleSheet, Text, View } from "react-native";
import { Link, usePathname } from 'expo-router'
import { useEffect, useState } from "react";



export default function Menu() {
    let path_name = usePathname()

    const [jsxLinks, setJsxLinks] = useState()
    const [links, setLinks] = useState([
        {
            name: 'Tickets',
            href: '/tickets',
            active: false,
            source: require('../../assets/ticket.png'),
        },
        {
            name: 'Printing',
            href: '/printing',
            active: false,
            source: require('../../assets/printing.png'),
        },
        {
            name: 'Zones',
            href: '/zones',
            active: false,
            source: require('../../assets/map.png'),
        }
    ])

    useEffect(() => {
        setLinks(links.map(el => {
            if( path_name == el.href) {
                el.active = true
            }
            return el
        }))

        setJsxLinks(links.map((link) => (
            <Link key={link.name} href={ link.href } style={ link.active? styles.selected_page_link : styles.page_link}>
                <Image style={styles.link_icon} source={link.source} />
                {link.active? (<Text> {link.name}</Text>) : "" }
        </Link>)))
    }, [])
    


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
        backgroundColor: '#F9FFFF'
    },
    page_link: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingHorizontal: 20,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#EBEDFF',
    },
    link_icon: {
        width: 28,
        height: 28,
        
    },
    link_text: {
        paddingLeft: 20,
    },
    selected_page_link: {
        padding: 10,
        paddingHorizontal: 20,
        height: 60,
        borderRadius: 12,
        textAlign: "center",
        backgroundColor: '#CBC7F7',
    }
    
})