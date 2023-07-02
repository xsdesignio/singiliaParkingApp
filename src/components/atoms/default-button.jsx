import { StyleSheet, TouchableOpacity, Text } from "react-native";



export default function DefaultButton({text, onPress}){

    return(
        <TouchableOpacity style={style.print_button} onPress={onPress}>
            <Text style={style.print_button_text}>
                {text}
            </Text>
        </TouchableOpacity>
    )

}


const style = StyleSheet.create({
    print_button: {
        width: 200,
        margin: 10,
        backgroundColor: "#559f97",
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },
    print_button_text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 8,
    }
})

