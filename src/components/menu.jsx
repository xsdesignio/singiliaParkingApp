/* eslint-disable react/prop-types */
import React from "react"
import { Image, Keyboard, StyleSheet, Text, View, TouchableOpacity } from "react-native"
//import { Link, usePathname } from 'expo-router'
import { colors } from "../styles/colorPalette"
import { useEffect, useState } from "react"
// import { TouchableOpacity } from "react-native-gesture-handler"
//import { Animated } from 'react-native'


export default function Menu( { navigation } ) {
    const [path_name, setPathName] = useState()

    const [jsxLinks, setJsxLinks] = useState()

    const [pages, setPages] = useState([
        {
            name: 'Historial',
            link: 'Record',
            active: false,
            source: require('../../assets/icons/ticket.png'),
        },
        {
            name: 'Tickets',
            link: 'Tickets',
            active: false,
            source: require('../../assets/icons/printing.png'),
        },
        {
            name: 'Boletines',
            link: 'Bulletins',
            active: false,
            source: require('../../assets/icons/printing.png'),
        },
        {
            name: 'Ajustes',
            link: 'Settings',
            active: false,
            source: require('../../assets/icons/settings.png'),
        }
    ])


    const [isShown, setIsShown] = useState(true)

    useEffect(() => {
        if(navigation == undefined) return

        let state = navigation.getState()

        setPathName(state.routes[state.routes.length-1].name)
        
        setPages(pages.map(el => {
            if (path_name == el.link) {
                el.active = true
                console.log("This doesn't work")
            }
            return el
        }))
        

        setJsxLinks(pages.map((page) => {
            return (
                <TouchableOpacity key={page.name} onPress={() => navigation.replace(page.link)} style={page.active ? styles.selected_page_link : styles.page_link}>
                    <Image style={styles.link_icon} source={page.source} />
                    {page.active ? (<Text> {page.name}</Text>) : ""}
                </TouchableOpacity>
            );
        }));

        Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsShown(false)
            }
        );

        Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsShown(true)
            }
        );

    }, [navigation]);

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
        backgroundColor: colors.green,
        height: 120,
        zIndex: -10,
    },
    link_icon: {
        height: 28,
        width: 28,
    },/* 
    link_text: {
        paddingLeft: 20,
    }, */
    page_link: {
        alignItems: 'center',
        backgroundColor: colors.light_green,
        borderRadius: 28,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        padding: 2,
        paddingHorizontal: 20,
        zIndex: -10,
    },
    pages: {
        alignItems: 'center',
        backgroundColor: colors.background,
        borderTopColor: colors.border_color,
        borderTopWidth: 1,
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-between',
        minWidth: 400,
        paddingHorizontal: 60,
        paddingVertical: 8,
        zIndex: -10,
    },
    selected_page_link: {
        backgroundColor: colors.light_green_selected,
        borderRadius: 28,
        elevation: 10,
        height: 60,
        padding: 8,
        paddingHorizontal: 20,
        shadowColor: colors.black,
        shadowOffset: {
            height: 5,
            width: 0,
        },
        shadowOpacity: 0.44,
        shadowRadius: 6.68,
        textAlign: "center",
    },
});
