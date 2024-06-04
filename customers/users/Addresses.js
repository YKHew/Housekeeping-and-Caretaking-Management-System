import React, { Component, useState } from 'react';
import {
    StyleSheet, Button, Text, View, Image, ImageBackground,
    SafeAreaView, TouchableOpacity, FlatList,
    Modal, Pressable,
    StatusBar, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect } from 'react';
import { async, stringLength } from '@firebase/util';
import { TextInput } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';

//Firebase
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, query, where, get } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import StateCity from '../../src/constants/stateCity';
import { startTransition } from 'react';

const AddressesScreen = ({ navigation }) => {
    const uid = FIREBASE_AUTH.currentUser.uid;
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        getDoc(doc(FIRESTORE_DB, 'users', uid)).then(docData => {
            if (docData.exists()) {
                const tagsArray = docData.data().addresses || [];
                setAddresses(tagsArray);
                console.log('address list: ', addresses)
            } else {
                console.log('Document not found!');
            }
        }).catch((error) => {
            console.error('Error fetching document:', error);
        });
    };


    const renderItem = ({ item }) => {
        return (
            <View style={styles.addressList}>
                <View style={styles.iconContainer}>
                    {
                        item.type == 'Home'
                            ? <Ionicons name="home-outline" size={24} color="#0a75ad" />
                            : <>
                                {
                                    item.type == 'Work'
                                        ? <MaterialIcons name="work-outline" size={24} color="#0a75ad" />
                                        : <Ionicons name="location-outline" size={24} color="#0a75ad" />
                                }
                            </>
                    }
                </View>
                <View style={styles.addressTextContainer}>
                    <Text style={styles.addressTypeText}>{item.type}</Text>
                    <Text style={styles.addressText}>{item.address}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Feather name="edit-2" size={24} color="#0a75ad"
                        style={styles.iconBtn}
                        onPress={() => Alert.alert('Edit: ', item.address)}
                    />
                    <Ionicons name="trash-outline" size={24} color="#0a75ad"
                        style={styles.iconBtn}
                        onPress={() => Alert.alert('Delete')}
                    />
                </View>

            </View>
        )
    }

    const [modalVisible, setModalVisible] = useState(false);

    const [street, setStreet] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [selectedState, setSelectedState] = useState(StateCity[0].state);
    const [selectedCity, setSelectedCity] = useState(StateCity.find(item => item.state === selectedState)?.city || []);

    const [type, setType] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const typeIcon = [
        {
            label: 'Home', icon: <Ionicons name="home-outline" size={24} color="#0a75ad" />
        },
        {
            label: 'Work', icon: <MaterialIcons name="work-outline" size={24} color="#0a75ad" />
        },
        {
            label: 'Other', icon: <Ionicons name="location-outline" size={24} color="#0a75ad" />
        },
    ]

    const handleTypeIconPress = (label) => {
        setSelectedType(label);
    }

    useEffect(() => {
        console.log(selectedType);
    }, [selectedType]);

    const isTypeIconSelected = (label) => selectedType === label;


    //Add Address----------------------------------------------------------
    const fullAddress = unitNumber + ', ' + street + ', ' + postalCode + ', ' + selectedCity + ', ' + selectedState;

    const [addAddresses, setAddAddresses] = useState([]);

    const onSelectState = (item) => {
        console.log(item)
    }
    const onSelectCity = (item) => {
        console.log(item)
    }

    const addNewAddress = async () => {
        console.log(fullAddress);
        const newAddressArr = {
            address: fullAddress,
            type: selectedType,
            // unitNumber: unitNumber,
            // street: street,
            // postalCode: postalCode,
            // city: selectedCity,
            // state: selectedState
        }

        //const newAddress = [...addAddresses, addressArr];
        console.log('newAddress: ', newAddressArr)

        try {
            // Fetch the existing array from Firestore
            await getDoc(doc(FIRESTORE_DB, 'users', uid)).then(docData => {
                if (docData.exists()) {
                    // If the document exists, get the existing addresses array or initialize it
                    const existingArray = docData.data().addresses || [];
                    console.log(existingArray);

                    // Add the new address to the existing addresses array
                    //const updatedAddresses = [...existingArray, newAddress];

                    // Update the Firestore document with the updated addresses array
                    try {
                        updateDoc(doc(FIRESTORE_DB, 'users', uid), {
                            addresses: arrayUnion(newAddressArr)
                        });
                        console.log('Address added successfully!');
                        Alert.alert('Address added successfully!');
                        fetchAddresses();

                    } catch (error) {
                        console.error('Error adding address:', error);
                        Alert.alert('Error adding address:', error);
                    }

                } else {
                    // If the document doesn't exist, create it with the new address
                    try {
                        setDoc(doc(FIRESTORE_DB, 'users', uid), {
                            addresses: newAddressArr
                        }, {
                            merge: true
                        });
                        console.log('Address added successfully!');
                        Alert.alert('Address added successfully!');
                    } catch (error) {
                        console.error('Error adding address:', error);
                        Alert.alert('Error adding address:', error);
                    }
                }


            })
        } catch (error) {
            console.error('Error adding address:', error);
        }
    }

    const resetInput = () => {
        setStreet(''),
            setUnitNumber(''),
            setPostalCode(''),
            setSelectedState(''),
            setSelectedCity('')
    }

    //Edit Address----------------------------------------------------------
    //onPress={() => setModalVisible(true)}



    //Delete Address----------------------------------------------------------

    return (
        <SafeAreaView style={[styles.container, modalVisible ? { backgroundColor: 'rgba(0,0,0,0.5)' } : '']}>

            <FlatList
                data={addresses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
            <View style={styles.bottomBtnContainer}>
                <TouchableOpacity style={styles.bottomBtn}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.bottomBtnText}>Add New Address</Text>
                </TouchableOpacity>
            </View>

            {/* -----------------Add Address Modal----------------- */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalViewContainer}>
                    <View style={styles.modalView}>
                        <View style={styles.formView}>
                            <Text style={styles.modalText}>Street</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Street / Building Name'
                                onChangeText={setStreet}
                                value={street}
                            />
                        </View>

                        <View style={styles.formView}>
                            <Text style={styles.modalText}>Unit / House No.</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Unit / House No.'
                                onChangeText={setUnitNumber}
                                value={unitNumber}
                            />
                        </View>

                        <View style={styles.formView}>
                            <Text style={styles.modalText}>Postal Code</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Postal Code'
                                onChangeText={setPostalCode}
                                value={postalCode}
                            />
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.formPickerView}>
                                <Text style={styles.modalText}>State</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => [setSelectedState(itemValue), onSelectState(itemValue)]}
                                        selectedValue={selectedState}
                                    >
                                        <Picker.Item label='State' value='' enabled={false} />
                                        {
                                            StateCity.map((item, index) => (
                                                <Picker.Item key={index} label={item.state} value={item.state} />
                                            ))
                                        }
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.formPickerView}>
                                <Text style={styles.modalText}>City</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => [setSelectedCity(itemValue), onSelectCity(itemValue)]}
                                        selectedValue={selectedCity}
                                    >
                                        <Picker.Item label='City' value='' enabled={false} />
                                        {
                                            StateCity.find(item => item.state === selectedState)?.city.map((city, index) => (
                                                <Picker.Item key={index} label={city} value={city} />
                                            ))
                                        }
                                    </Picker></View>
                            </View>
                        </View>

                        <View style={styles.formView}>
                            <Text>Add a label</Text>
                            <View style={styles.label}>
                                {
                                    typeIcon.map((icon, index) => (
                                        <View style={styles.typeIconContainer}>
                                            <TouchableOpacity
                                                style={[styles.typeIcon, isTypeIconSelected(icon.label) ? { backgroundColor: '#0a75ad' } : {}]}
                                                key={index}
                                                onPress={() => handleTypeIconPress(icon.label)}
                                            >
                                                {
                                                    React.cloneElement(icon.icon, {
                                                        color: isTypeIconSelected(icon.label) ? 'white' : '#0a75ad'
                                                    })
                                                }

                                            </TouchableOpacity>
                                            <Text style={styles.modalText}>{icon.label}</Text>
                                        </View>
                                    ))

                                }

                            </View>
                        </View>


                        <View style={styles.modalBtnContainer}>
                            <Pressable
                                style={[styles.bottomBtn, styles.modalBtn]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.bottomBtnText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.bottomBtn, styles.modalBtn]}
                                onPress={() => {
                                    [
                                        addNewAddress(),
                                        resetInput(),
                                        setModalVisible(!modalVisible),
                                        navigation.replace('AddressesScreen')
                                    ]
                                }}
                            >
                                <Text style={styles.bottomBtnText}>Save</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>

        </SafeAreaView >
    )
}

export default AddressesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    addressList: {
        flexDirection: 'row',
        marginVertical: 1,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#e6e6fa',
    },
    iconContainer: {

        justifyContent: 'center',
        padding: 10,

    },
    addressTextContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    addressTypeText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    addressText: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginHorizontal: 5,
        padding: 5,
    },
    bottomBtnContainer: {
        margin: 10,
    },
    bottomBtn: {
        margin: 10,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#0a75ad',
    },
    bottomBtnText: {
        fontSize: 18,
        color: 'white',
    },

    modalViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    modalView: {
        //margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        //padding: 10,
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
    formView: {
        //width: '100%',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        //alignItems: 'center',
    },
    formPickerView: {
        //flexDirection: 'row',
        //width: '100%',
        marginHorizontal: 20,
        //marginVertical: 5,
        padding: 10,
        //alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
    },
    input: {
        //width: 300,
        //margin: 12,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,

    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
    },
    picker: {
        width: 150,
    },
    label: {
        flexDirection: 'row'
    },
    typeIconContainer: {
        backgroundColor: 'white',
        alignItems: 'center',
    },
    typeIcon: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#e6e6fa',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalBtnContainer: {
        flexDirection: 'row',
    },
    modalBtn: {
        flex: 1,
    },
})