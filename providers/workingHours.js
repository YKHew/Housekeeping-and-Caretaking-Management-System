import React, { Component, useState, useEffect, startTransition } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    FlatList, StatusBar,
    Pressable, TouchableOpacity, RefreshControl,
    TextInput, Switch, Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { styles } from './styles/WorkingHours';

//Firebase
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Users from '../src/constants/users';

const WorkingHoursScreen = ({ navigation }) => {
    const uid = FIREBASE_AUTH.currentUser.uid;
    const [workingHours, setWorkingHours] = useState([]);

    //get data by id
    useEffect(() => {
        fetchWorkingHours();
    }, []);

    const fetchWorkingHours = async () => {
        getDoc(doc(FIRESTORE_DB, 'users', uid)).then(docData => {
            if (docData.exists()) {
                const workingHoursArr = docData.data().workingHours || [];
                setWorkingHours(workingHoursArr);
                //console.log('Working Hours: ', workingHoursArr)

                workingHoursArr.forEach(dayData => {

                    if (dayData.shifts) {
                        dayData.shifts.forEach(shift => {

                        })
                    }
                })

            } else {
                console.log('Document not found!');
            }
        }).catch((error) => {
            console.error('Error fetching document:', error);
        });
    };

    const workDayOnPress = async (day) => {
        console.log(day)
        try {
            const updatedWorkDay = workingHours.map(item => {
                if (item.day === day) {
                    item.workDay = !item.workDay;
                }
                return item;
            });

            await updateDoc(doc(FIRESTORE_DB, 'users', uid), {
                workingHours: updatedWorkDay
            });

            setWorkingHours(updatedWorkDay);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }

    //update the time
    const [selectedShift, setSelectedShift] = useState(null);
    const [selectedShiftDay, setSelectedShiftDay] = useState('');

    const [getStartTime, setGetStartTime] = useState('');

    const [startTimePicker, setStartTimePicker] = useState(false);
    const [endTimePicker, setEndTimePicker] = useState(false);

    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleTimeSelected = (event, selectedTime) => {
        if (event.type === 'set' && selectedTime !== undefined) {
            const updatedWorkingHours = [...workingHours];

            const dayToUpdate = updatedWorkingHours.find((day) => day.day === selectedShiftDay);
            const shiftToUpdate = dayToUpdate.shifts.find((shift) => shift === selectedShift);

            if (shiftToUpdate) {
                if (startTimePicker) {
                    shiftToUpdate.startTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (endTimePicker) {
                    shiftToUpdate.endTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                // Update Firestore with the new data
                updateShiftTime(updatedWorkingHours);
                Alert.alert('Success', 'Time updated successfully!', [{ text: 'OK' }]);
            }
        }
        setStartTimePicker(false);
        setEndTimePicker(false);
    };

    const updateShiftTime = async (updatedTime) => {
        try {
            await updateDoc(doc(FIRESTORE_DB, 'users', uid), {
                workingHours: updatedTime
            });

            setWorkingHours(updatedTime);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }

    //pull to refresh
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = () => {
        // Simulate a reload action with a timeout
        fetchWorkingHours();
        setTimeout(() => {
            // After the reload is complete, set refreshing to false
            setRefreshing(false);
        }, 2000); // You can replace this with your actual reload logic
    };


    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />}
            onScroll={(e) => {
                // Example: Detect scrolling and trigger refresh when scrolled to the top
                const scrollY = e.nativeEvent.contentOffset.y;
                if (scrollY <= 0) {
                    setRefreshing(true);
                    handleRefresh();
                }
            }}
        >
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={workingHours}
                    renderItem={({ item }) => (
                        <View style={styles.listContainer}>
                            <View style={styles.topContainer}>
                                <Switch
                                    trackColor={{ false: '#767577', true: 'white' }}
                                    thumbColor={item.workDay ? '#0a75ad' : '#f4f3f4'}
                                    //ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => workDayOnPress(item.day)}
                                    value={item.workDay}
                                />
                                <Text style={styles.topText}>{item.day}</Text>

                            </View>

                            {
                                item.shifts.map((shift) => (
                                    <View key={shift.shift} style={styles.timeContainer}>
                                        <Text style={styles.shiftText}>{shift.shift}</Text>
                                        <TouchableOpacity style={styles.timeTextContainer}
                                            onPress={() => [
                                                setSelectedShiftDay(item.day),
                                                setSelectedShift(shift),
                                                setStartTimePicker(true)
                                            ]}
                                        >
                                            <Text style={styles.timeText}>{shift.startTime !== '' ? shift.startTime : 'Set Time'}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.timeTextContainer}
                                            onPress={() => [
                                                setSelectedShiftDay(item.day),
                                                setSelectedShift(shift),
                                                setEndTimePicker(true)
                                            ]}
                                        >
                                            <Text style={styles.timeText}>{shift.endTime !== '' ? shift.endTime : 'Set Time'}</Text>
                                        </TouchableOpacity>

                                        {
                                            startTimePicker && (
                                                <DateTimePicker
                                                    //isVisible={isDatePickerVisible}
                                                    mode='time'
                                                    display='spinner'
                                                    value={new Date()}
                                                    onChange={(event, selectedTime) => handleTimeSelected(event, selectedTime)}
                                                />
                                            )
                                        }

                                        {
                                            endTimePicker && (
                                                <DateTimePicker
                                                    //isVisible={isDatePickerVisible}
                                                    mode='time'
                                                    display='spinner'
                                                    value={new Date()}
                                                    onChange={(event, selectedTime) => handleTimeSelected(event, selectedTime)}
                                                />
                                            )
                                        }

                                    </View>


                                ))
                            }
                        </View>


                    )}
                />


            </SafeAreaView>

        </ScrollView>
    )
}

export default WorkingHoursScreen;

