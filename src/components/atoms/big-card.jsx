import React from "react"
import { StyleSheet, View, Image } from "react-native"


// Card is used to name common components for such tickets as bulletins.
export default function BigCard({imageUrl}) {

    return (
        <View style={styles.ticket}>
            <Image style={styles.ticket_image} source={imageUrl} />
        </View>
    )
}



const styles = StyleSheet.create({
    ticket: {
        alignItems: "center",
        borderRadius:  4,
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },
    ticket_image: {
        height: 165,
        width: 288.2,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#35523e',
    },
})