import React from "react"
import { Image, StyleSheet } from "react-native"

export default function Logo() {
    return(
        <Image source={require("../../../assets/icons/logo.png")} style={styles.logo_image}></Image>
    )
}

const styles = StyleSheet.create({
    logo_image: {
        height: 50, 
        justifyContent: "center",
        width: 50, 
    },
})

