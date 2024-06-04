import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image, ActivityIndicator,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert, TextComponent,
} from 'react-native';

//firebase
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from '../firebaseConfig';

//Icon
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SignUpScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [category, setCategory] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [regDate, setRegDate] = useState('');

    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
    const [eyeIcon, setEyeIcon] = useState('eye-off-outline');
    const [eyeIcon1, setEyeIcon1] = useState('eye-off-outline');

    const [loading, setLoading] = useState(false);

    const [imageURI, setImageURI] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const profileImage = require('../authentication/src/user.png');

    //Password Visibility
    const handlePasswordVisibility = () => {
        if (eyeIcon === 'eye-outline') {
            setEyeIcon('eye-off-outline');
            setPasswordVisibility(!passwordVisibility);
        } else if (eyeIcon === 'eye-off-outline') {
            setEyeIcon('eye-outline');
            setPasswordVisibility(!passwordVisibility);

        } else if (eyeIcon1 === 'eye-outline') {
            setEyeIcon1('eye-outline');
            setConfirmPasswordVisibility(!confirmPasswordVisibility);
        } else if (eyeIcon1 === 'eye-off-outline') {
            setEyeIcon1('eye-outline');
            setConfirmPasswordVisibility(!confirmPasswordVisibility);
        };
    }

    //Firebase Authentication
    const [currentUser, setCurrentUser] = useState();

    // useEffect(() => {
    //     onAuthStateChanged(FIREBASE_AUTH, (user) => {
    //         if (user) {
    //             setCurrentUser(user)
    //         }
    //     })
    // })

    const signUp = async () => {

        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactNumberFormat = /^\d{10,11}$/;

        setLoading(true);
        if (firstName == '' || lastName == '' || username == '' || contactNumber == '' || email == '' || password == '' || confirmPassword == '') {
            Alert.alert(
                "Invalid Input",
                "Please fill in all the required fields.", [{
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }, { text: "OK", onPress: () => console.log("OK Pressed") }
            ], { cancelable: false }
            );
            setLoading(false); // Turn off loading spinner

        } else if (password !== confirmPassword) {
            Alert.alert(
                "Password Mismatch",
                "Password and Confirmation Password do not match.", [{
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }, { text: "OK", onPress: () => console.log("OK Pressed") }
            ], { cancelable: false }
            );
            setLoading(false); // Turn off loading spinner

        } else if (!email.match(emailFormat)) {
            Alert.alert(
                "Invalid Email Format",
                "Please enter a valid email address.", [{
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }, { text: "OK", onPress: () => console.log("OK Pressed") }
            ], { cancelable: false }
            );
            setLoading(false); // Turn off loading spinner

        } else if (!contactNumber.match(contactNumberFormat)) {
            Alert.alert(
                "Invalid Contact Number",
                "Please enter a valid contact number with 10-11 digits.", [{
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }, { text: "OK", onPress: () => console.log("OK Pressed") }
            ], { cancelable: false }
            );
            setLoading(false); // Turn off loading spinner

        } else {

            createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
                .then(async (userCredentials) => {
                    const user = userCredentials.user;
                    const uid = FIREBASE_AUTH.currentUser.uid;

                    try {
                        await setDoc(doc(FIRESTORE_DB, 'users', user.uid), {
                            uid: uid,
                            fName: firstName,
                            lName: lastName,
                            username: username,
                            role: 'Client',
                            contactNumber: contactNumber,
                            email: email,
                            password: password,
                            regDate: new Date().getDate(),
                            profileImage: '',
                            address: [],
                        })
                        alert("User account created successfully!")

                        // Set a loading duration before navigating to SignInScreen
                        setTimeout(() => {
                            navigation.replace('SignInScreen');
                        }, 2000);   // 5000 milliseconds (5 seconds) delay


                    } catch (e) {
                    };
                })
                .catch(error => alert(error.message))
                .finally(() => setLoading(false)); // Turn off loading spinner
        }
        //setLoading(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Create An Account</Text>
                </View>
                <View style={styles.signUpContainer}>
                    <View style={styles.nameContainer}>
                        <View style={styles.textName}>
                            <TextInput
                                name="fname"
                                placeholder='First Name'
                                value={firstName}
                                onChangeText={text => setFirstName(text)}
                                //setValue={setFirstName}
                                style={styles.inputName}
                            />
                        </View>
                        <View style={styles.textName}>
                            <TextInput
                                name="lname"
                                placeholder='Last Name'
                                value={lastName}
                                onChangeText={text => setLastName(text)}
                                //setValue={setLastName}
                                style={styles.inputName}
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInput}>
                            <TextInput
                                name="username"
                                placeholder='Username'
                                value={username}
                                onChangeText={text => setUsername(text)}
                                //setValue={setUsername}
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.textInput}>
                            <TextInput
                                name="email"
                                placeholder='Email'
                                value={email}
                                onChangeText={text => setEmail(text)}
                                // setValue={setEmail}
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.textInput}>
                            <TextInput
                                name="contactNumber"
                                placeholder='Contact Number'
                                value={contactNumber}
                                onChangeText={text => setContactNumber(text)}
                                // setValue={setContactNumber}
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.passwordInput}>
                            <TextInput
                                name="password"
                                placeholder='Password'
                                value={password}
                                onChangeText={text => setPassword(text)}
                                //setValue={setPassword}
                                secureTextEntry={passwordVisibility}
                                style={styles.passwordText}
                            />
                            <Pressable onPress={handlePasswordVisibility} style={styles.eyeIcon}>
                                <MaterialCommunityIcons name={eyeIcon} size={24} color="black" />
                            </Pressable>
                        </View>
                        <View style={styles.passwordInput}>
                            <TextInput
                                name="confirmPassword"
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChangeText={text => setConfirmPassword(text)}
                                //setValue={setConfirmPassword}
                                secureTextEntry={confirmPasswordVisibility}
                                style={styles.passwordText}
                            />
                            <Pressable onPress={handlePasswordVisibility} style={styles.eyeIcon}>
                                <MaterialCommunityIcons name={eyeIcon1} size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={styles.btnContainer}>

                    {loading ? (
                        <ActivityIndicator size='large' color='#0000ff' />
                    ) : (
                        <TouchableOpacity onPress={signUp}>
                            <View style={styles.signUpBtnContainer}>
                                <Text style={styles.btn}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View style={styles.bottomBtnContainer}>
                        <Text style={styles.bottomBtnText}>
                            Already have an account?
                            <Text style={styles.bottomBtn} onPress={() => { navigation.navigate('SignInScreen') }}> SIGN IN </Text>
                            Now
                        </Text>
                    </View>
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    signUpContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    nameContainer: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',

    },
    textName: {
        backgroundColor: 'white',
        borderBlockColor: '#e8e8e8',
        borderBottomWidth: 3,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        alignItems: 'left',
        width: '45%'
    },
    inputName: {
        fontSize: 20,
        width: '100%',
        marginHorizontal: 5,
    },
    inputContainer: {
        width: '100%',
    },
    textInput: {
        backgroundColor: 'white',
        borderBlockColor: '#e8e8e8',
        borderBottomWidth: 3,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 5,
        alignItems: 'left',
    },
    inputText: {
        width: '100%',
        fontSize: 20,
    },
    passwordInput: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBlockColor: '#e8e8e8',
        borderBottomWidth: 3,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginVertical: 10,
        marginHorizontal: 5,
    },
    passwordText: {
        fontSize: 20,
        width: '90%',
        marginHorizontal: 5,
    },
    eyeIcon: {
        //marginHorizontal: 5,
    },
    btnContainer: {
        marginVertical: 20,
    },
    signUpBtnContainer: {
        backgroundColor: '#0a75ad',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    btn: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    bottomBtnContainer: {
        marginVertical: 50,
    },
    bottomBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomBtn: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a75ad',
        marginHorizontal: 50,

    },
})