import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

//import DateTimePicker from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

//firebase
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//screen
import Services from '../src/constants/services';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-native-paper';



const HomeScreen = ({ navigation }) => {
    //Update mathod to show and hide the Date Picker Dialog
    //Hold the selected Date
    const [datePicker, setDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [timePicker, setTimePicker] = useState(false);
    const [time, setTime] = useState(new Date(Date.now()));

    //To show the Date Picker
    const showDatePicker = () => {
        setDatePicker(true);
    };

    //Set selected Date into State
    const onDateSelected = (event, value) => {
        setDate(value);
        setDatePicker(false);
    }

    //To show the Time Picker
    const showTimePicker = () => {
        setTimePicker(true);
    };

    //Set selected Time into State
    const onTimeSelected = (event, value) => {
        setTime(value);
        setTimePicker(false);
    }

    const uid = FIREBASE_AUTH.currentUser.uid;
    const [profile, setProfile] = useState([]);
    const [numberUpComming, setNumberUpComming] = useState('');

    //get data by id

    useEffect(() => {
        const fetchClient = async () => {
            getDoc(doc(FIRESTORE_DB, 'users', uid)).then((docData) => {
                if (docData.exists()) {
                    setProfile(docData.data());
                }
            })
        };
        fetchClient();
    }, [])

    const [services, setServices] = useState([]);
    useEffect(() => {
        const fetchServices = async () => {
            await getDocs(query(collection(FIRESTORE_DB, 'services')))
                .then((querySnapshot) => {
                    const servicesArr = [];
                    querySnapshot.forEach((docData) => {
                        servicesArr.push({ id: docData.id, ...docData.data() })
                    });
                    setServices(servicesArr);
                })
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const fetchReservation = async () => {
            await getDocs(query(collection(FIRESTORE_DB, 'reservations'), where('client', '==', uid)))
                .then((querySnapshot) => {
                    const reservationArr = [];
                    const updatesArr = [];
                    let pendingReservationCount = 0;
                    let toReviewReservationCount = 0;
                    querySnapshot.forEach(async (docData) => {
                        //console.log('Data from subcollection: ', { id: docData.id, ...docData.data() })
                        const currentDate = moment(new Date(), 'DD-MM-YYYY').startOf('day').toDate();
                        const reserveDate = moment(docData.data().reserveDate, 'DD-MM-YYYY').startOf('day').toDate();
                        //console.log('CURRENTDate', moment(currentDate).format('DD-MM-YYYY'))

                        if (docData.data().status === 'Pending') {
                            if (reserveDate > currentDate) {
                                pendingReservationCount++;
                            } else {
                                await updateDoc(doc(FIRESTORE_DB, 'reservations', docData.id), {status: 'Cancelled'})
                                toReviewReservationCount++;
                            }
                        }
                        setNumberUpComming(pendingReservationCount);
                    });
                })
                .catch((error) => {
                    console.log('Error Getting Documents: ', error);
                })
        };
        fetchReservation();
    }, []);

    useEffect(() => {
        const fetchUpdatedReservation = async () => {
            console.log('PendingService: ', numberUpComming)
            console.log('To Review: ', numberToReview)
        };
        fetchUpdatedReservation();
    }, []);

    const HousekeepingServiceList = ({ housekeeping }) => {
        //console.log('housekeeping', housekeeping);
        if (housekeeping.type == 'housekeeping') {
            //console.log(housekeeping);
            return (
                <View style={styles.categoryShadow}>
                    <TouchableOpacity style={styles.category}
                        onPress={() => {
                            navigation.navigate('ServiceDetailScreen', {
                                screen: 'ServiceDetailScreen',
                                params: housekeeping
                            })
                        }}>
                        <Image source={{ uri: housekeeping.imgIcon }} style={styles.imgBtn} />
                        <Text style={styles.section2_title}>{housekeeping.title}</Text>
                    </TouchableOpacity>
                </View>
            );
        }

    }

    const CaretakingServiceList = ({ caretaking }) => {
        if (caretaking.type == 'caretaking') {
            return (
                <View style={styles.categoryShadow}>
                    <TouchableOpacity style={styles.category}
                        onPress={() => {
                            navigation.navigate('ServiceDetailScreen', {
                                screen: 'ServiceDetailScreen',
                                params: caretaking
                            })
                        }}>
                        <Image source={{ uri: caretaking.imgIcon }} style={styles.imgBtn} />
                        <Text style={styles.section2_title}>{caretaking.title}</Text>
                    </TouchableOpacity >
                </View>
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.greeding}>
                    <View style={styles.greedingInfo}>
                        <Text style={{ fontSize: 20, }}>Hello,</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 26, }}>{profile.username}!</Text>
                    </View>
                    <View style={styles.pendingContainer}>
                        <TouchableOpacity
                            style={styles.pending}
                            disabled={numberUpComming == 0}
                            onPress={() => navigation.navigate('Activity')}
                        >
                            <MaterialCommunityIcons name="calendar-text" size={30} color="black" />
                            <View style={styles.pendingDetail}>
                                <Text>Upcomming</Text>
                                <Text style={{ fontWeight: 'bold' }}>{numberUpComming} Pending(s)</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{}}>
                <View style={{ marginVertical: 20, }}>
                    <Text style={styles.subTitle} >Housekeeing Services</Text >

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={services}
                        renderItem={({ item }) => <HousekeepingServiceList housekeeping={item} />
                        }
                    />
                </View>

                <View style={{ marginVertical: 20, }}>
                    <Text style={styles.subTitle}>Caretaking Services</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={services}
                        renderItem={({ item }) => <CaretakingServiceList caretaking={item} />}
                    />
                </View>
            </View>

        </SafeAreaView >


    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: '#F5FCFF',
    },
    headerContainer: {
        margin: 10,
    },
    greeding: {
        flexDirection: 'row',
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
    pending: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#e6e6fa',
        backgroundColor: '#b0e0e6',
    },
    pendingDetail: {
        flexDirection: 'column',
        marginHorizontal: 10,
    },
    upCommingDetailText: {

    },

    quickBookContainer: {
        margin: 20,
        marginHorizontal: 50,
    },
    quickBook: {
        //margin: 20,
        //marginHorizontal: 50,
        flexDirection: 'row',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    categoryShadow: {

    },
    category: {
        margin: 10,
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        borderRadius: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },

    imgBtn: {
        width: 80,
        height: 80,
        marginBottom: 5,
    },

    subTitle: {
        marginHorizontal: 10,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'justify',
    },
    section2_title: {
        color: "#000080",
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 7,
    },
    section2_text: {
        color: "black",
        fontSize: 12,
        fontWeight: "500"
    },
});