import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SearchBar } from '@rneui/themed';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import { styles } from './styles/SelectServiceProvider';

//import DateTimePicker from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

//Firebase
import { collection, doc, getDoc, getDocs, query, where, get, documentId } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

import Staffs from '../src/constants/staffs';

//screen
import HorizontalCalender from '../components/Calendar/HorizontalCalendar';
import FILTER from '../src/constants/filter';
//import CleaningScheduleScreen from "./cleaning/Schedule";
import BabySittingScheduleScreen from "./babySitting/Schedule";

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from '@rneui/base';
import moment, { weekdays } from 'moment';


const SelectServiceProviderScreen = ({ route, navigation }) => {

    const selectedService = route.params;
    //console.log('selected service: ', selectedService.id);
    const currentDate = moment(new Date()).format('DD-MM-YYYY');
    const currentDay = weekdays(new Date().getDay());

    //Selected Date from Horizontal Calendar
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    const dateSelected = moment(new Date(selectedDate)).format('DD-MM-YYYY')
    console.log('deteSelected123: ', dateSelected)
    const daySelected = moment(new Date(selectedDate)).format('dddd')

    const [providers, setProviders] = useState([]);
    const [availableProviders, setAvailableProviders] = useState([]);
    const [shiftsForDaySelected, setShiftsForDaySelected] = useState([]);

    // get all provide who related to the selected service
    useEffect(() => {
        const fetchProviders = async () => {
            getDocs(query(collection(FIRESTORE_DB, 'users'), where('role', '==', 'Provider'), where('category', '==', selectedService.id)))
                .then((querySnapshot) => {
                    const providersArr = [];
                    querySnapshot.forEach((doc) => {
                        providersArr.push({ id: doc.id, ...doc.data() });
                        console.log('Providers: ', doc.data());

                        // get all the providers who are available on selected date(day)
                        const providersAvailableOnSelectedDate = [];
                        providersArr.forEach(provider => {
                            //get workingHours
                            const workingHours = provider.workingHours;
                            console.log('WorkingHours: ', workingHours)

                            console.log('day selected: ', daySelected)
                            //get provider who workDay true and working day is same as selected day
                            const isAvailableSelectedDate = workingHours.some(days => days.day === daySelected && days.workDay == true);
                            if (isAvailableSelectedDate) {
                                console.log('Available: ', provider)
                                providersAvailableOnSelectedDate.push(provider)
                            }
                        });
                        setAvailableProviders(providersAvailableOnSelectedDate);
                    });

                    //sort the providers alphabetically by first name
                    providersArr.sort((a, b) => a.fName.localeCompare(b.fName));

                    setProviders(providersArr);

                    //console.log('Test: ', providersArr);
                })
        };
        fetchProviders();
    }, [daySelected]);

    const [filteredShifts, setFilteredShifts] = useState([]);

    //get the assigned tasks which is pending from the selected staff / provider
    const [assignedTasks, setAssignedTasks] = useState([]);
    useEffect(() => {
        const fetchAssignedTasks = async () => {
            const tasksArr = [];
            await getDocs(query(collection(FIRESTORE_DB, 'reservations'),
                where('status', '==', 'Pending'), where('reserveDate', '==', dateSelected)
            )).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    tasksArr.push({ id: doc.id, ...doc.data() })
                    console.log('reserveDate: ', doc.data().reserveDate);
                })
            })
            setAssignedTasks(tasksArr);
            //console.log('assignedTasks', tasksArr);
        };
        fetchAssignedTasks();
    }, [dateSelected])

    // console.log('daySelected: ', daySelected)
    // if (selectedDayWorkingHours == undefined) {
    // }
    // console.log('testing: ', selectedDayWorkingHours)

    const [availableShifts, setAvailableShifts] = useState([]);

    const ProviderList = ({ provider }) => {
        const workingHoursArr = provider.workingHours || [];
        const selectedDayWorkingHours = workingHoursArr.find(day => day.day === daySelected);

        const availableShiftsArr = [];
        assignedTasks.forEach(tasks => {
            if (tasks.provider == provider.id) {

                availableShiftsArr.push(tasks.reserveShift);
            }
        })

        return (
            <View style={{}}>
                {
                    selectedDayWorkingHours != undefined
                        ? (
                            <>
                                {
                                    provider.category == selectedService.id
                                        ? (
                                            <TouchableOpacity style={styles.staffListContainer}
                                                onPress={() => {
                                                    navigation.navigate('StaffInfoScreen', {
                                                        screen: 'StaffInfoScreen',
                                                        params: provider
                                                    })
                                                }}>
                                                <Image source={{ uri: provider.profileImage }} style={styles.staffImg} />
                                                {/* <Image source={{uri: item.imgUrl}} style={{height: 70, width: 70, marginRight: 10,}} /> */}
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{provider.fName} {provider.lName}</Text>
                                                        <Text style={{ fontSize: 16 }}>{selectedService.title}</Text>
                                                    </View>
                                                    <View style={styles.staffInfoContainer}>
                                                        <View style={[styles.staffInfo]}>
                                                            <Text style={styles.staffInfoText}>Job</Text>
                                                            <Text style={styles.staffInfoText}>{provider.workedHours} hrs</Text>
                                                        </View>

                                                        <View style={styles.staffInfo}>
                                                            <Text style={styles.staffInfoText}>Rating</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={styles.staffInfoText}>{provider.rate}</Text>
                                                                <Ionicons name="ios-star-sharp" size={16} color="#ffd700" />
                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{}}>
                                                    {
                                                        selectedDayWorkingHours != undefined
                                                            ? (
                                                                <FlatList
                                                                    data={selectedDayWorkingHours.shifts}
                                                                    renderItem={({ item }) => (
                                                                        <View style={styles.listContainer}>
                                                                            {
                                                                                availableShiftsArr.includes(item.shift)
                                                                                    ? (
                                                                                        <View style={[styles.timeSlotList, { backgroundColor: '#c0c0c0' }]}>
                                                                                            <Text>{item.shift}</Text>
                                                                                        </View>

                                                                                    ) : (
                                                                                        <>
                                                                                            {
                                                                                                item.startTime == undefined || item.endTime == undefined || item.startTime == '' || item.endTime == ''
                                                                                                    ? (
                                                                                                        <View style={[styles.timeSlotList, { backgroundColor: '#c0c0c0' }]}>
                                                                                                            <Text>{item.shift}</Text>
                                                                                                        </View>
                                                                                                    ) : (
                                                                                                        <View style={styles.timeSlotList}>
                                                                                                            <Text>{item.shift}</Text>
                                                                                                        </View>
                                                                                                    )
                                                                                            }
                                                                                        </>


                                                                                    )
                                                                            }

                                                                        </View>

                                                                    )}
                                                                />
                                                            ) : (
                                                                <>
                                                                </>
                                                            )
                                                    }

                                                </View>

                                            </TouchableOpacity>
                                        ) : (
                                            //Else
                                            <Text>Records not found</Text>
                                        )
                                }
                            </>
                        ) : (
                            <Text>No Available Housekeeper & Caretaker right now</Text>
                        )
                }


            </View >
        )

    }

    // const AvailableTimeSlot = ({staff}) => {

    // }

    //filterPopUp
    const [modalVisible, setModalVisible] = useState(false);

    //filter
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState();
    const [selectedRate, setSelectedRate] = useState('');
    const [selectedNationality, setSelectedNationality] = useState();
    const [selectedReligion, setSelectedReligion] = useState();
    const [selectedSpokenLanguage, setSelectedSpokenLanguage] = useState();

    const Rating = ({ rate }) => {
        return (
            <View style={styles.modelBtnContainer}>
                <Pressable
                    style={[
                        rate === selectedRate ? styles.modalBtnSelectionActive : styles.modalBtnSelection,
                        { flexDirection: 'row' }]}
                    onPress={() => setSelectedRate(rate)}
                >
                    <Text style={rate === selectedRate ? styles.modalBtnTextSelectionActive : styles.modalBtnTextSelection}>{rate}</Text>
                    <Ionicons name="ios-star-sharp" size={16} color="#ffd700" />
                </Pressable>
            </View>
        )
    }

    const TimeSlot = ({ timeSlot }) => {
        return (
            <View style={styles.modelBtnContainer}>
                <Pressable
                    style={[timeSlot === selectedTimeSlot ? styles.modalBtnSelectionActive : styles.modalBtnSelection]}
                    onPress={() => setSelectedTimeSlot(timeSlot)}
                >
                    <Text style={timeSlot === selectedTimeSlot ? styles.modalBtnTextSelectionActive : styles.modalBtnTextSelection}>{timeSlot}</Text>
                </Pressable>
            </View>
        )
    }

    const Nationality = ({ nationality }) => {
        return (
            <View style={styles.modelBtnContainer}>
                <Pressable
                    style={[nationality === selectedNationality ? styles.modalBtnSelectionActive : styles.modalBtnSelection]}
                    onPress={() => setSelectedNationality(nationality)}
                >
                    <Text style={nationality === selectedNationality ? styles.modalBtnTextSelectionActive : styles.modalBtnTextSelection}>{nationality}</Text>
                </Pressable>
            </View>
        )
    }

    const Religion = ({ religion }) => {
        return (
            <View style={styles.modelBtnContainer}>
                <Pressable
                    style={[religion === selectedReligion ? styles.modalBtnSelectionActive : styles.modalBtnSelection]}
                    onPress={() => setSelectedReligion(religion)}
                >
                    <Text style={religion === selectedReligion ? styles.modalBtnTextSelectionActive : styles.modalBtnTextSelection}>{religion}</Text>
                </Pressable>
            </View>
        )
    }

    const SpokenLanguage = ({ language }) => {
        return (
            <View style={styles.modelBtnContainer}>
                <Pressable
                    style={[language === selectedSpokenLanguage ? styles.modalBtnSelectionActive : styles.modalBtnSelection]}
                    onPress={() => setSelectedSpokenLanguage(language)}
                >
                    <Text style={language === selectedSpokenLanguage ? styles.modalBtnTextSelectionActive : styles.modalBtnTextSelection}>{language}</Text>
                </Pressable>
            </View>
        )
    }

    const FilterSubmitted = () => {
        console.log(selectedPriceRange);
        console.log(selectedRate);
        console.log(selectedTimeSlot);
    }


    //console.log('Current Date: ', selectedDate)

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5,
                }}>
                    <HorizontalCalender onSelectDate={setSelectedDate} selected={selectedDate} />
                </View>

                <View style={styles.filterContainer}>
                    <View style={styles.currentDateDay}>
                        <Text style={styles.currentDateDayText}>{daySelected}</Text>
                        <Text style={styles.currentDateDayText}>{dateSelected}</Text>
                    </View>

                    <TouchableOpacity style={{}} onPress={() => setModalVisible(true)}>
                        <Ionicons name="filter" size={30} color="black"
                            style={styles.filterIcon}
                        //onPress={{}}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{}}>
                    <FlatList
                        style={styles.searchedList}
                        data={availableProviders}
                        //keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <ProviderList provider={item} />}
                    />
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        {/* <View style={styles.modalView}> */}
                        <Text style={styles.modalTitle}>Filter</Text>

                        <View style={styles.modalContent}>
                            <Text style={styles.modalContentTitle}>Rate</Text>
                            <FlatList
                                numColumns={3}
                                data={FILTER.rating}
                                keyExtractor={(item, index) => index.toString()}
                                //ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item }) => <Rating rate={item} />}
                            />
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.modalContentTitle}>Time Slot</Text>
                            <FlatList
                                numColumns={3}
                                data={FILTER.timeSlot}
                                keyExtractor={(item, index) => index.toString()}
                                //ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item }) => <TimeSlot timeSlot={item} />}
                            />
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.modalContentTitle}>Nationality</Text>
                            <FlatList
                                numColumns={3}
                                data={FILTER.nationality}
                                keyExtractor={(item, index) => index.toString()}
                                //ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item }) => <Nationality nationality={item} />}
                            />
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.modalContentTitle}>Religion</Text>
                            <FlatList
                                numColumns={3}
                                data={FILTER.religion}
                                keyExtractor={(item, index) => index.toString()}
                                //ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item }) => <Religion religion={item} />}
                            />
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.modalContentTitle}>Spoken Language</Text>
                            <FlatList
                                numColumns={3}
                                data={FILTER.spokenLanguage}
                                keyExtractor={(item, index) => index.toString()}
                                //ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item }) => <SpokenLanguage language={item} />}
                            />
                        </View>

                        {/* <View style={styles.modalContent}>
                            <Text style={styles.modalContentTitle}>Price</Text>
                            <View style={styles.modalPrice}>
                                <Text>Price within <Text style={{ fontWeight: 'bold' }}>RM {selectedPriceRange}</Text> per hour</Text>
                                <Slider
                                    value={selectedPriceRange}
                                    minimumValue={1}
                                    maximumValue={100}
                                    onValueChange={(filterPrice) => setSelectedPriceRange(parseInt(filterPrice))}
                                    style={{ width: 300, height: 40 }}
                                />

                            </View>
                        </View> */}

                        <View style={styles.modalBottomBtn}>
                            <Pressable
                                style={styles.bottomBtn}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.btnText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={styles.bottomBtn}
                                onPress={() => { FilterSubmitted(); setModalVisible(!modalVisible); }}
                            >
                                <Text style={styles.btnText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>


                </Modal>

            </ScrollView>
        </SafeAreaView >
    )
}

export default SelectServiceProviderScreen;