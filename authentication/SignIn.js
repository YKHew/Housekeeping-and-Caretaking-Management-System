import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert, TextComponent,
} from 'react-native';

//Firebase
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

//Icon
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native-paper';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [eyeIcon, setEyeIcon] = useState('eye-off-outline');

    const [loading, setLoading] = useState(false);


    //Firebase Authentication
    const [uid, setUid] = useState('')

    const signIn = async () => {

        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        setLoading(true);

        if (email == '' || password == '') {
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

        } else {
            
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    //get data by id
                    getDoc(doc(FIRESTORE_DB, 'users', user.uid))
                        .then(docData => {
                            if (docData.exists()) {
                                onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
                                    if (authUser) {
                                        if (docData.data().role == 'Client') {
                                            navigation.replace('Home');
                                        } else if (docData.data().role == 'Provider') {
                                            navigation.replace('P_Home Tab');
                                        }
                                    }
                                });
                            } 
                        }).catch((error) => {
                            console.log(error);
                        });
                })
                .catch(error => alert(error.message))
                .finally(() => setLoading(false)); 
                
                // Turn off loading spinner
        }


    }

    //const uid = FIREBASE_AUTH.currentUser.uid;
    const [role, setRole] = useState('');

    //get data by id
    // getDoc(doc(FIRESTORE_DB, 'users', uid))
    //     .then(docData => {
    //         console.log(uid);
    //         // if (docData.exists()) {
    //         //     //console.log("Here" + docData.data().username)
    //         //     //setUsername(docData.data().username)
    //         //     console.log(uid);
    //         // } else {

    //         // }
    //     }).catch((error) => {
    //         console.log(error);
    //     });




    //Password Visibility
    const handlePasswordVisibility = () => {
        if (eyeIcon === 'eye-outline') {
            setEyeIcon('eye-off-outline');
            setPasswordVisibility(!passwordVisibility);
        } else if (eyeIcon === 'eye-off-outline') {
            setEyeIcon('eye-outline');
            setPasswordVisibility(!passwordVisibility);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../src/images/logo.png')} style={styles.logo} />
            </View>
            <View style={styles.signInContainer}>
                <View style={styles.emailSignIn}>
                    <TextInput
                        name="email"
                        placeholder='Email'
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        setValue={setEmail}
                        style={styles.input}
                    ></TextInput>
                </View>
                <View style={styles.passwordSignIn}>
                    <TextInput
                        name="password"
                        placeholder='Password'
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        setValue={setPassword}
                        secureTextEntry={passwordVisibility}
                        style={styles.input}
                    ></TextInput>
                    <Pressable onPress={handlePasswordVisibility} style={styles.eyeIcon}>
                        <MaterialCommunityIcons name={eyeIcon} size={24} color="black" />
                    </Pressable>
                </View>

                {loading ? (
                    <ActivityIndicator size='large' color='#0000ff' />
                ) : (
                    <TouchableOpacity onPress={signIn}>
                        <View style={styles.signInBtnContainer}>
                            <Text style={styles.btn}>Sign In</Text>
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => { navigation.navigate('ForgotPasswordScreen') }} style={styles.forgotPasswordBtnContainer}>
                    <Text style={styles.btn} >Forgot Password</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomBtnContainer}>
                <Text style={styles.bottomBtnText}>
                    Don't have an account?
                    <Text style={styles.bottomBtn} onPress={() => { navigation.navigate('SignUpScreen') }}> SIGN UP </Text>
                    Now
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: '#F5FCFF',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
    },
    logo: {
        height: 300,
        width: '100%',
    },
    signInContainer: {

    },
    emailSignIn: {
        backgroundColor: 'white',
        borderBlockColor: '#e8e8e8',
        borderBottomWidth: 3,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    input: {
        fontSize: 20,
        width: '90%',
    },
    passwordSignIn: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBlockColor: '#e8e8e8',
        borderBottomWidth: 3,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    eyeIcon: {
        marginHorizontal: 10,
    },
    signInBtnContainer: {
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
    forgotPasswordBtnContainer: {
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: '#0a75ad',
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