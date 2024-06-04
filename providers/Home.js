import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert, FlatList,
} from 'react-native';

import moment from 'moment';

//Firebase
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreenProvider = ({ navigation }) => {
    const uid = FIREBASE_AUTH.currentUser.uid;

    const [profile, setProfile] = useState([]);

    //get data by id
    useEffect(() => {
        const fetchProfile = async () => {
            getDoc(doc(FIRESTORE_DB, 'users', uid)).then((docData) => {
                if (docData.exists()) {
                    console.log('ClientPP: ', docData.data().workingHours);
                    setProfile(docData.data());
                }
            })
        };
        fetchProfile();
    }, []);

    const currentDate = moment(new Date()).format('DD-MM-YYYY');
    const currentDay = moment(new Date()).format('dddd');

    const [numberUpComming, setNumberUpComming] = useState(0);
    useEffect(() => {
        const fetchTasks = async () => {
            await getDocs(query(collection(FIRESTORE_DB, 'reservations'), where('provider', '==', uid)))
                .then((querySnapshot) => {
                    const reservationArr = [];
                    const updatesArr = [];
                    let pendingReservationCount = 0;
                    querySnapshot.forEach(async (docData) => {
                        //console.log('Data from subcollection: ', { id: docData.id, ...docData.data() })
                        console.log('date: ', docData.data().status)

                        const currentDate = moment(new Date(), 'DD-MM-YYYY').startOf('day').toDate();
                        const reserveDate = moment(docData.data().reserveDate, 'DD-MM-YYYY').startOf('day').toDate();

                        if (docData.data().status === 'Pending') {
                            if (reserveDate > currentDate) {
                                pendingReservationCount++;
                            } else {
                                //await updateDoc(doc(FIRESTORE_DB, 'reservations', docData.id), { status: 'Cancelled' })
                            }
                        }
                    });
                    setNumberUpComming(pendingReservationCount)
                    //console.log('Pending Reservation Count:', pendingReservationCount);
                })
                .catch((error) => {
                    console.log('Error Getting Documents: ', error);
                })
        };
        fetchTasks();
    }, []);

    const [currentDateTasks, setCurrentDateTasks] = useState([]);
    useEffect(() => {
        const fetchCurrentDateTasks = async () => {
            await getDocs(query(collection(FIRESTORE_DB, 'reservations'), where('provider', '==', uid), where('reserveDate', '==', currentDate)))
                .then((querySnapshot) => {
                    const tasksArr = [];

                    querySnapshot.forEach(async (docData) => {
                        if (docData.data().status === 'Pending') {
                            tasksArr.push({ id: docData.id, ...docData.data() });
                            console.log('currentTasks', tasksArr)
                        }
                    });
                    setCurrentDateTasks(tasksArr);
                })
                .catch((error) => {
                    console.log('Error Getting Documents: ', error);
                })
        };
        fetchCurrentDateTasks();
    }, []);

    const [status, setStatus] = useState('Pending');
    const selectedStatus = status;

    // const WorkingHoursList = ({ workingHour }) => {
    //     if (workingHour.day == currentDay) {
    //         const shifts = workingHour.shifts;

    //         return (
    //             <View>
    //                 {
    //                     shifts.map((shift, index) => (
    //                         <View key={index} style={styles.shiftContainer}>
    //                             <View style={styles.shift}>
    //                                 <Text style={styles.shiftText}>{shift.shift}</Text>
    //                             </View>

    //                             <View style={[styles.shift, { flex: 2, }]}>
    //                                 <Text style={styles.shiftText}>{shift.startTime} - {shift.endTime}</Text>
    //                             </View>


    //                             <View style={[styles.shift, { flex: 2, }]}>
    //                                 {
    //                                     shift.available
    //                                         ? (
    //                                             <Text style={[styles.shiftText, { color: 'green' }]}>Available</Text>
    //                                         ) : (
    //                                             <Text style={[styles.shiftText, { color: 'red' }]}>Non-Available</Text>
    //                                         )
    //                                 }
    //                             </View>
    //                         </View>
    //                     ))
    //                 }
    //             </View>
    //         )
    //     }
    // }


    const CurrentDateTasksList = ({ task, index }) => {
        console.log('task: ', task.reserveDate)
        const number = index + 1;
        return (
            <TouchableOpacity style={styles.taskListContainer}>
                <View style={styles.taskIndexNumContainer}>
                    <Text style={styles.taskIndexNum}>{number}</Text>
                </View>
                <View style={styles.taskContainer}>
                    <View style={styles.taskDateTime}>
                        {/* <Text style={styles.taskInfoText}>{task.reserveDate}</Text> */}
                        <Text style={styles.taskSubInfoText}>{task.reserveStartTime} - {task.reserveEndTime}</Text>
                    </View>
                    <View>
                        <Text>{task.address}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
        
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.greeding}>
                    {/* <Image source={{ uri: profile.profileImage }} style={styles.greedingImg} /> */}
                    <View style={styles.greedingInfo}>
                        <Text style={{ fontSize: 20, }}>Hello,</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 26, }}>{profile.fName} {profile.lName}!</Text>
                    </View>

                    <View style={styles.pendingContainer}>
                        <TouchableOpacity
                            style={styles.upCommingContainer}
                            disabled={numberUpComming == 0}
                            onPress={() => navigation.navigate('Task')}
                        >
                            <Ionicons name="today-outline" size={30} color="black" />
                            <View style={styles.upCommingDetail}>
                                <Text>Upcomming Task</Text>
                                <Text style={{ fontWeight: 'bold' }}>{numberUpComming} Pending(s)</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

            <View style={styles.availableContainer}>
                <View style={styles.shiftLabel}>
                    <Text style={styles.shiftLabelText}>{currentDate} ( {currentDay} )</Text>
                </View>

                <View>
                    <FlatList
                        data={currentDateTasks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => <CurrentDateTasksList task={item} index={index} />}
                    />
                </View>
            </View>

            {/* <View style={styles.availableContainer}>
                <View style={styles.shiftLabel}>
                    <Text style={styles.shiftLabelText}>{currentDate} ({currentDay})</Text>
                </View>
                <View>
                    <FlatList
                        data={profile.workingHours}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <WorkingHoursList workingHour={item} />}
                    />
                </View>
            </View> */}

        </SafeAreaView >


    );

}

export default HomeScreenProvider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: 'white',
        padding: 10,
    },
    headerContainer: {
        margin: 10,
    },
    greeding: {
        flexDirection: 'row',
    },
    greedingImg: {
        height: 90,
        width: 90,
        borderRadius: 50,
    },
    greedingInfo: {
        flex: 1,
        flexDirection: 'column',
        margin: 10,
    },
    pendingContainer: {
        flex: 1,
        flexDirection: 'row',
    },

    upCommingContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#e6e6fa',
        backgroundColor: '#b0e0e6',
    },
    upCommingDetail: {
        flexDirection: 'column',
        marginHorizontal: 10,
    },
    upCommingDetailText: {

    },

    segmentedButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#b0e0e6', // Set the background color for the container
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#b0e0e6',
        padding: 5,
    },
    segmentedButton: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentedButtonText: {
        fontSize: 16,
        color: 'black',
    },
    selectedSegmentedButton: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
    selectedSegmentedButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0a75ad',
    },

    availableContainer: {
        flexDirection: 'column',
        borderWidth: 1,
        borderRadius: 20,
        marginVertical: 20,
        justifyContent: 'center',
    },
    shiftContainer: {
        flexDirection: 'row',
        margin: 10,
        
    },
    shiftLabel: {
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderColor: '#e6e6fa',
        backgroundColor: '#b0e0e6',
        paddingVertical: 10,
        borderBottomWidth: 1,
        
        
    },
    shiftLabelText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
    shift: {
        flex: 1,
        marginHorizontal: 10,
    },
    shiftText: {
        fontSize: 16,
    },
    timeText: {

    },

    taskListContainer: {
        flexDirection: 'row',
    },
    taskIndexNumContainer: {
        //margin: 10,
        padding: 10,
        alignContent: 'center',
        
    },
    taskIndexNum: {
        fontSize: 18,
    },
    taskContainer: {
        flex: 1,
        flexDirection: 'column',
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: 'pink',
    },
    taskDateTime: {
        flexDirection: 'row',

    },
    taskInfoText: {

    },
    taskSubInfoText: {
        fontSize: 16,
    },
})