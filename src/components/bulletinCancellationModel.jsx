/* eslint-disable react/prop-types */
// Create a modal that receives the bulletin info and give the option to cancel it
import React, { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { obtainAvailableBulletins } from '../bulletins/availableBulletins';
import { Picker } from '@react-native-picker/picker';
import DefaultButton from '../components/atoms/default-button';
import { colors } from '../styles/colorPalette';
import { usePrinter } from '../printing/PrintingProvider';
import { cancelBulletin } from '../bulletins/bulletinsController';



export default function BulletinCancellationModel({ bulletin, closeModal }) {

    const printer = usePrinter()


    const payment_methods = Object.freeze({
        CASH: "CASH",
        CARD: "CARD"
    })

    const [duration, setDuration] = useState(null)
    const [price, setPrice] = useState(null)
    
    const [availableBulletins, setAvailableBulletins] = useState([])

    const [paymentMethod, setPaymentMethod] = useState(null)


    async function handlePayment() {
        let cancelled_bulletin = await cancelBulletin(printer, bulletin["id"], paymentMethod, duration, price)
        if(!cancelled_bulletin)
            return
        bulletin["paid"] = true
        bulletin["payment_method"] = paymentMethod
        bulletin["duration"] = duration
        bulletin["price"] = price
        closeModal()

    }


    useEffect(() => {

        obtainAvailableBulletins().then(available_bulletins => {
            if (available_bulletins != null) {
                setAvailableBulletins(available_bulletins.reverse())
                setDuration(available_bulletins[0].duration)
                setPrice(available_bulletins[0].price)
            }
            else
                setAvailableBulletins([])

        }).catch(error => {
            console.log(error)
        })
    }, [])
    


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={closeModal}
        >
            <View style={styles.container}>
                <View style={styles.content_wrapper}>
                    <TouchableOpacity style={styles.cancel_button} onPress={closeModal}>
                        <FontAwesome name="times-circle" size={28} color="black" />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        
                        <Text style={styles.title}>Boletín con ID: { bulletin["id"] }</Text>
                        <Text style={styles.info_text}>Matrícula: <Text style={styles.bold_text}>{ bulletin["registration"] }</Text></Text>
                        <Text style={styles.info_text}>Día: <Text style={styles.bold_text}>{ bulletin["created_at"].split(" ")[0] }</Text></Text>
                        <Text style={styles.info_text}>Hora: <Text style={styles.bold_text}>{ bulletin["created_at"].split(" ")[1].substring(0, 5) } h </Text></Text>
                        <Text style={ styles.label}>Duración</Text>
                        <View style={styles.duration_picker_wraper}>
                            
                            { availableBulletins != null ? (
                            <Picker
                                style={styles.picker}
                                selectedValue={duration}
                                onValueChange={(duration) => {
                                    setDuration(duration)

                                    const selectedBulletin = availableBulletins.find((bulletin) => bulletin.duration === duration);
                                    if (selectedBulletin) {
                                        setPrice(selectedBulletin.price);
                                    }
                                }}

                                itemStyle={styles.picker_item}
                            >
                                {/* Iterate the available tickets to get a picker item for each available ticket duration */}
                                {
                                 availableBulletins.map((bulletin) => {
                                    return(
                                        <Picker.Item
                                            style={styles.picker_item}
                                            key={bulletin.id}
                                            label={bulletin.duration}
                                            value={bulletin.duration}
                                        />
                                    )
                                })
                            }
                            </Picker>
                            ) : <></>}
                            
                        </View>

                        <Text style={styles.label}>Precio</Text>
                        <Text style={styles.price}>
                            { price } €
                        </Text>

                        <Text style={styles.label}>Métodos de pago:</Text>
                        
                        <View style={styles.selector}>
                            <TouchableOpacity 
                                style={[
                                    styles.selector_button, 
                                    {
                                        backgroundColor: (paymentMethod==payment_methods.CARD) ? 
                                            colors.light_green_selected : colors.light_green
                                    }
                                ]}
                                onPress={() => setPaymentMethod(payment_methods.CARD)}>
                                <Text style={styles.selector_text}>Tarjeta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.selector_button, 
                                    {
                                        backgroundColor: (paymentMethod==payment_methods.CASH) ? 
                                            colors.light_green_selected : colors.light_green
                                    }
                                ]}
                                onPress={() => setPaymentMethod(payment_methods.CASH)}>
                                <Text style={styles.selector_text}>Efectivo</Text>
                            </TouchableOpacity>
                        </View>

                        <DefaultButton onPress={() => handlePayment()} text={"Cancelar boletín"}/>
                    </View>
                </View>

            </View>
            

        </Modal>
    )
}


const styles = StyleSheet.create({

    bold_text: {
        fontWeight: "bold",
    },
    cancel_button: {
        color: colors.dark_green,
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1,
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
    },
    
    content_wrapper: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderWidth: 2,
        elevation: 20, // This adds a shadow on Android (elevation property)
        justifyContent: 'center',
        padding: 20,
        paddingTop: 40,
    },
    

    duration_picker_wraper: {
        alignItems: "center",
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: "100%",
    },
    info_text: {
        color: colors.dark_green,
    },
    label: {
        color: colors.dark_green,
        fontSize: 16,
        marginBottom: 0,
        marginTop: 18,
    },

    picker: {
        width: 280,
    },
    picker_item: {
        color: colors.dark_green,
    },

    price: {
        color: colors.dark_green,
        fontSize: 22,
        fontWeight: "bold",
    },
    
    selector: {
        alignItems: 'center',
        flexDirection: "row",
        marginBottom: 20,
        marginTop: 10
    },
    
    selector_button: {
        borderColor: colors.input_border,
        borderRadius: 20,
        borderWidth: 1,
        marginHorizontal: 6,
        paddingHorizontal: 20,
        paddingVertical: 10
    },

    selector_text: {
        color: colors.dark_green,
    },

    title: {
        color: colors.dark_green,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 0,
        marginTop: 18,
    },

    
})



