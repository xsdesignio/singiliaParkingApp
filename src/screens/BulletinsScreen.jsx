import { ScrollView, StyleSheet, View, Text, Alert, TextInput, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

import { printBulletin } from "../controllers/bulletins";

import { Picker } from '@react-native-picker/picker';

export default function bulletinsScreen() {
    
    const [bulletinInfo, setBulletinInfo] = useState({
        "responsible": undefined,
        "location": undefined,
        "registration": undefined,
        "precept": "Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza.",
        "duration": undefined,
        "price": undefined,
        "paid": true,
        "brand": undefined,
        "model": undefined,
        "signature": undefined,
        "sent_to_server": undefined
    })



    const payment_methods = {
        CASH: "cash",
        CARD: "credit card"
    }
    

    function updateBulletinInfo(key, value) {
        setBulletinInfo((prevBulletinInfo) => ({
          ...prevBulletinInfo,
          [key]: value,
        }));
    }


    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.bulletin}>
                <Image style={styles.bulletin_image} source={require("../assets/bulletins/bulletin.png")} />
            </View>
            <View style={styles.bulletin_info_form}>

                <Text style={styles.label}>Datos del vehículo:</Text>

                <View style={styles.bulletin_inputs}>
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(registration) => 
                                updateBulletinInfo("registration", registration)
                            }
                            placeholder="Matricula"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(model) => 
                                updateBulletinInfo("model", model)}
                            placeholder="Modelo"
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={(brand) => 
                                updateBulletinInfo("brand", brand)}
                            placeholder="Marca"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(color) => 
                                updateBulletinInfo("color", color)}
                            placeholder="Color"
                        />
                    </View>
                </View>
                <View style={styles.bulletin_inputs}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(duration) => 
                            updateBulletinInfo("duration", duration)}
                        placeholder="Tiempo estacionado"
                        keyboardType="numeric"
                    />
                </View>

                <Text style={styles.label}>Precepto Infringido:</Text>

                <View style={styles.picker_wraper}>
                    <Picker
                        style={styles.picker}
                        selectedValue={bulletinInfo["precept"]}
                        onValueChange={(precept) => 
                            updateBulletinInfo("precept", precept)
                        }
                        itemStyle={styles.picker_item}
                    >
                        <Picker.Item
                            label="Estacionar sin ticket de aparcamiento"
                            value="Estacionar sin ticket de aparcamiento. Art. 14 Ordenanza."
                        />
                        <Picker.Item
                            label="Rebosar el horario de permanencia asociado"
                            value="Rebosar el horario de permanencia asociado. Art. 14 Ordenanza."
                        />
                        <Picker.Item
                            label="No colocar el ticket de forma visible"
                            value="No colocar el ticket de forma visible. Art. 14 Ordenanza."
                        />
                    </Picker>
                </View>

                <Text style={styles.label}>Método de pago:</Text>

                <View style={styles.selector}>
                    <TouchableOpacity 
                        style={[
                            styles.selector_button, 
                            {backgroundColor: (bulletinInfo["paid"]==true) ? "#95e8c9": "#d4faec"}]
                        }
                        onPress={() => updateBulletinInfo("paid", true)}>
                        <Text>Tarjeta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.selector_button, 
                            {backgroundColor: (bulletinInfo["paid"]==false) ? "#95e8c9": "#d4faec"}]
                        }
                        onPress={() => updateBulletinInfo("paid", false)}>
                        <Text>Efectivo</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.print_button}
                        onPress={() => printBulletin(bulletinInfo)}
                    >
                        <Text style={styles.print_button_text}>
                            Imprimir
                        </Text>
                    </TouchableOpacity>
                </View>
                
            </View> 
            <View style={styles.bottom_margin}></View>
        </ScrollView>)
}

let styles = StyleSheet.create({
    container: {
        flex: 2,
        gap: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#F9FFFF',
        marginTop: 0,
        marginBottom: 0,
    },
    bulletin: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: "100%",
        margin: 12,
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
    },
    picker_wraper: {
        height: 40,
        width: 320,
        borderWidth: 1,
        borderColor: 'darkblue',
        borderRadius: 5,
        padding: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    picker: {
        width: "100%",
    },
    picker_item: {
        fontSize: 8,
    },
    selector: {
        flexDirection: "row"
    },
    selector_button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        borderRadius: 20
    },
    
})
