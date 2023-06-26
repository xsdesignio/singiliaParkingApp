import { ScrollView, StyleSheet, View, Text, Alert, TextInput, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

import { Picker } from '@react-native-picker/picker';

export default function bulletinsScreen() {

    const [duration, setDuration] = useState(0)

    const [precept, setPrecept] = useState("Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza.")

    const [availableTickets, setAvailableTickets] = useState([
        {
            imageUrl: require("../assets/bulletins/bulletin.png"),
            duration: "",
            color: "yellow",
        },
    ])

    

    const [selectedTicket, setSelectedTicket] = useState(availableTickets[0])

    function handleDuration (value) {
        const numericValue = value.replace(/[^0-9]/g, '');
        setDuration(numericValue);
    }
    function handleRegistration(value) {

    }

    return(
        <View style={styles.container}>
            <View style={styles.bulletin}>
                <Image style={styles.bulletin_image} source={require("../assets/bulletins/bulletin.png")} />
            </View>
            <View style={styles.bulletin_info_form}>

                <Text style={styles.label}>Datos del vehículo:</Text>

                <View style={styles.bulletin_inputs}>
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(values) => handleDuration(values)}
                            placeholder="Matricula"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(values) => handleDuration(values)}
                            placeholder="Marca"
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(values) => handleDuration(values)}
                            placeholder="Modelo"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(values) => handleDuration(values)}
                            placeholder="Color"
                        />
                    </View>
                </View>
                <View style={styles.bulletin_inputs}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(values) => handleDuration(values)}
                        placeholder="Tiempo estacionado"

                    />
                </View>
                <View>
                    <Text style={styles.label}>Precepto Infringido:</Text>
                    <Picker
                        selectedValue={"A ver"}
                        onValueChange={(itemValue, itemIndex) =>
                            setPrecept(itemValue)
                        }
                    >
                        <Picker.Item
                            label="Estacionar sin ticket de aparcamiento"
                            value="Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza."
                        />
                        <Picker.Item
                            label="Estacionar sin ticket de aparcamiento"
                            value="Rebosar el horario de permanencia asociado. Art. 14 Ordenanza."
                        />
                        <Picker.Item
                            label="Estacionar sin ticket de aparcamiento"
                            value="No colocar el ticket de forma visible. Art. 14 Ordenanza."
                        />
                    </Picker>
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.print_button}
                        // onPress={() => printTicket(duration)}
                    >
                        <Text style={styles.print_button_text}>
                            Imprimir
                        </Text>
                    </TouchableOpacity>
                </View>
                
            </View> 
            <View style={styles.bottom_margin}></View>
        </View>)
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 80,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#F9FFFF',
        marginTop: 60,
        marginBottom: 40,
    },
    bulletin: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: "100%",
        margin: 0,
        padding: 0,
    },
    bulletin_image: {
        height: 200,
        width: 350,
        borderRadius: 4,
        padding: 20,
        borderWidth: 2,
        borderColor: '#00b3ff',
    },
    bulletin_info_form: {
        justifyContent: "center",
        alignItems: "center",
        height: 180,
        gap: 0,
        marginTop: 0,
        marginBottom: 20,
    },
    bulletin_inputs: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
        minHeight: 40
    },
    label: {
        marginTop: 8,
        marginBottom: 4
    },
    input: {
        borderWidth: 1,
        borderColor: 'darkblue',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 180,
        marginVertical: 4,
    },
    print_button: {
        backgroundColor: "#559f97",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 18,
        color: 'white',
        width: 180,
        margin: 20
    },
    print_button_text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 8,
    }
    
})
