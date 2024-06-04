import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet, Button, Text, View, Image, ImageBackground,
    SafeAreaView, TouchableOpacity, FlatList, ScrollView,
    useWindowDimensions,
    StatusBar, TextInput,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { styles } from './styles/Profile';

//Firebase
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes, } from "firebase/storage";
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from '../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { MediaTypeOptions } from 'expo-image-picker';


const ProfileScreen = ({ navigation }) => {

    const uid = FIREBASE_AUTH.currentUser.uid;
    const storage = FIREBASE_AUTH.storageBU

    const [profile, setProfile] = useState([]);

    const [username, setUsername] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const [imageURI, setImageURI] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);


    //get data by id
    useEffect(() => {
        const fetchClient = async () => {
            getDoc(doc(FIRESTORE_DB, 'users', uid)).then((docData) => {
                if (docData.exists()) {
                    setProfile(docData.data());
                    setUsername(docData.data().username)
                    setFName(docData.data().fName)
                    setLName(docData.data().lName)
                    setContactNumber(docData.data().contactNumber)
                    setEmail(docData.data().email)

                    setProfileImage(docData.data().profileImage)
                }
            }).catch((error) => {
                console.log(error);
            });
        };
        fetchClient();
    }, [])

    const selectImage = async () => {
        // No permissions request is necessary for launching the image library
        //     let selectedImage = await ImagePicker.launchImageLibraryAsync({
        //         mediaTypes: ImagePicker.MediaTypeOptions.All,
        //         allowsEditing: true,
        //         aspect: [4, 3],
        //         quality: 1,
        //     });

        //     console.log(selectedImage);

        //     if (!selectedImage.canceled) {
        //         setProfileImage(selectedImage.assets[0].uri);
        //     }
    }

    const handleSaveBtn = async () => {
        //console.log('save', profileImage)
        try {
            // const response = await fetch(profileImage);
            // const blob = await response.blob();
            // // const snapshot = await uploadBytes(imageRef, blob);
            // // const downloadURL = await getDownloadURL(snapshot.ref);

            // const storageRef = FIREBASE_STORAGE.ref().child(`clients/${uid}`);
            // await storageRef.put(blob);
            // const downloadURL = await storageRef.getDownloadURL();


            await updateDoc(doc(FIRESTORE_DB, 'users', uid), {
                fName: fName,
                lName: lName,
                username: username,
                contactNumber: contactNumber,
                profileImage: profileImage
            })

            alert("Profile Updated Successfull!");
        } catch (error) {
            console.log(error);
            alert("Profile Update Failed!", error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='gray' />
            <View style={{ width: "100%" }}>
                <Image
                    source={require('../src/images/profileBg.jpg')}
                    resizeMode="cover"
                    style={{
                        height: 100,
                        width: "100%",
                    }}
                />
            </View >
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    {
                        profileImage
                            ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    //resizeMode="contain"
                                    style={styles.image}
                                />
                            ) : (
                                <Image
                                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/housekeeping-and-caretaking.appspot.com/o/defaults%2Fuser.png?alt=media&token=0903722e-160f-4cc5-9725-a0f035b375e3' }}
                                    style={styles.image}
                                />
                            )
                    }

                    <TouchableOpacity style={styles.editImg} onPress={selectImage}>
                        <MaterialCommunityIcons name="pencil" size={24} color="white" style={styles.editImgbtn} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.infoSection}>
                <View style={styles.inputContainer}>
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
                            editable={false}
                        />
                    </View>
                </View>

                <View style={styles.bottomBtnContainer}>
                    <TouchableOpacity style={styles.bottomBtn} onPress={handleSaveBtn} >
                        <Text style={styles.bottomBtnText}>SAVE</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );

}

export default ProfileScreen;