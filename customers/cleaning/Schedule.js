import React, { Component, useState, useRef, useCallback } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert, FlatList
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const CleaningScheduleScreen = () => {

    const [datePicker, setDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [time, setTime] = useState('');

    const [duration, setDuration] = useState([
        { label: '2 Hours', value: '2' },
        { label: '4 Hours', value: '4' },
        { label: '6 Hours', value: '6' },
        { label: '8 Hours', value: '8' },
    ]);
    const [durationOpen, setDurationOpen] = useState(false);
    const [durationValue, setDurationValue] = useState(null);

    const onDurationOpen = useCallback(() => {
        setDurationOpen(false);
    }, []);

    //To show the Date Picker
    const showDatePicker = () => {
        setDatePicker(true);
    };

    //Set selected Date into State
    const onDateSelected = (event, value) => {
        setDate(value);
        setDatePicker(false);
    }

    const AvailableTimeList = ({ time }) => {
        console.log({ time })
        return (
            <TouchableOpacity style={styles.times}>
                <Text style={styles.timeText}>{time}</Text>
            </TouchableOpacity>
        )
    }

    const pickerRef = useRef();
    function open() {
        pickerRef.current.focus();
    }
    function close() {
        pickerRef.current.blur();
    }

    return (
        <SafeAreaView>
            <View style={styles.progressContent}>
                <Text>Select Date & Time</Text>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Date</Text>
                    <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                        <Feather name="calendar" size={24} color="black" />
                        <Text style={styles.sectionContent}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                </View>
                {datePicker && (
                    <DateTimePicker
                        //isVisible={isDatePickerVisible}
                        mode='date'
                        display='calendar'
                        value={date}
                        onChange={onDateSelected}
                        minimumDate={new Date(Date.now())}
                    />
                )}
            </View>

            <View style={styles.progressContent}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Available Time Slot</Text>
                    <View style={styles.availableTimeList}>
                        <FlatList
                            numColumns={3}
                            data={staff.timeSlot}
                            renderItem={({ item }) => <AvailableTimeList time={item} />}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.progressContent}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Duration</Text>
                    
                </View>
            </View>
        </SafeAreaView>

    )
}

export default CleaningScheduleScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: '#F5FCFF',
        paddingHorizontal: 10,

    },
    sectionContainer: {
        flexDirection: 'column',
        margin: 10,
    },
    selectedService: {
        borderWidth: 1,
        borderColor: '#d2d2d2',
        borderRadius: 10,
        alignItems: 'center',
        padding: 5,
    },

    datePicker: {
        //flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderColor: "#d2d2d2",
        borderWidth: 1,
        borderRadius: 10,
    },


    availableTimeList: {
        alignItems: 'center',
    },
    times: {
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 35,
        paddingVertical: 5,
        margin: 5,
    },
    

    //Font Size
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContent: {
        width: '100%',
        fontSize: 18,
    },
    sectionBtn: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    
    timeText: {
        fontSize: 16,
    },

})