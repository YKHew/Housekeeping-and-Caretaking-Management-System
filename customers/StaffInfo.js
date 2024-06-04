import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar, FlatList,
    Pressable, TouchableOpacity,
    TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles/SelectedStaffInfo';

import moment, { max, weekdays } from 'moment';

//Firebase
import { collection, doc, getDoc, getDocs, query, where, get, documentId, QuerySnapshot } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

import Staffs from '../src/constants/staffs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//import { useAppTheme } from 'react-native-paper/lib/typescript/src/core/theming';


const StaffInfoScreen = ({ route, navigation }) => {
    const selectedStaff = route.params;
    const currentDay = weekdays(new Date().getDay());
    console.log('selectedStaff: ', selectedStaff);
    //console.log(selectedStaff.fName);

    const [day, month, year] = selectedStaff.dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const timeDifference = currentDate - birthDate;
    const age = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));

    const spokenLanguage = selectedStaff.spokenLanguage || [];
    console.log(spokenLanguage);

    const workingHours = selectedStaff.workingHours || [];
    console.log(workingHours)


    const [reservations, setReservations] = useState([]);
    const [clients, setClients] = useState([]);

    //get reservation which ald done
    useEffect(() => {
        const fetchReservation = async () => {
            getDocs(query(collection(FIRESTORE_DB, 'reservations'), where('provider', '==', selectedStaff.uid), where('status', '==', 'Completed')))
                .then((querySnapshot) => {
                    const reservationArr = [];

                    querySnapshot.forEach((doc) => {
                        reservationArr.push(doc.data());
                    });

                    //sort the providers alphabetically by first name
                    //reservationArr.sort((a, b) => a.reserveDate.localeCompare(b.reserveDate));

                    setReservations(reservationArr);
                })
        };
        fetchReservation();
    }, []);

    //get client information 
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const clientRef = await Promise.all(
                    reservations.map(async (item) => {
                        const clientDoc = await getDoc(doc(FIRESTORE_DB, 'users', item.client));
                        return { reservationData: item, clientData: clientDoc.data() }
                    })
                );
                setClients(clientRef);
                console.log('Clients:', clientRef);

                //console.log('cliebt', clientRef.data());
            } catch (error) {

            }
        };
        fetchClient();
    }, [reservations]);

    const FeedbackList = ({ item }) => {
        console.log('reservelist', item.reservationData)
        console.log('clientlist', item.clientData)

        return (
            <TouchableOpacity style={styles.feedbackList}>
                <View>
                    <Image source={{ uri: item.clientData.profileImage }} style={styles.feedbackStaffImg} />
                </View>
                <View style={styles.feedbackInfo}>
                    <Text style={styles.feedBackListText}>{item.clientData.lName}</Text>
                    <Text style={styles.feedBackListText}>{item.reservationData.reserveDate}</Text>
                    <Text style={styles.feedBackListText}>{item.reservationData.feedback}</Text>
                </View>
                <View style={styles.feedbackRate}>
                    <Text style={styles.feedBackListText}>{parseFloat(item.reservationData.rate).toFixed(1)}</Text>
                    {
                        item.reservationData.rate && (
                            <View style={styles.starContainer}>
                                {
                                    renderStars(item.reservationData.rate)
                                }
                            </View>
                        )
                    }
                </View>
            </TouchableOpacity>
        )
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
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <Image source={{ uri: selectedStaff.profileImage }} style={styles.staffImg} />
                    <View style={styles.info}>
                        <View>
                            <Text style={styles.infoText}>{selectedStaff.fName}</Text>
                            <Text style={styles.infoText}>{selectedStaff.lName}</Text>
                        </View>
                        <View style={styles.subInfoContainer}>
                            <View style={styles.subInfo}>
                                <FontAwesome name="phone" size={24} color="black" />
                                <Text style={styles.subInfoText}>{selectedStaff.contactNumber}</Text>
                            </View>
                            <View style={styles.subInfo}>
                                <FontAwesome name="star" size={24} color="#ffd700" />
                                <Text style={styles.subInfoText}>{parseFloat(selectedStaff.rate).toFixed(1)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.intro}>
                        <Text style={styles.introText}>{selectedStaff.introduction}</Text>
                    </View>

                    <View style={styles.details}>
                        <View style={styles.detailsLRHS}>
                            <Text>Age: {age}</Text>
                            <Text>Gender: {selectedStaff.gender}</Text>
                            <Text>Nationality: {selectedStaff.nationality}</Text>
                            <Text>Religion: {selectedStaff.religion}</Text>

                            <View style={styles.detailListContainer}>
                                <Text>Spoken Language: </Text>
                                <FlatList
                                    //style={styles.detailsList}
                                    //horizontal
                                    data={spokenLanguage}
                                    renderItem={({ item }) =>
                                        <Text style={styles.detailsListText}>- {item}</Text>
                                    }
                                />
                            </View>
                        </View>
                        <View style={styles.detailsLRHS}>
                            <View>
                                <Text>Available Working Days:</Text>
                                <View style={styles.timeSlot}>
                                    <FlatList
                                        data={workingHours}
                                        keyExtractor={(item) => item.day}
                                        renderItem={({ item }) =>
                                            <View>
                                                {
                                                    item.workDay && (
                                                        <Text style={styles.detailsListText}>- {item.day}</Text>
                                                    )
                                                }
                                            </View>
                                        }
                                    />
                                </View>
                            </View>


                        </View>
                    </View>
                </View>

                <View style={styles.commentsListContainer}>
                    <Text>Review & Comments</Text>
                    <FlatList
                        data={clients}
                        renderItem={FeedbackList}
                        keyExtractor={(item) => item.reservationID}
                    />
                </View>
            </View>
            <View style={styles.bottomBtn}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('BookingScreen', {
                        screen: 'BookingScreen',
                        params: selectedStaff
                    })
                }}>
                    <View style={styles.selectBtn}>
                        <Text style={styles.selectBtnText}>Select</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default StaffInfoScreen;