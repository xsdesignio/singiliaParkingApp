/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {obtainSchedule} from "../../schedule/sheduleController"
import { colors } from '../../styles/colorPalette';


export default function FormDate({ setDate, daysActive = true }) {
    let now = new Date(Date.now());
    
    // Date Management needed Hooks
    const [weekSchedule, setWeekSchedule] = useState({});
    const [dailySchedule, setDailySchedule] = useState({});
    const [selectedDay, setSelectedDay] = useState();
    const [availableDays, setAvailableDays] = useState([]);

    const [hours, setHours] = useState(now.getHours().toString().padStart(2, "0"));
    const [minutes, setMinutes] = useState(now.getMinutes().toString().padStart(2, "0"));

    const [inputHours, setInputHours] = useState("");
    const [inputMinutes, setInputMinutes] = useState("");

    useEffect(() => {
        handleTimeChange()
    }, [inputHours, inputMinutes])

    function handleTimeChange() {

        let currentDate = new Date()
        // If selectedDay is set, update currentDate's date
        if (selectedDay) {
            currentDate.setDate(selectedDay);
        }

        // If inputHours is empty, use current hours, else use inputHours
        let hour = inputHours ? parseInt(inputHours) : currentDate.getHours();
        
        // If inputMinutes is empty, use current minutes, else use inputMinutes
        let minute = inputMinutes ? parseInt(inputMinutes) : currentDate.getMinutes();

        currentDate.setHours(hour, minute)

        let stringDate = currentDate.toLocaleString('es-ES').replace(",", "")
        const [day, month, yearTime] = stringDate.split('/');
        let [year, time] = yearTime.split(' ');
        
        // Update the date using setDate function
        setDate(`${year}-${month}-${day} ${time}`);
    }

    setInterval(() => {
        now = new Date(Date.now())
        setHours(now.getHours().toString().padStart(2, "0"))
        setMinutes(now.getMinutes().toString().padStart(2, "0"))

    }, 30000)

    useEffect(() => {
        if(selectedDay == null)
            setSelectedDay(now.getDate())
        obtainSchedule().then(schedule => {
            if (schedule) {
                setWeekSchedule(schedule);
                if(selectedDay){
                    const date = (new Date(Date.now()))
                    date.setDate(selectedDay)
                    setDailyScheduleBasedOnSchedule(schedule, date);
                } else setDailyScheduleBasedOnSchedule(schedule);
                obtainAvailableDays(schedule)
            }
        });
    }, []);

    function setDailyScheduleBasedOnSchedule(schedule, now = new Date(Date.now())) {
        let weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        let weekDayIndex = now.getDay();
        setDailySchedule(schedule[weekDays[weekDayIndex]]);

    }

    function obtainAvailableDays(schedule) {
        let now = new Date(Date.now())

        let weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        let days = [now.getDate()];
        let weekDayIndex = now.getDay();

        let counter = 0;
        const DAYS_IN_WEEK = 7;

        for (let i = 0; i < 1;) {
            weekDayIndex = (weekDayIndex + 1) % DAYS_IN_WEEK;
            let nextDay = new Date(now);
            nextDay.setDate(now.getDate() + (++counter));
            if (schedule[weekDays[weekDayIndex]] != null) {
                days.push(nextDay.getDate());
                i++
            }
        }
        setAvailableDays(days);
    }

    function handleHourInput() {
        let hour = inputHours
        if(hour.length == 0) {
            setInputHours("");
            return;
        }
        hour = parseInt(hour);
        if (hour < 0 || hour > 23) hour = 0;
        if (!dailySchedule) {
            setInputHours(hour.toString().padStart(2, "0"));
            return;
        }

        if(dailySchedule.openTime){
            
            let openHour = parseInt(dailySchedule.openTime.slice(0, 2))
            
            if (hour < openHour) {
                hour = openHour;
            }
        }
        if(dailySchedule.closeTime){
            
            let closeHour = parseInt(dailySchedule.closeTime.slice(0, 2))
            let closeMinutes = parseInt(dailySchedule.closeTime.slice(3, 4))
            
            if(hour == closeHour) {
                if(closeMinutes < 1)
                    hour = closeHour-1;
            }
            else if (hour > closeHour ) {
                if(closeMinutes > 0)
                    hour = closeHour;
                else hour = closeHour-1;
            }
        }
        setInputHours(hour.toString().padStart(2, "0"));
    }

    function handleMinuteInput() {
        let minute = inputMinutes

        if(minute.length == 0) {
            setInputHours("");
            return;
        }

        minute = parseInt(minute);

        let max = 59 // as minute 60 should return to value 00

        if (minute < 0) minute = 0;
        if (minute > max) minute = max;
        setInputMinutes(minute.toString().padStart(2, "0"));
    }


    return (
        <View style={styles.date_wrapper}>
            {daysActive ? (
                <View style={styles.day_wrapper}>
                    <Text style={styles.date_label}>Día</Text>
                    <View style={styles.date_picker_wraper}>
                        <Picker
                            style={styles.date_picker}
                            selectedValue={selectedDay}
                            onValueChange={(itemValue) => {
                                setSelectedDay(itemValue);
                                let date = new Date(Date.now())
                                if(itemValue == date.getDate())
                                    setDailyScheduleBasedOnSchedule(weekSchedule)
                                else {
                                    if(date.getDate() > itemValue)
                                        date.setMonth(date.getMonth()+1)
                                    date.setDate(itemValue)
                                    setDailyScheduleBasedOnSchedule(weekSchedule, date)
                                }
                            }}
                            itemStyle={styles.date_picker_item}
                        >
                            {availableDays.length > 0 ? availableDays.map((value) => (
                                <Picker.Item
                                    key={value}
                                    label={`${value}`}
                                    value={value}
                                />
                            )) : null}
                        </Picker>
                    </View>
                </View>
            ) : null}

            <Text style={styles.date_label}>Hora</Text>
            <TextInput
                style={styles.date_text_input}
                placeholder={hours.toString()}
                value={inputHours.toString()}
                onChangeText={(hour) => {
                    setInputHours(hour)
                }}
                onEndEditing={() => {
                    handleHourInput()
                }}
                maxLength={2}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.date_text_input}
                placeholder={minutes.toString()}
                value={inputMinutes.toString()}
                onChangeText={(minute) => {
                    setInputMinutes(minute)
                }}

                onEndEditing={() => {
                    handleMinuteInput()
                }}
                maxLength={2}
                keyboardType="numeric"
            />

        </View>
    );
}


const styles = StyleSheet.create({
    date_label: {
        color: colors.dark_green,
        fontSize: 14,
    },
    date_picker: {
        color: colors.dark_green,
        margin: 0,
        padding: 0,
        width: "100%",
    },
    date_picker_item: {
        color: colors.dark_green,
        fontSize: 16,
    },
    date_picker_wraper: {
        alignItems: "center",
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        color: colors.dark_green,
        height: 40,
        justifyContent: "center",
        padding: 0,
        width: 110,
    },
    date_text_input: {
        backgroundColor: colors.white,
        borderColor: colors.input_border,
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: 10,
        padding: 4,
        width: 40,
    },
    date_wrapper: {
        alignItems: 'center',
        backgroundColor: colors.light_bg,
        borderRadius: 5,
        flexDirection: "row",
        marginTop: 28,
        padding: 10
    },
    day_wrapper: {
        alignItems: 'center',
        flexDirection: "row",
        gap: 10,
        marginRight: 20
    }
});
