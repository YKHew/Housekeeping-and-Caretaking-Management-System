import React, { Component, useState, useEffect, useRef, useCallback } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert, FlatList
} from 'react-native';
import { useNavigation, validatePathConfig } from '@react-navigation/native';
import DropDownPicker from '@react-native-picker/picker';

import DateTimePicker from '@react-native-community/datetimepicker';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import moment, { max, weekdays } from 'moment';

//firebase
import { collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, query, where, QuerySnapshot } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//screen
//import CleaningScheduleScreen from "./cleaning/Schedule";
import { styles } from './styles/Booking';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BookingScreen = ({ route, selectedDateFromPrevious, navigation }) => {

    const staff = route.params; //selected staff 
    console.log('dateSelected')
    //console.log('staff', staff.workingHours);
    const uid = FIREBASE_AUTH.currentUser.uid;  //client uid

    const [addresses, setAddresses] = useState([]);
    //const [selectedAddress, setSelectedAddress] = (null);

    //get data by id
    getDoc(doc(FIRESTORE_DB, 'users', uid))
        .then(docData => {
            if (docData.exists()) {

            } else {

            }
        }).catch((error) => {
            console.log(error);
        });

    useEffect(() => {
        const fetchAddresses = async () => {
            getDoc(doc(FIRESTORE_DB, 'users', uid)).then(docData => {
                if (docData.exists()) {
                    const tagsArray = docData.data().addresses || [];
                    setAddresses(tagsArray);
                } else {
                    console.log('Address Document not found!');
                }
            }).catch((error) => {
                console.error('Error fetching document:', error);
            });
        };
        fetchAddresses();
    }, []);

    const progressStepsStyle = {
        activeStepIconBorderColor: '#0a75ad',
        activeLabelColor: 'black',
        activeStepNumColor: 'white',
        activeStepIconColor: '#0a75ad',
        completedStepIconColor: '#686868',
        completedProgressBarColor: '#686868',
        completedCheckColor: '#4bb543'
    };

    const buttonTextStyle = {
        color: '#686868',
        fontWeight: 'bold'
    };

    //----------------------------------------------------------Part 1 - Date/Time Selection----------------------------------------------------------
    const [datePicker, setDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [tasksAssigned, setTasksAssigned] = useState([]);

    //Get Data----------------------------------------------------------
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('DD-MM-YYYY'));
    const [selectedShift, setSelectedShift] = useState([]);

    const [totalPrice, setTotalPrice] = useState('');
    //----------------------------------------------------------

    //get the available working hours and shifts from the selected staff / provider
    const [availableWorkingHoursAndShifts, setAvailableWorkingHoursAndShifts] = useState([]);
    useEffect(() => {
        const fetchAvailable = () => {
            const availableArr = [];
            //const shifts = [];
            if (staff.workingHours) {
                //console.log('staffworking', staff.workingHours)
                staff.workingHours.forEach((day) => {
                    if (day.workDay) {
                        console.log('staffshifts', day.shifts)
                        availableArr.push({ day: day.day, shifts: day.shifts });
                        // day.shifts.map((shifts) => {

                        // })
                    }
                })
            }
            setAvailableWorkingHoursAndShifts(availableArr);
            //console.log('availableArr', availableArr);
        }
        fetchAvailable();
    }, []);

    const [filteredShifts, setFilteredShifts] = useState([]);
    useEffect(() => {
        const fetchSelectedDayShift = () => {
            //console.log('currentDate: ', selectedDate)
            const selectedDay = moment(selectedDate, 'DD-MM-YYYY').format('dddd');
            //console.log('currentDate: ', selectedDate, selectedDay)
            const filteredShifts = availableWorkingHoursAndShifts.find(
                (item) => item.day === selectedDay
            );
            if (filteredShifts) {
                //console.log('filteredShifts.shifts', filteredShifts.shifts.map((shift) => ({ day: selectedDay, ...shift })))
                setFilteredShifts(
                    filteredShifts.shifts.map((shift) => ({ day: selectedDay, ...shift }))
                );
            } else {
                setFilteredShifts([]); // No shifts found for the selected day
            }
        };
        fetchSelectedDayShift();
    }, [selectedDate]);

    //get the assigned tasks which is pending from the selected staff / provider
    const [assignedTasks, setAssignedTasks] = useState([]);
    useEffect(() => {
        const fetchAssignedTasks = async () => {
            const tasksArr = [];
            await getDocs(query(collection(FIRESTORE_DB, 'reservations'),
                where('provider', '==', staff.id), where('status', '==', 'Pending')
            )).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    tasksArr.push({ id: doc.id, ...doc.data() })
                })
            })
            setAssignedTasks(tasksArr);
            //console.log('assignedTasks', tasksArr);
        };
        fetchAssignedTasks();
    }, [])


    //To show the Date Picker
    const showDatePicker = () => {
        setDatePicker(true);
    };

    //Set selected Date into State
    const onDateSelected = (event, value) => {
        //console.log('value', value)
        setDate(value);
        const dateSelected = moment(value).format('DD-MM-YYYY');
        setSelectedDate(dateSelected);
        //console.log('date selected', dateSelected);
        //console.log('SelectedDate', selectedDate);
        setDatePicker(false);
    }

    const AvailableTimeShift = ({ shift }) => {
        console.log('item ', shift.day)
        //console.log('dday: ', moment(assigned.reserveDate, 'DD-MM-YYYY').format('dddd'))
        //console.log('shift: ', item.shifts)
        //const shift = item.shifts
        const selectedDateDay = moment(selectedDate, 'DD-MM-YYYY').format('dddd');
        //const assignedDateDay = moment(assigned.reserveDate, 'DD-MM-YYYY').format('dddd');
        //console.log('assignedTasks: ', assignedTasks.map.reserveDate)

        const reserveShiftsFromAssignedTasks = assignedTasks
            .filter((task) => task.reserveDate === selectedDate)
            .map((task) => task.reserveShift);

        console.log('reserveShiftsFromAssignedTasks', reserveShiftsFromAssignedTasks);

        if (selectedDateDay == shift.day) {
            if (reserveShiftsFromAssignedTasks.includes(shift.shift)) {
                return (
                    <View style={[styles.shifts, { backgroundColor: 'grey' }]}>
                        <Text>{shift.shift}</Text>
                        <View>
                            <Text>{shift.startTime} - {shift.endTime}</Text>
                        </View>
                    </View>
                )
            } else {
                if (shift.startTime != undefined && shift.endTime != undefined && shift.startTime != '' && shift.endTime != '') {
                    return (
                        <TouchableOpacity style={[styles.shifts, isIconSelected(shift) ? { backgroundColor: '#0a75ad' } : {}]}
                            onPress={() => handleShiftPress(shift)}
                        >
                            <Text>{shift.shift}</Text>
                            <View>
                                <Text>{shift.startTime} - {shift.endTime}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            }
        }
    }

    const [shift, setShift] = useState('');
    const handleShiftPress = (shift) => {
        setSelectedShift(shift);
        //console.log('selectedShift: ', shift)
        //console.log('selectedShift: ', shift.shift)
        setShift(shift.shift);
    }
    const isIconSelected = (shift) => selectedShift === shift;


    const pickerRef = useRef();
    function open() {
        pickerRef.current.focus();
    }
    function close() {
        pickerRef.current.blur();
    }

    //----------------------------------------------------------Part 2 - Address Selection----------------------------------------------------------

    //Get Data----------------------------------------------------------
    const [selectedAddress, setSelectedAddress] = useState('');
    //----------------------------------------------------------

    const AddressList = ({ address }) => {
        return (
            <TouchableOpacity
                style={[styles.addressList, isAddressSelected(address) ? { backgroundColor: '#0a75ad' } : {}]}
                onPress={() => handleAddressPress(address)}
            >
                <View style={styles.iconContainer}>
                    {
                        address.type == 'Home'
                            ? <Ionicons name="home-outline" size={24} color={isAddressSelected(address) ? 'white' : '#0a75ad'} />
                            : (
                                address.type == 'Work'
                                    ? <MaterialIcons name="work-outline" size={24} color={isAddressSelected(address) ? 'white' : '#0a75ad'} />
                                    : <Ionicons name="location-outline" size={24} color={isAddressSelected(address) ? 'white' : '#0a75ad'} />
                            )


                    }
                </View>
                <View style={styles.addressTextContainer}>
                    <Text style={[styles.addressTypeText, isAddressSelected(address) ? { color: 'white' } : {}]}>{address.type}</Text>
                    <Text style={[styles.addressText, isAddressSelected(address) ? { color: 'white' } : {}]}>{address.address}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const addAddress = () => {

    }

    const handleAddressPress = (address) => {
        setSelectedAddress(address.address);
        console.log(selectedAddress);
    }

    const isAddressSelected = (address) => selectedAddress === address.address;

    //----------------------------------------------------------Part 3 - Special Requect----------------------------------------------------------

    const [otherServices, setOtherServices] = useState([]);
    //Get Data----------------------------------------------------------
    const [extraRequest, setExtraRequest] = useState('')

    //----------------------------------------------------------

    const [selectedService, setSelectedService] = useState([]);
    useEffect(() => {
        const fetchServices = async () => {
            //const serviceArr = [];
            await getDoc(doc(FIRESTORE_DB, 'services', staff.category))
                .then((doc) => {
                    if (doc.exists()) {
                        const serviceArr = { id: doc.id, ...doc.data() } || [];
                        setSelectedService(serviceArr);
                        console.log('selectedService', serviceArr);
                    } else {
                        console.log('Document not found!');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching document:', error);
                });


        };
        fetchServices();
    }, []);


    useEffect(() => {
        const fetchOtherServices = async () => {
            getDoc(doc(FIRESTORE_DB, 'services', staff.category.toLowerCase())).then(docData => {
                if (docData.exists()) {
                    const otherServiceArray = docData.data().areas || [];
                    setOtherServices(otherServiceArray)
                } else {
                    console.log('Document not found!');
                }
            }).catch((error) => {
                console.error('Error fetching document:', error);
            });
        };
        fetchOtherServices();
    }, []);

    const SpecialRequestsList = ({ otherService }) => {
        return (
            <View>
                <TouchableOpacity style={styles.otherServiceList}>
                    <Text style={styles.otherServiceTitle}>{otherService.area}</Text>
                    <FlatList
                        style={styles.tasksList}
                        data={otherService.tasks}
                        renderItem={({ item }) => <TasksList tasks={item} />}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const TasksList = ({ tasks }) => {
        return (
            <Text>
                <Text>-</Text>
                <Text style={styles.otherServiceText}>{tasks}</Text>
            </Text>
        )
    }
    //----------------------------------------------------------Part 4 - Summary----------------------------------------------------------

    //---------------------------Add to Firebase 
    //save to reservation
    //address, client uid, provider uid, reservationid, reservationShift, reserveDate, reserveEndTime, reserveStartTime, service, specialRequest, status='

    const onSubmitSteps = async () => {
        console.log('Submit to Reservation Collection');
        try {

            if (selectedAddress != '' && shift != '' && selectedDate != '' && selectedShift != '') {
                //reservation
                const docRef = await addDoc(collection(FIRESTORE_DB, 'reservations'), {
                    address: selectedAddress,
                    client: uid,
                    provider: staff.id,
                    reservationID: '',
                    reserveShift: shift,   //selectedShift.shift
                    reserveDate: selectedDate,
                    reserveStartTime: selectedShift.startTime,
                    reserveEndTime: selectedShift.endTime,
                    service: selectedService.title,
                    specialRequest: extraRequest,
                    status: 'Pending',
                });

                //feedback, rate
                await updateDoc(docRef, {
                    reservationID: docRef.id
                });
                console.log("Reservation written with ID: ", docRef.id);

                //update the available in provider
                await getDoc(doc(FIRESTORE_DB, 'users', staff.id))
                    .then((docData) => {
                        if (docData.exists()) {
                            console.log('providerRef ', docData.data().workingHours);
                            const workingHours = docData.data().workingHours;

                            const dayObject = workingHours.find((workDay) => workDay.day === moment(selectedDate, 'DD-MM-YYYY').format('dddd'));
                            //console.log('dayObject, ', dayObject);

                            const shiftObject = dayObject.shifts.find((shift) => shift.shift === selectedShift.shift);
                            //console.log('shift: ', selectedShift.shift)
                            //console.log('shiftObject, ', shiftObject);

                            if (shiftObject) {
                                shiftObject.available = false;

                                updateDoc(doc(FIRESTORE_DB, 'users', staff.id), {
                                    workingHours: workingHours
                                });
                                //console.log('Document successfully updated');
                            }
                        }
                    })

                alert("Reservation successfully made!")
                navigation.replace('Home');
            } else {
                alert("Please complete all the selection.")
                navigation.replace('SelectServiceProviderScreen')
            }



        } catch (error) {
            console.error("Error adding document: ", error);
        }


    }


    const handleNextSection = () => {
        if (selectedAddress != '' || shift != '' || selectedDate != '' || selectedShift != '') {

        }
    }

    //----------------------------------------------------------Return View----------------------------------------------------------

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <ProgressSteps {...progressStepsStyle}>
                    <ProgressStep
                        label='Date & Time'
                        onNext={this.onNextStep}
                        onPrevious={this.onPrevStep}
                        scrollViewProps={this.defaultScrollViewProps}
                        nextBtnTextStyle={buttonTextStyle}
                        previousBtnTextStyle={buttonTextStyle}
                    >
                        <View style={styles.progressContent}>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Date</Text>
                                <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
                                    <Feather name="calendar" size={24} color="black" />
                                    <Text style={styles.sectionContent}>{moment(date).format('DD-MM-YYYY')}</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                datePicker && (
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
                                <FlatList
                                    data={filteredShifts}
                                    renderItem={({ item }) => <AvailableTimeShift shift={item} />}
                                    keyExtractor={(item) => item.shift}
                                />
                            </View>
                        </View>
                    </ProgressStep>

                    {/* ----------------------------------------------------------Part 2 - Address Selection---------------------------------------------------------- */}
                    <ProgressStep
                        label='Address'
                        onNext={this.onNextStep}
                        onPrevious={this.onPrevStep}
                        scrollViewProps={this.defaultScrollViewProps}
                        nextBtnTextStyle={buttonTextStyle}
                        previousBtnTextStyle={buttonTextStyle}
                    >
                        {/* <View>{SecondScreen()}</View> */}
                        <View style={styles.progressContent}>
                            <Text style={styles.sectionTitle}>Select Address</Text>
                            <View>
                                <View style={styles.sectionContainer}>
                                    <FlatList
                                        data={addresses}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => <AddressList address={item} />}
                                    />
                                </View>
                            </View>
                            {/* <TouchableOpacity onPress={addAddress}>
                                <Text>Add Address</Text>
                            </TouchableOpacity> */}
                        </View>
                    </ProgressStep>
                    {/* ----------------------------------------------------------Part 3 - Special Requirement---------------------------------------------------------- */}
                    <ProgressStep
                        label='Extra Options'
                        onNext={this.onNextStep}
                        onPrevious={this.onPrevStep}
                        scrollViewProps={this.defaultScrollViewProps}
                        nextBtnTextStyle={buttonTextStyle}
                        previousBtnTextStyle={buttonTextStyle}
                    >
                        <View style={styles.progressContent}>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>What's Included?</Text>
                                <Text>Our cleaning service includes:</Text>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.requireFlatList}
                                    data={otherServices}
                                    renderItem={({ item }) => <SpecialRequestsList otherService={item} />}
                                />
                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Any Special Request?</Text>
                                <TextInput
                                    style={styles.extraRequestInput}
                                    multiline={true}
                                    numberOfLines={5}
                                    placeholder='Extra Request'
                                    onChangeText={setExtraRequest}
                                    value={extraRequest}
                                />
                            </View>
                        </View>
                    </ProgressStep>
                    {/* ----------------------------------------------------------Part 4 - Summary---------------------------------------------------------- */}
                    <ProgressStep
                        label='Summary'
                        //onNext={onSubmitSteps}
                        onPrevious={this.onPrevStep}
                        scrollViewProps={this.defaultScrollViewProps}
                        nextBtnTextStyle={buttonTextStyle}
                        previousBtnTextStyle={buttonTextStyle}
                        removeBtnRow={true}
                    >
                        <View style={styles.progressContent}>

                            <View style={styles.summaryContainer}>
                                <View style={styles.confirmationHeader}>
                                    <Feather name="check-circle" size={50} color="#00e500" />
                                    <Text style={styles.confirmationHeaderText}>Confirmation</Text>
                                </View>
                                <View style={styles.servicesHeader}>
                                    <Text style={styles.servicesTimeHeaderText}>{selectedService.title} Services</Text>
                                </View>
                                <View style={styles.servicesConfirm}>

                                    <Text style={styles.servicesTimeText}>{moment(selectedDate, 'DD-MM-YYYY').format('dddd')}, {selectedDate}</Text>
                                    <Text style={styles.subText}>{shift} Session</Text>

                                    <View style={styles.servicesTimeContainer}>
                                        <View style={styles.servicesTime}>
                                            <Text style={styles.subText}>from</Text>
                                            <Text style={styles.servicesTimeText}>{selectedShift.startTime}</Text>
                                        </View>
                                        <View style={styles.servicesTime}>
                                            <Text style={styles.subText}>to</Text>
                                            <Text style={styles.servicesTimeText}>{selectedShift.endTime}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.clientConfirm}>
                                    <View>
                                        <View style={styles.client}>
                                            <Text style={styles.subText}>Address: </Text>
                                            <Text style={styles.clientText}>{selectedAddress}</Text>
                                        </View>
                                        <View style={styles.client}>
                                            <Text style={styles.subText}>Special Requirement: </Text>
                                            <Text style={styles.clientText}>{extraRequest}</Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.client}>
                                            <Text style={styles.subText}>Hourskeeper / Caretaker: </Text>
                                            <Text style={styles.clientText}>{staff.fName} {staff.lName}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.subText}>Contact Number:</Text>
                                            <Text style={styles.clientText}>{staff.contactNumber}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.btnContent}>
                                <TouchableOpacity style={styles.submitBtn} onPress={onSubmitSteps}>
                                    <Text style={styles.submitBtnText}>Submit</Text>
                                </TouchableOpacity>
                                {/* <Button title="Submit" onPress={onSubmitSteps} /> */}
                            </View>
                        </View>

                    </ProgressStep>
                </ProgressSteps>
            </View>
        </SafeAreaView>
    )
}

export default BookingScreen;