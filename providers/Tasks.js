import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar, FlatList,
    Pressable, TouchableOpacity,
    TextInput, Alert,
    RefreshControl,
} from 'react-native';

import moment from 'moment';
import { styles } from './styles/Tasks';

//Firebase
import { QuerySnapshot, collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TaskScreen = ({ navigation }) => {
    const uid = FIREBASE_AUTH.currentUser.uid;

    const loadItems = (day) => {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(10, Math.floor(Math.random() * 150)),
                            day: strTime
                        });
                    }
                }
            }

            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setItems(newItems);
        }, 1000);
    }

    const [dateSelected, setDateSelected] = useState('');
    const [filterTasks, setFilteredTasks] = useState([]);

    const [tasks, setTasks] = useState([]);
    const [tasksWithClients, setTasksWithClients] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        fetchClients();
    }, [tasks]);

    //get all reservations from providers
    const fetchTasks = async () => {
        await getDocs(query(collection(FIRESTORE_DB, 'reservations'), where('provider', '==', uid)))
            .then((querySnapshot) => {
                const tasksArr = [];
                querySnapshot.forEach((doc) => {
                    //console.log('Data from subcollection: ', { id: doc.id, ...doc.data() })
                    tasksArr.push({ id: doc.id, ...doc.data() });
                });
                setTasks(tasksArr);
                console.log('tasksArr', tasksArr);
            })
            .catch((error) => {
                console.log('Error Getting Documents: ', error);
            })
    };

    //get client detail
    const fetchClients = async () => {
        const tasksWithClient = [];
        console.log('tasks', tasks);
        for (const task of tasks) {
            await getDoc(doc(FIRESTORE_DB, 'users', task.provider))
                .then((docData) => {
                    if (docData.exists()) {
                        tasksWithClient.push({
                            taskData: task,
                            clientData: docData.data(),
                        });
                    } else {
                        console.log('Provider not found');
                    }
                })
                .catch((error) => {
                    console.log('Error Getting Documents: ', error);
                });
        };
        setTasksWithClients(tasksWithClient);
        console.log('tasksWithClient', tasksWithClient);
    };


    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState([]);
    const [selectedClient, setSelectedClient] = useState([]);

    const [status, setStatus] = useState('Pending');
    //const selectedStatus = status;

    const TasksList = ({ task }) => {
        const taskData = task.taskData
        const clientData = task.clientData

        const dateString = taskData.reserveDate;
        const reserveDate = taskData.reserveDate.split('-');

        const getReserveDate = `${reserveDate[2]}-${reserveDate[1]}-${reserveDate[0]}`
        const currentDate = new Date();
        const getCurrentDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`

        const selectedStatus = status;

        //console.log('selectedStatus', selectedStatus)

        const isPending = taskData.status === 'Pending';
        const isCompleted = taskData.status === 'Completed';
        const isCancelled = taskData.status === 'Cancelled';
        const isRejected = taskData.status === 'Rejected';

        if (taskData.status == selectedStatus) {
            return (
                <TouchableOpacity
                    style={styles.taskContainer}
                    onPress={() => openModalDetails(task)}
                >
                    <View style={styles.taskLeftContainer}>
                        <View style={styles.taskInfoContainer}>
                            <View style={styles.taskDateTime}>
                                <Text style={styles.taskInfoText}>{taskData.reserveDate}</Text>
                                <Text style={styles.taskSubInfoText}>{taskData.reserveStartTime} - {taskData.reserveEndTime}</Text>
                            </View>
                            <View>
                                {
                                    isPending
                                        ? (
                                            < Text style={[styles.taskInfoText, getStatusColor('Pending')]}>{taskData.status}</Text>
                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    isCompleted
                                        ? (
                                            < Text style={[styles.taskInfoText, getStatusColor('Completed')]}>{taskData.status}</Text>
                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    isCancelled
                                        ? (
                                            < Text style={[styles.taskInfoText, getStatusColor('Cancelled')]}>{taskData.status}</Text>
                                        ) : (
                                            <></>
                                        )
                                }
                                {/* {
                                    getReserveDate < getCurrentDate
                                        ? (
                                            <Text style={[styles.taskInfoText, getStatusColor('Overdue')]}>Overdue</Text>
                                        ) : (
                                            <Text style={[styles.taskInfoText, getStatusColor(taskData.status)]}>{selectedStatus}</Text>
                                        )
                                } */}

                            </View>
                        </View>
                        <View>
                            <Text style={styles.taskAddressText}>{taskData.address}</Text>
                        </View>
                    </View>
                    <View style={styles.taskIcon}>
                        <AntDesign name="right" size={18} color="black" />
                    </View>
                </TouchableOpacity >
            );
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return styles.pendingStatus;
            case 'Rejected':
                return styles.rejectedStatus;
            case 'Completed':
                return styles.finishedStatus;
            case 'Cancelled':
                return styles.cancelledStatus;
            case 'Overdue':
                return styles.overdueStatus;
            default:
                return {}; // Default style if status doesn't match any case
        }
    }

    //pull to refresh
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = () => {
        // Simulate a reload action with a timeout
        fetchTasks();
        fetchClients();
        setTimeout(() => {
            // After the reload is complete, set refreshing to false
            setRefreshing(false);
        }, 2000); // You can replace this with your actual reload logic
    };


    //function to open the modal with a specific clientID
    const openModalDetails = (task) => {
        const taskData = task.taskData
        const clientData = task.clientData

        //get data by id
        getDoc(doc(FIRESTORE_DB, 'users', taskData.client))
            .then(docData => {
                if (docData.exists()) {
                    console.log("Here " + docData.data())
                    setSelectedClient(docData.data())
                } else {
                    console.log('No such data.')
                }
            }).catch((error) => {
                console.log(error);
            });

        setSelectedTask(taskData);
        setModalVisible(true);
    }

    //function to close the modal
    const closeModal = () => {
        setSelectedClient([]);
        setModalVisible(false);
    }

    const handleSegmentedChange = (selectedSegmentedStatus) => {
        setStatus(selectedSegmentedStatus);
    }

    const handleRejectButton = (task) => {
        console.log('reject', task);
        //console.log(reserve.reservationsData.status)


        Alert.alert(
            `Confirm Reject?`,
            `Are you sure you want to Reject this reservation?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        // If the user confirms, update the status

                        updateDoc(doc(FIRESTORE_DB, 'reservations', task.reservationID), {
                            status: 'Cancelled'
                        });
                        closeModal()
                        setRefreshing(true);
                        handleRefresh();

                        //navigation.replace('Home');
                    }
                },
            ],
            { cancelable: false }
        );

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
            <SafeAreaView style={[styles.container,]}>
                <View style={styles.segmentedButtonContainer}>
                    <TouchableOpacity
                        style={[styles.segmentedButton, status === 'Pending' && styles.selectedSegmentedButton,]}
                        onPress={() => handleSegmentedChange('Pending')}
                    >
                        <Text style={[styles.segmentedButtonText, status === 'Pending' && styles.selectedSegmentedButtonText,]} >Pending</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.segmentedButton, status === 'Completed' && styles.selectedSegmentedButton,]}
                        onPress={() => handleSegmentedChange('Completed')}
                    >
                        <Text style={[styles.segmentedButtonText, status === 'Completed' && styles.selectedSegmentedButtonText,]} >Completed</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.segmentedButton, status === 'Cancelled' && styles.selectedSegmentedButton,]}
                        onPress={() => handleSegmentedChange('Cancelled')}
                    >
                        <Text style={[styles.segmentedButtonText, status === 'Cancelled' && styles.selectedSegmentedButtonText,]} >Cancelled</Text>
                    </TouchableOpacity>

                </View>

                <FlatList
                    data={tasksWithClients}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => <TasksList task={item} />}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>

                    <View style={styles.modalViewContainer}>
                        <View style={styles.modalView}>
                            <View style={styles.infoView}>
                                <View style={styles.clientInfo}>
                                    <View style={styles.modalTextContainer}>
                                        <FontAwesome name="user" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedClient.fName} {selectedClient.lName}</Text>
                                    </View>
                                    <View style={styles.modalTextContainer}>
                                        <FontAwesome name="phone" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedClient.contactNumber}</Text>
                                    </View>
                                    <View style={styles.modalTextContainer}>
                                        <FontAwesome name="location-arrow" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedTask.address}</Text>
                                    </View>
                                </View>

                                <View style={styles.taskInfo}>
                                    <View style={[styles.modalTextContainer, { flex: 1 }]}>
                                        <Ionicons name="ios-calendar-sharp" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedTask.reserveDate}</Text>

                                    </View>
                                    <View style={[styles.modalTextContainer, { flex: 1 }]}>
                                        <Ionicons name="ios-time-sharp" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedTask.reserveStartTime} - {selectedTask.reserveEndTime}</Text>
                                    </View>
                                </View>

                                <View>
                                    <Text style={styles.modalTextTitle}>Special Request</Text>
                                    <Text style={styles.modalText}>{selectedTask.specialRequest}</Text>
                                </View>
                            </View>

                            <View style={styles.modalBtnContainer}>
                                {
                                    selectedTask.status == 'Pending'
                                        ? (
                                            <Pressable
                                                style={[styles.bottomBtn, styles.modalBtn, { backgroundColor: 'red' }]}
                                                onPress={() => handleRejectButton(selectedTask)}
                                            >
                                                <Text style={styles.bottomBtnText}>Reject</Text>
                                            </Pressable>
                                        ) : (
                                            <></>
                                        )
                                }
                                <Pressable
                                    style={[styles.bottomBtn, styles.modalBtn]}
                                    onPress={() => closeModal()}
                                >
                                    <Text style={styles.bottomBtnText}>Close</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>



                </Modal>


                {/* <View>
                <Calendar
                    onDayPress={
                        day => {
                            const formattedDate = moment(day.dateString).format('DD-MM-YYYY');
                            const filteredTask = tasks.filter(task => task.reserveDate === formattedDate);

                            setDateSelected(formattedDate);
                            setFilteredTasks(filteredTask);
                        }
                    }
                    markedDates={{
                        [dateSelected]: { dateSelected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                    }}

                    style={{
                        marginVertical: 10,
                    }}
                    theme={{
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: 'pink',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#2d4150',
                    }}
                />
            </View> */}
            </SafeAreaView >
        </ScrollView>

    );

}

export default TaskScreen;