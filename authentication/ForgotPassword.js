import React, { Component, useState } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert,
    ActivityIndicator,
} from 'react-native';

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import Ionicons from 'react-native-vector-icons/Ionicons';


const ForgotPasswordScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    //Firebase Authentication
    const auth = getAuth();

    const forgotPassword = () => {
        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Email sent with: ' + user.email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.emailInputContainer}>
                <View style={styles.message}>
                    <Text style={styles.messageTitle}>Reset Password</Text>
                    <Text style={styles.messageText}>
                        Enter the email address when you used to joined and we'll send you an email to reset your password.
                    </Text>
                </View>
                <View style={styles.emailInput}>
                    <Ionicons name="mail-outline" size={24} color="black" style={{ margin: 5, }} />
                    <TextInput
                        name="email"
                        placeholder='Email'
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        setValue={setEmail}
                        style={styles.input}
                    ></TextInput>
                </View>
            </View>


            {loading ? (
                <ActivityIndicator size='large' color='#0000ff' />
            ) : (
                <TouchableOpacity
                    style={styles.resetBtnContainer}
                    onPress={forgotPassword}
                >
                    <Text style={styles.resetBtn}>Send Email to Reset Password</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    )
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: '#F5FCFF',
    },
    emailInputContainer: {
        marginHorizontal: 20,
    },
    message: {
        marginVertical: 20,
    },
    messageTitle: {
        fontWeight: 'bold',
        fontSize: 32,
    },
    messageText: {
        fontSize: 20,
        marginVertical: 10,
    },
    emailInput: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBlockColor: '#e8e8e8',
        borderBottomWidth: 3,
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    input: {
        justifyContent: 'center',
        fontSize: 20,
        width: '80%',
        marginHorizontal: 10,
    },
    resetBtnContainer: {
        backgroundColor: '#0a75ad',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    resetBtn: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
})