import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet, Button, Text, View, Image,
    SafeAreaView, ScrollView, TouchableOpacity, Pressable,
    StatusBar, FlatList, Modal, Alert,
    RefreshControl,
} from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import moment from 'moment';
import { styles } from './styles/Activity';

//Firebase
import { QuerySnapshot, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';


import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

const ActivityScreen = ({ navigation }) => {
    const uid = FIREBASE_AUTH.currentUser.uid;

    const [dateSelected, setDateSelected] = useState(moment(new Date()).format('DD-MM-YYYY'));
    const [filteredReservetions, setFilteredReservations] = useState('');
    const [items, setItems] = React.useState({});

    const currentDate = moment(new Date()).format('DD-MM-YYYY');


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

    const [reservations, setReservations] = useState([]);
    const [reservationsWithProviders, setReservationsWithProviders] = useState([]);

    //get all the reservation related to the client
    const userRef = doc(FIRESTORE_DB, 'users', uid);

    // get all reservations records from clients
    useEffect(() => {
        fetchReservation();
    }, []);

    useEffect(() => {
        fetchProvider();
    }, [reservations]);

    const fetchReservation = async () => {
        await getDocs(query(collection(FIRESTORE_DB, 'reservations'), where('client', '==', uid)))
            .then((querySnapshot) => {
                const reservationArr = [];
                querySnapshot.forEach((doc) => {
                    //console.log('Data from subcollection: ', { id: doc.id, ...doc.data() })
                    reservationArr.push({ id: doc.id, ...doc.data() });
                });
                setReservations(reservationArr);
                //fetchProvider();
            })
            .catch((error) => {
                console.log('Error Getting Documents: ', error);
            })
    };

    // get provider details
    const fetchProvider = async () => {
        //console.log('run provider')
        const reservationsWithProvider = [];
        for (const reserve of reservations) {

            await getDoc(doc(FIRESTORE_DB, 'users', reserve.provider))
                .then(docData => {
                    if (docData.exists()) {
                        reservationsWithProvider.push({
                            reservationsData: reserve,
                            providerData: docData.data(),
                        });

                    } else {
                        console.log('Provider not found');
                    }

                })
                .catch((error) => {
                    console.log('Error Getting Documents: ', error);
                });
        }
        setReservationsWithProviders(reservationsWithProvider)
    };

    const ReservationList = ({ reserve }) => {
        const reservationsData = reserve.reservationsData
        const providerData = reserve.providerData

        const dateString = reservationsData.reserveDate;
        const reserveDate = reservationsData.reserveDate.split('-');

        const getReserveDate = `${reserveDate[2]}-${reserveDate[1]}-${reserveDate[0]}`
        const currentDate = new Date();
        const getCurrentDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`

        const selectedStatus = status;

        const isPending = reservationsData.status === 'Pending';
        const isCompleted = reservationsData.status === 'Completed';
        const isCancelled = reservationsData.status === 'Cancelled';
        const isRejected = reservationsData.status === 'Rejected';

        if (reservationsData.status == selectedStatus) {
            return (
                <TouchableOpacity
                    style={styles.reserveContainer}
                    onPress={() => openModalDetails(reserve)}
                >
                    <Image source={{ uri: providerData.profileImage }} style={styles.providerImg} />

                    <View style={styles.reserveInfo}>
                        <View style={styles.reserveStatus}>
                            <View style={styles.reserveDateTime}>
                                <Text style={styles.dateText}>{reservationsData.reserveDate}</Text>
                                <Text style={styles.timeText}>{reservationsData.reserveStartTime} - {reservationsData.reserveEndTime}</Text>
                            </View>

                            <View style={{ marginHorizontal: 5, }}>
                                {/* Status: Pending, Cancelled, Rejected, Completed */}
                                {
                                    isPending
                                        ? (
                                            < Text style={[styles.statusText, getStatusColor('Pending')]}>{reservationsData.status}</Text>
                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    isCompleted
                                        ? (
                                            < Text style={[styles.statusText, getStatusColor('Completed')]}>{reservationsData.status}</Text>
                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    isCancelled
                                        ? (
                                            < Text style={[styles.statusText, getStatusColor('Cancelled')]}>{reservationsData.status}</Text>
                                        ) : (
                                            <></>
                                        )
                                }
                            </View>
                        </View>

                        <View style={styles.reserveService}>
                            <View style={styles.reserveServiceText}>
                                <Text style={styles.infoText}>{reservationsData.service}</Text>
                                <Text style={styles.infoText}>{providerData.fName} {providerData.lName}</Text>
                            </View>
                            <>
                                {
                                    isPending
                                        ? (
                                            <View style={styles.iconBtnAction}>
                                                <>
                                                    {
                                                        getReserveDate < getCurrentDate
                                                            ? (
                                                                <TouchableOpacity style={[styles.iconBtnContainer, { backgroundColor: '#b20000' }]} onPress={() => handleButtonPress('Cancelled', reserve)}>
                                                                    <Ionicons name="ios-trash-outline" size={20} style={styles.iconBtn} />
                                                                    <View style={styles.iconBtnTextContainer}>
                                                                        <Text style={styles.iconBtnText}>Cancel</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            ) : (
                                                                <View>
                                                                    <TouchableOpacity style={[styles.iconBtnContainer, { backgroundColor: '#00b200' }]}
                                                                        onPress={() => handleButtonPress('Completed', reserve)}>
                                                                        <Ionicons name="ios-checkbox-outline" size={20} color="#00b200" style={styles.iconBtn} />
                                                                        <View style={styles.iconBtnTextContainer}>
                                                                            <Text style={styles.iconBtnText}>Complete</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={[styles.iconBtnContainer, { backgroundColor: '#b20000' }]} onPress={() => handleButtonPress('Cancelled', reserve)}>
                                                                        <Ionicons name="ios-trash-outline" size={20} style={styles.iconBtn} />
                                                                        <View style={styles.iconBtnTextContainer}>
                                                                            <Text style={styles.iconBtnText}>Cancel</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )
                                                    }
                                                </>
                                            </View>

                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    isCompleted
                                        ? (
                                            <View style={styles.iconBtnAction}>
                                                <View>
                                                    <TouchableOpacity style={[styles.iconBtnContainer, { backgroundColor: '#61406a' }]}
                                                        onPress={() => handleButtonPress('Review', reserve)}>
                                                        <MaterialCommunityIcons name="comment-text-outline" size={20} style={styles.iconBtn} />
                                                        <View style={styles.iconBtnTextContainer}>
                                                            <Text style={styles.iconBtnText}>Review</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    isCancelled
                                        ? (
                                            <View style={styles.iconBtnAction}>
                                                <View>
                                                    <TouchableOpacity style={[styles.iconBtnContainer, { backgroundColor: '#00b200' }]}
                                                        onPress={() => handleButtonPress('Completed', reserve)}>
                                                        <Ionicons name="ios-checkbox-outline" size={20} style={styles.iconBtn} />
                                                        <View style={styles.iconBtnTextContainer}>
                                                            <Text style={styles.iconBtnText}>Complete</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (
                                            <></>
                                        )
                                }
                            </>
                        </View>

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

    const [] = useState();

    // Function to handle button press and show confirmation alert
    const handleButtonPress = (status, reserve) => {
        Alert.alert(
            `Confirm ${status}`,
            `Are you sure you want to ${status.toLowerCase()} this reservation?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        // If the user confirms, update the status
                        setIsDaySelected(true);
                        if (status == 'Completed') {
                            //updateStatus(status, reserve);
                            navigation.navigate('FeedbackScreen', {
                                screen: 'FeedbackScreen',
                                params: reserve
                            })
                        } else if (status == 'Cancelled') {
                            updateDoc(doc(FIRESTORE_DB, 'reservations', reserve.reservationsData.id), {
                                status: status
                            });

                            setRefreshing(true);
                            handleRefresh();
                            //navigation.replace('Home');
                        }
                    },
                },
            ],
            { cancelable: false }
        );

    };


    const [calendarDate, setCalendarDate] = useState('')
    const [isDaySelected, setIsDaySelected] = useState(false);
    //const [updatedReservations, setUpdatedReservations] = useState([]);
    const updateStatus = async (status, reserve) => {
        const reservationsData = reserve.reservationsData
        const providerData = reserve.providerData
        console.log(reserve.id);
        console.log(reserve.reservationsData.status)
        console.log(status);

        try {
            await updateDoc(doc(FIRESTORE_DB, 'reservations', reservationsData.id), {
                status: status
            });

            handleRefresh();
            setCalendarDate(new Date().dateString);
            setIsDaySelected(false);
        } catch (error) {
            console.log('Status updated fail: ', error);
        }
    }

    //pull to refresh
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = () => {
        // Simulate a reload action with a timeout
        fetchReservation();
        fetchProvider();
        setTimeout(() => {
            // After the reload is complete, set refreshing to false
            setRefreshing(false);
        }, 2000); // You can replace this with your actual reload logic
    };

    const [status, setStatus] = useState('Pending');
    const handleSegmentedChange = (selectedSegmentedStatus) => {
        console.log('selectedSegmentedStatus', selectedSegmentedStatus)
        setStatus(selectedSegmentedStatus);
    }


    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState([]);

    //function to open the modal with a specific clientID
    const openModalDetails = (reserve) => {
        const reservationsData = reserve.reservationsData
        const providerData = reserve.providerData

        //get data by id
        getDoc(doc(FIRESTORE_DB, 'users', reservationsData.provider))
            .then(docData => {
                if (docData.exists()) {
                    console.log("Here " + docData.data())
                    setSelectedProvider(docData.data())
                } else {
                    console.log('No such data.')
                }
            }).catch((error) => {
                console.log(error);
            });

        setSelectedReservation(reservationsData);
        setModalVisible(true);
    }

    //function to close the modal
    const closeModal = () => {
        setSelectedProvider([]);
        setModalVisible(false);
    }

    const renderStars = (rate) => {
        const stars = [];
        const maxRate = 5;
        for (let i = 0; i < maxRate; i++) {
            if (i < rate) {
                stars.push(
                    <FontAwesome name="star" size={10} color="black" />
                )
            } else {
                stars.push(
                    <FontAwesome name="star-o" size={10} color="black" />
                )
            }

        }
        return stars;
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

                    {/* <TouchableOpacity
                        style={[styles.segmentedButton, status === 'Review' && styles.selectedSegmentedButton,]}
                        onPress={() => handleSegmentedChange('Review')}
                    >
                        <Text style={[styles.segmentedButtonText, status === 'Review' && styles.selectedSegmentedButtonText,]} >To Review</Text>
                    </TouchableOpacity> */}
                </View>

                <FlatList
                    data={reservationsWithProviders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => <ReservationList reserve={item} />}
                />
            </SafeAreaView >

            <SafeAreaView>
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
                                <View style={styles.providerInfo}>
                                    <View style={styles.modalTextContainer}>
                                        <FontAwesome name="user" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedProvider.fName} {selectedProvider.lName}</Text>
                                    </View>
                                    <View style={styles.modalTextContainer}>
                                        <FontAwesome name="phone" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedProvider.contactNumber}</Text>
                                    </View>
                                    <View style={styles.modalTextContainer}>
                                        <FontAwesome name="location-arrow" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedReservation.address}</Text>
                                    </View>
                                </View>

                                <View style={styles.reservationInfo}>
                                    <View style={[styles.modalTextContainer, { flex: 1 }]}>
                                        <Ionicons name="ios-calendar-sharp" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedReservation.reserveDate}</Text>

                                    </View>
                                    <View style={[styles.modalTextContainer, { flex: 1 }]}>
                                        <Ionicons name="ios-time-sharp" size={24} color="black" />
                                        <Text style={styles.modalText}>{selectedReservation.reserveStartTime} - {selectedReservation.reserveEndTime}</Text>
                                    </View>
                                </View>

                                <View >
                                    <View style={styles.modalTextContainer}>
                                        <Ionicons name="bookmark" size={24} color="black" />
                                        <Text style={styles.modalTextTitle}>Special Request</Text>
                                    </View>
                                    <Text style={styles.modalText}>{selectedReservation.specialRequest}</Text>
                                </View>

                                <>
                                    {
                                        selectedReservation.status == 'Completed'
                                            ? (
                                                <View style={{ marginVertical: 10, }}>
                                                    <View style={styles.modalTextContainer}>
                                                        <MaterialCommunityIcons name="comment" size={24} color="black" />
                                                        <Text style={styles.modalTextTitle}>Rate & Review</Text>
                                                    </View>

                                                    <View style={styles.feedbackRate}>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={styles.modalText}>{selectedReservation.feedback}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', }}>
                                                            <View style={styles.starContainer}>
                                                                {
                                                                    renderStars(selectedReservation.rate)
                                                                }
                                                            </View>
                                                            <Text style={styles.modalText}>{parseFloat(selectedReservation.rate).toFixed(1)}</Text>
                                                        </View>

                                                    </View>

                                                    <View>

                                                    </View>

                                                </View>

                                            ) : (
                                                <></>
                                            )
                                    }

                                </>
                            </View>

                            <View style={styles.modalBtnContainer}>
                                {/* {
                                    selectedReservation.status == 'Pending'
                                        ? (
                                            <Pressable
                                                style={[styles.bottomBtn, styles.modalBtn, { backgroundColor: 'red' }]}
                                                onPress={() => closeModal()}
                                            >
                                                <Text style={styles.bottomBtnText}>Cancel</Text>
                                            </Pressable>
                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    selectedReservation.status == 'Completed'
                                        ? (
                                            <Pressable
                                                style={[styles.bottomBtn, styles.modalBtn, { backgroundColor: '#61406a' }]}
                                                onPress={() => closeModal()}
                                            >
                                                <Text style={styles.bottomBtnText}>Review</Text>
                                            </Pressable>
                                        ) : (
                                            <></>
                                        )
                                }
                                {
                                    selectedReservation.status == 'Cancelled'
                                        ? (
                                            <Pressable
                                                style={[styles.bottomBtn, styles.modalBtn, { backgroundColor: '#61406a' }]}
                                                onPress={() => closeModal()}
                                            >
                                                <Text style={styles.bottomBtnText}>Review</Text>
                                            </Pressable>
                                        ) : (
                                            <></>
                                        )
                                } */}
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
            </SafeAreaView>
        </ScrollView >

    );
}

export default ActivityScreen;