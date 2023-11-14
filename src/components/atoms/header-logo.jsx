import React from "react"
import { Image, StyleSheet } from "react-native"

export default function HeaderLogo() {
    return(
        <Image source={require("../../../assets/icons/logo.png")} style={styles.logo_image}></Image>
    )
}

const styles = StyleSheet.create({
    logo_image: {
        height: 34, 
        justifyContent: "center",
        width: 34, 
    },
})

