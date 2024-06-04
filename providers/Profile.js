import React, { Component, useState } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert,
} from 'react-native';

//Firebase
import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useEffect } from 'react';

const ProfileScreenProvider = ({ navigation }) => {
    const uid = FIREBASE_AUTH.currentUser.uid;

    const auth = getAuth();
    const HANDLESIGNOUT = () => {
        signOut(auth)
            .then(() => {
                navigation.replace('SignInScreen')
            })
            .catch(error => alert(error.message))
    }

    const [profile, setProfile] = useState([]);

    //get data by id
    useEffect(() => {
        const fetchProfile = async () => {
            console.log('hello: ');
            getDoc(doc(FIRESTORE_DB, 'users', uid)).then((docData) => {
                if (docData.exists()) {
                    console.log('ClientPP: ', docData.data());
                    setProfile(docData.data());
                }
            })
        };
        fetchProfile();
    }, [])

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
            </View>
            <View style={styles.header}>
                <Image
                    source={{ uri: profile.profileImage }}
                    resizeMode="contain"
                    style={{
                        height: 155,
                        width: 155,
                        borderRadius: 999,
                        borderColor: '#b0e0e6',
                        borderWidth: 5,
                        marginTop: -90,
                        backgroundColor: 'white',
                    }}
                />
                <Text style={styles.profileName}>{profile.username}</Text>
                <Text style={styles.joinDate}>Jul 2023</Text>
            </View>

            <ScrollView style={styles.infoSection}>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => Alert.alert('Add Screen')}>
                    <View style={styles.button}>
                        <Entypo name="edit" size={24} color="black" />
                    </View>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('WorkingHoursScreen')} >
                    {/* navigation.navigate('AddressesScreen') */}
                    <View style={styles.button}>
                        <MaterialCommunityIcons name="clock" size={24} color="black" />
                    </View>
                    <Text style={styles.buttonText}>Working Hours</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer} onPress={() => Alert.alert('Add Screen')} >
                    <View style={styles.button}>
                        <Ionicons name="key-sharp" size={24} color="black" />
                    </View>
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={[styles.infoSection, {marginVertical: 20,}]}>
                <TouchableOpacity style={styles.buttonContainer} onPress={HANDLESIGNOUT} >
                    <View style={styles.button}>
                        <MaterialCommunityIcons name="logout" size={24} color="black" />
                    </View>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>


    );

}

export default ProfileScreenProvider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        //flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    infoSection: {
        margin: 10,
        paddingHorizontal: 20,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 5,
    },
    joinDate: {
        fontSize: 20,
        textAlign: 'center',
    },
    buttonSection: {
        flexDirection: 'row',
        marginVertical: 10,
        width: '100%',
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        //paddingVertical: 10,
        marginVertical: 10,
        alignItems: 'center',
        //marginVertical: 5,
    },
    button: {
        padding: 10,
        backgroundColor: '#b0e0e6',
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 20,
        marginHorizontal: 20,

    },
    receipientImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'red',
        marginLeft: 10,
        //flex: 1,
    },
    list: {
        padding: 10,
        width: '100%',
        //height: '100%',
        backgroundColor: 'white',
        flex: 1,
    },
    listView: {
        //flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 80,
        borderRadius: 10,
        borderWidth: 1,
        alignSelf: 'center',
        //justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: 'white',
    },
    listDetails: {
        margin: 10,
        flex: 1,
        flexDirection: 'column',
    },
    listDetailsSub: {
        marginHorizontal: 5,
    },
    listIcon: {
        marginHorizontal: 5,
        padding: 20,
    },
    receipientList: {
        marginVertical: 10,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        flex: 1,
    },
});
