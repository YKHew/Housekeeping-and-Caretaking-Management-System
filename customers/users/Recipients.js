import React, { Component, useState } from 'react';
import {
    StyleSheet, Button, Text, View, Image, ImageBackground,
    SafeAreaView, TouchableOpacity, FlatList,
    useWindowDimensions,
    StatusBar,
    Alert,
} from 'react-native';

//Firebase
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const RecipientsScreen = () => {

    const uid = FIREBASE_AUTH.currentUser.uid;
    const [username, setUsername] = useState('');
    //get data by id
    getDoc(doc(FIRESTORE_DB, 'users', uid)).then(docData => {
        if (docData.exists()) {
            //console.log("Here" + docData.data().username)
            setUsername(docData.data().username)
        } else {

        }
    }).catch((error) => {
        console.log(error);
    });

    return (
        <SafeAreaView>

        </SafeAreaView>
    )
}

export default RecipientsScreen;

const styles = StyleSheet.create({
    container: {

    },
})