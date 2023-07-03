import { Image, Keyboard, StyleSheet, Text, View } from "react-native"
import { Link, usePathname } from 'expo-router'
import { useEffect, useState, useRef } from "react"
import { Animated } from 'react-native'

export default function Menu() {
    let path_name = usePathname()

    const [jsxLinks, setJsxLinks] = useState()

    const [links, setLinks] = useState([
        {
            name: 'Historial',
            href: '/record',
            active: false,
            source: require('../../assets/icons/ticket.png'),
        },
        {
            name: 'Tickets',
            href: '/tickets',
            active: false,
            source: require('../../assets/icons/printing.png'),
        },
        {
            name: 'Boletines',
            href: '/bulletins',
            active: false,
            source: require('../../assets/icons/printing.png'),
        }
    ])


    const [isShown, setIsShown] = useState(true)

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

        const keyboardShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsShown(false)
            }
        );

        const keyboardHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsShown(true)
            }
        );

    }, []);

    return (<>
        { isShown ? 
            (<View style={styles.pages}>
                {jsxLinks}
            </View>) 
            : (<View style={styles.content_moved}></View>)
        }
    </>)
}


let styles = StyleSheet.create({
    content_moved: {
        height: 120,
        backgroundColor: '#60826a',
        zIndex: -10,
    },
    pages: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        gap: 20,
        paddingHorizontal: 60,
        borderTopColor: "#C2D9C9",
        borderTopWidth: 1,
        backgroundColor: '#F9FFFF',
        zIndex: -10,
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
        zIndex: -10,
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.44,
        shadowRadius: 6.68,

        elevation: 10,
    }
    
})