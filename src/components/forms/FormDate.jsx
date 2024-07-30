/* eslint-disable react/prop-types */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {obtainSchedule} from "../../schedule/sheduleController"
import { colors } from '../../styles/colorPalette';


const FormDate = forwardRef(({ setDate, daysActive = true }, ref) => {
    
    let now = new Date(Date.now());
    
    // Date Management needed Hooks
    const [weekSchedule, setWeekSchedule] = useState({});
    const [dailySchedule, setDailySchedule] = useState({});

    const [selectedDay, setSelectedDay] = useState();
    const [availableDays, setAvailableDays] = useState([]);
    const [availableDaysOpenSpans, setAvailableDaysOpenSpans] = useState([]);

    // Contains the current time (Updated throw an interval)
    const [hours, setHours] = useState(now.getHours().toString().padStart(2, "0"));
    const [minutes, setMinutes] = useState(now.getMinutes().toString().padStart(2, "0"));

    // Values obtained from input
    const [inputHours, setInputHours] = useState("");
    const [inputMinutes, setInputMinutes] = useState("");

    // Default times for bulletins - 2 elements
    const [defaultTimes, setDefaultTimes] = useState([]);

    // Expose resetTimeInputs function to the parent component
    useImperativeHandle(ref, () => ({
        resetTimeInputs,
    }));
    
    // Effect hook to handle time changes
    useEffect(() => {
        handleTimeChange()
    }, [inputHours, inputMinutes])

    

    // Function to handle time change and update the date
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
    

    useEffect(() => {
        setTimesFromCurrentTime();
        const interval = setInterval(() => {
            setTimesFromCurrentTime();
        }, 30000);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    function setTimesFromCurrentTime() {
        now = new Date(Date.now())
        currentHours = now.getHours()
        currentMinutes = now.getMinutes()
        setHours(currentHours.toString().padStart(2, "0"))
        setMinutes(currentMinutes.toString().padStart(2, "0"))

        // id daysActive is true, the code below is not needed
        if(daysActive) return;

        let default_times = []
        if(currentMinutes > 30) {
            default_times.push(`${currentHours.toString().padStart(2, "0")}:00`)
            default_times.push(`${currentHours.toString().padStart(2, "0")}:30`)
        } else {
            default_times.push(`${(currentHours-1).toString().padStart(2, "0")}:30`)
            default_times.push(`${currentHours.toString().padStart(2, "0")}:00`)
        }

        setDefaultTimes(default_times)
    }

    // Effect hook to initialize schedule and available days
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

    // Function to set daily schedule based on selected day
    function setDailyScheduleBasedOnSchedule(schedule, current_time = new Date(Date.now())) {
        let weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        let weekDayIndex = current_time.getDay();
        setDailySchedule(schedule[weekDays[weekDayIndex]]);

    }

    // Function to obtain available days from the schedule
    function obtainAvailableDays(schedule) {
        let now = new Date(Date.now())

        let weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        let days = [now.getDate()];
        let weekDayIndex = now.getDay();
        let daysOpenSpans = [schedule[weekDays[weekDayIndex]]["openSpans"]]

        let counter = 0;
        const DAYS_IN_WEEK = 7;

        days_amount = 1

        for (let i = 0; i < days_amount;) {
            weekDayIndex = (weekDayIndex + 1) % DAYS_IN_WEEK;
            let nextDay = new Date(now);
            nextDay.setDate(now.getDate() + (++counter));
            if (schedule[weekDays[weekDayIndex]] != null) {
                days.push(nextDay.getDate());
                daysOpenSpans.push(schedule[weekDays[weekDayIndex]]["openSpans"])
                i++;
            }
        }
        setAvailableDays(days);
        setAvailableDaysOpenSpans(daysOpenSpans);
    }

    // Function to hour minute input validation
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

    // Function to handle minute input validation
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

    // Function to handle day selection
    function handleDayInput(selected_day) {
        // {"openSpans": [
            // {"closeTime": "14:00", "openTime": "09:00"}, 
            // {"closeTime": "21:00", "openTime": "16:00"}
        // ]}


        let i = 0;
        availableDays.forEach(available_day => {
            if(available_day == selected_day)
                setSelectedDay(selected_day);

                // Set time from next day aperture time
                openSpan = availableDaysOpenSpans[i][0]
                openTime = openSpan["openTime"].split(":")
                openTimeHours = openTime[0]
                openTimeMinutes = openTime[1]

                today_day =  (new Date(Date.now())).getDate()
                if(selected_day == today_day) {
                    setInputHours("")
                    setInputMinutes("")
                }else {
                    setInputHours(openTimeHours)
                    setInputMinutes(openTimeMinutes)
                }
            i++;
        });
        setSelectedDay(selected_day);
        let date = new Date(Date.now())
        if(selected_day == date.getDate())
            setDailyScheduleBasedOnSchedule(weekSchedule)
        else {
            if(date.getDate() > selected_day)
                date.setMonth(date.getMonth()+1)
            date.setDate(selected_day)
            setDailyScheduleBasedOnSchedule(weekSchedule, date)
        }

    }

    function handleDefaultTimesPress(newTime) {
        newHour = newTime.split(":")[0]
        newMinutes = newTime.split(":")[1]
        setInputHours(newHour)
        setInputMinutes(newMinutes)
    }

    function resetTimeInputs() {
        setInputHours("")
        setInputMinutes("")
    }



    return (
        <View style={styles.wrapper}>
            { !daysActive ? (
                <View style={styles.default_times}>
                    { 
                        inputHours && inputHours.length > 0
                        || inputMinutes && inputMinutes.length > 0
                    
                    ? (
                        <TouchableOpacity style={styles.reset_time_button} onPress={() =>{resetTimeInputs()}}>
                            <Text style={styles.default_time_reset}>
                                Resetear
                            </Text>
                        </TouchableOpacity>
                    ) : null }
                    <TouchableOpacity style={styles.default_time_button} onPress={() =>{handleDefaultTimesPress(defaultTimes[0])}}>
                        <Text style={styles.default_time_button_text}>
                            {defaultTimes[0]}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.default_time_button} onPress={() =>{handleDefaultTimesPress(defaultTimes[1])}}>
                        <Text style={styles.default_time_button_text}>
                            {defaultTimes[1]}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null }
            <View style={styles.date_wrapper}>
                {daysActive ? (
                    <View style={styles.day_wrapper}>
                        <Text style={styles.date_label}>Día</Text>
                        <View style={styles.date_picker_wraper}>
                            <Picker
                                style={styles.date_picker}
                                selectedValue={selectedDay}
                                onValueChange={(itemValue) => {
                                    handleDayInput(itemValue)
                                }}
                                itemStyle={styles.date_picker_item}
                            >
                                {availableDays.length > 0 ? availableDays.map((value) => (
                                    <Picker.Item
                                        key={value}
                                        label={`${value}`}
                                        value={value}
                                    />
                                )) : <Picker.Item
                                    key={selectedDay}
                                    label={`${selectedDay}`}
                                    value={selectedDay}
                                />}
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
        </View>
        
    );
})


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
        padding: 10
    },
    day_wrapper: {
        alignItems: 'center',
        flexDirection: "row",
        gap: 10,
        marginRight: 20
    },
    default_times: {
        alignItems: 'center',
        flexDirection: "row",
        margin: 0,
        width: "100%",
        marginBottom: 2,
        gap: 2
    },
    default_time_button: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 4,
        padding: 10
    },
    default_time_button_text: {
        fontSize: 16
    },
    reset_time_button: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: colors.white,
        borderColor: colors.light_green,
        borderRadius: 4,
        padding: 10
    },
    wrapper: {
        marginTop: 28,
        gap: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        paddingHorizontal: 40
    }
});



export default FormDate