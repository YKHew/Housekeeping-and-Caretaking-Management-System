import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet, Button, Text, View, Image, ImageBackground,
    SafeAreaView, TouchableOpacity, FlatList,
    useWindowDimensions,
    StatusBar, TextInput,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

//Firebase
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

const FeedbackScreen = ({ route, navigation }) => {
    const uid = FIREBASE_AUTH.currentUser.uid;

    const reservation = route.params;
    //console.log('service: ', reservation);
    const providerData = reservation.providerData;
    const reservationsData = reservation.reservationsData;
    //console.log(providerData);

    const [currentProviderRate, setCurrentProviderRate] = useState(0);
    const [numberOfRate, setNumberOfRate] = useState(0);
    //const currentProviderRate = 0;
    //const numberOfRate = 0;
    useEffect(() => {
        let currentTotalRate = 0;
        let numberRate = 0;
        const fetchRate = async () => {
            try {
                await getDocs(query(collection(FIRESTORE_DB, 'reservations'), where('provider', '==', providerData.uid)))
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (doc.data().rate != undefined && doc.data().rate != '') {
                                const rate = parseInt(doc.data().rate)
                                console.log('rate', rate)
                                currentTotalRate += rate
                                numberRate++;
                            }
                        });
                        console.log('numRate', numberRate)
                        setCurrentProviderRate(currentTotalRate)
                        setNumberOfRate(numberRate);
                    })
            } catch (error) {

            }
        }
        fetchRate();
    }, []);

    const [selectedStar, setSelectedStar] = useState(0);

    //data update to firebase
    const [ratingService, setRatingService] = useState(0);
    const [ratingProvider, setRatingProvider] = useState(0);
    const [comment, setComment] = useState('');

    const starsList = (selectedStar, handleStarPress) => {
        const maxStars = 5;
        const stars = [];
        for (let i = 1; i <= maxStars; i++) {
            stars.push(
                <TouchableOpacity
                    style={styles.starIcon}
                    key={i}
                    onPress={() => handleStarPress(i)}
                >
                    <Ionicons name={i <= selectedStar ? 'star' : 'star-outline'} size={30} color="black" />
                </TouchableOpacity>
            )
        }
        console.log('', ratingService);
        console.log('', ratingProvider);
        return stars;
    }


    const [totalAverageRate, setTotalAverageRate] = useState(0);
    
    const handleSubmitPress = async () => {
        //update ratingService, ratingProvider, comment
        const prevRate = parseFloat(providerData.rate);
        const rating = (parseFloat(ratingService) + parseFloat(ratingProvider)) / 2;

        setCurrentProviderRate((currentRate) => {
            const totalRate = parseFloat(currentRate) + prevRate + rating;
            console.log('newRate: ', totalRate);

            const avgRate = parseFloat(totalRate / (numberOfRate + 1)).toFixed(1);
            console.log('avgRate: ', avgRate)
            setTotalAverageRate(avgRate);

            updateDoc(doc(FIRESTORE_DB, 'users', providerData.uid), {
                rate: avgRate
            });
        });

        if (rating > 0 && comment != '') {
            await updateDoc(doc(FIRESTORE_DB, 'reservations', reservationsData.id), {
                rate: rating,
                feedback: comment,
                status: 'Completed'
            });
        }

        Alert.alert(
            'Thank You!',
            'Your feedback has been submitted. Thank you for choosing us. Have a nice day!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        //Navigate to the home screen after the user clicks OK
                        navigation.replace('Home'); // Replace 'Home' with your actual home screen route name
                    },
                },
            ],
            { cancelable: false }
        );
    }

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>

                <View style={styles.reservationContainer}>
                    <Image source={{ uri: providerData.profileImage }} style={styles.img} />
                    <View style={styles.details}>
                        <View style={styles.providerData}>
                            <Text style={styles.name}>{providerData.fName} {providerData.lName}</Text>
                        </View>
                        <View style={styles.reservationData}>
                            <Text>Date: {reservationsData.reserveDate}</Text>
                            <Text>Shift: {reservationsData.reserveStartTime} - {reservationsData.reserveEndTime} ({reservationsData.reserveShift})</Text>
                            <Text>{reservationsData.service} Service</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 1, backgroundColor: 'black', marginVertical: 20, }} />

                <View style={styles.rateContainer}>
                    <Text style={styles.rateQuestion}>How was the service ?</Text>
                    <View style={styles.starContainer}>
                        {/* {
                        starsList()
                    } */}
                        {starsList(ratingService, setRatingService)}
                    </View>
                </View>

                <View style={styles.rateContainer}>
                    <Text style={styles.rateQuestion}>How was the housekeeper / caretaker ?</Text>
                    <View style={styles.starContainer}>
                        {/* {
                        starsList()
                    } */}
                        {starsList(ratingProvider, setRatingProvider)}
                    </View>
                </View>

                <View style={{ height: 1, backgroundColor: 'black', marginVertical: 20, }} />

                <View style={styles.rateContainer}>
                    <Text style={styles.rateQuestion}>Tell about your experience with this service?</Text>
                    <TextInput
                        style={styles.commentInput}
                        multiline={true}
                        numberOfLines={5}
                        placeholder='Feedback'
                        onChangeText={setComment}
                        value={comment}
                    />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={() => { handleSubmitPress() }}>
                    <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>

                {/* <View style={styles.submitBtnContainer}>
                <TouchableOpacity style={styles.submitBtn} >
                    <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
            </View> */}
            </SafeAreaView>
        </ScrollView>




    );
}

export default FeedbackScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //height: '100%',
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    reservationContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        //marginHorizontal: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        //borderBottomWidth: 1,
    },
    img: {
        height: 100,
        width: 80,
        alignItems: 'center',
    },
    details: {
        marginHorizontal: 10,
    },
    providerData: {

    },
    reservationData: {

    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    rateContainer: {
        flexDirection: 'column',
        paddingVertical: 5,
    },
    rateQuestion: {
        fontSize: 18,
        marginVertical: 10,
    },
    starContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    starIcon: {
        marginHorizontal: 10,
    },
    commentInput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 18,
        textAlignVertical: 'top',
    },

    submitBtn: {
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 10,
        backgroundColor: '#0a75ad',

    },
    submitBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
})