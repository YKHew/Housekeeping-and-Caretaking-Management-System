import React, { Component, useState } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const BabySittingScheduleScreen = () => {

    return (
        <Text>This is the BabySitting content within step 2!</Text>
    )
}

export default BabySittingScheduleScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //height: '100%',
        //justifyContent: 'center',
        alignItems: 'justify',
        backgroundColor: '#F5FCFF',
        paddingHorizontal: 10,

    },
    progressContainer: {
        flex: 1,
    },
    progressContent: {
        alignItems: 'justify',
    },
    sectionContainer: {
        flexDirection: 'column',
        margin: 10,
    },
    selectedService: {
        borderWidth: 1,
        borderColor: '#d2d2d2',
        borderRadius: 10,
        alignItems: 'center',
        padding: 5,
    },
    address: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#d2d2d2',
        borderRadius: 10,
        alignItems: 'center',
        //justifyContent: 'center',
        padding: 5,
    },
    addressEdit: {
        flexDirection: 'column',
        marginHorizontal: 10,
    },
    addressEditBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    datePicker: {
        //flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderColor: "#d2d2d2",
        borderWidth: 1,
        borderRadius: 10,
    },

    schedule: {
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        //justifyContent: 'center',
        //padding: 5,
    },
    scheduleBtnList: {
        flexDirection: 'row',

    },
    scheduleBtn: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d2d2d2',
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
    },

    //Font Size
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContent: {
        width: '100%',
        fontSize: 18,
    },
    sectionBtn: {
        marginHorizontal: 10,
        fontSize: 16,
    },
})