import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet, Button, Text, View, Image, ImageBackground,
    SafeAreaView, TouchableOpacity, FlatList,
    useWindowDimensions,
    StatusBar, TextInput,
    Alert,
} from 'react-native';

//Firebase
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useContext } from 'react';

const EditProfileScreen = () => {

    const uid = FIREBASE_AUTH.currentUser.uid;

    //get data by id
    useEffect(() => {
        getDoc(doc(FIRESTORE_DB, 'users', uid)).then(docData => {
            if (docData.exists()) {
                //console.log("Here" + docData.data().username)
                setUsername(docData.data().username)
                setFName(docData.data().fName)
                setLName(docData.data().lName)
                setContactNumber(docData.data().contactNumber)
                setEmail(docData.data().email)
                setProfileImage(docData.data().profileImage)
            } else {

            }
        }).catch((error) => {
            console.log(error);
        });
    })


    //user profile 
    const [username, setUsername] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // const imagePick = () => {
    //     ImagePicker.openPicker({
    //         width: 150,
    //         height: 150,
    //         cropping: true
    //     }).then(image => {
    //         console.log(image);
    //     });
    // }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.imgContainer}>
                    <Image source={{ uri: profileImage }} style={styles.image} />
                    <TouchableOpacity style={styles.editImg}>
                        <MaterialCommunityIcons name="pencil" size={24} color="white" style={styles.editImgbtn} s />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <View style={styles.inputRow}>
                    <View style={[styles.inputLabel, { flex: 1, }]}>
                        <Text style={styles.inputLabelText}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='First Name'
                            onChangeText={setFName}
                            value={fName}
                        />
                    </View>
                    <View style={[styles.inputLabel, { flex: 1, }]}>
                        <Text style={styles.inputLabelText}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='First Name'
                            onChangeText={setLName}
                            value={lName}
                        />
                    </View>
                </View>
                <View style={styles.inputLabel}>
                    <Text style={styles.inputLabelText}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>
                <View style={styles.inputLabel}>
                    <Text style={styles.inputLabelText}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Contact Number'
                        onChangeText={setContactNumber}
                        value={contactNumber}
                    />
                </View>
                <View style={styles.inputLabel}>
                    <Text style={styles.inputLabelText}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>
            </View>

            <View style={styles.bottomBtnContainer}>
                <></>
                <TouchableOpacity style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnText}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingHorizontal: 10,
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    imgContainer: {
    },
    image: {
        height: 150,
        width: 150,
        borderWidth: 2,
        borderColor: '#0a75ad',
        borderRadius: 100,
        padding: 10,
    },
    editImg: {
        alignItems: 'flex-end',
        top: -30,
    },
    editImgbtn: {
        borderWidth: 1,
        borderRadius: 30,
        padding: 10,
        backgroundColor: '#0a75ad',
    },
    inputRow: {
        flexDirection: 'row',
    },
    inputSingle: {

    },
    inputLabel: {
        margin: 10,
    },
    inputLabelText: {
        fontSize: 18,
        marginVertical: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderRadius: 10,
        borderColor: '#e6e6fa',
        fontSize: 16,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: '#000080',
        fontWeight: 'bold',
    },
    bottomBtnContainer: {
        //flexDirection: 'row-reverse'
    },
    bottomBtn: {
        alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 20,
        marginHorizontal: 50,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#0a75ad',
    },
    bottomBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
})