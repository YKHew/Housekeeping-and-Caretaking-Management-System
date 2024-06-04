import React, { Component, useState, useEffect } from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet,
    Button, Text, View, Modal, Image,
    SectionList, StatusBar,
    Pressable, TouchableOpacity,
    TextInput, Alert,
} from 'react-native';

//firebase
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';


const ServiceDetailScreen = ({ route, navigation }) => {

    const service = route.params;
    console.log('info: ', service);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerImgContainer}>
                <Image source={{ uri: service.imgBg }} style={styles.headerImg} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailContainer}>
                    <View style={styles.detailInfo}>
                        <Text style={styles.detailTitle}>{service.title}</Text>
                        <Text style={styles.detailText}>{service.description}</Text>
                    </View>

                    <View style={styles.subDetailInfo}>
                        <Text style={styles.subDetailTitle}>Service Included</Text>
                        <FlatList
                            horizontal
                            data={service.areas}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.detailTaskContainer}>
                                    <Text style={styles.detailTaskTitle}>{item.area}</Text>

                                    <FlatList
                                        style={styles.detailTasks}

                                        data={item.tasks}
                                        renderItem={({ item }) => (
                                            <Text>
                                                <Text>-</Text>
                                                <Text style={styles.detailTaskText}>{item}</Text>
                                            </Text>
                                        )}
                                    />
                                </View>
                            )}
                        />
                    </View>


                    {/* <View>
                        <Text>Price</Text>
                    </View> */}

                </View>
            </ScrollView>
            <View style={styles.bottomBtn}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('SelectServiceProviderScreen', {
                        screen: 'SelectServiceProviderScreen',
                        params: service,
                    })
                }}>
                    <View style={styles.bookingBtn}>
                        <Text style={styles.bookingBtnText}>Booking Now</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ServiceDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        backgroundColor: '#0a75ad',
    },
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    headerImgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    headerImg: {
        height: 400,
        width: '100%',
    },
    detailContainer: {
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 60,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        backgroundColor: '#0a75ad',
    },
    detailInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'left',
    },
    detailTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    detailIcon: {
        backgroundColor: 'white',
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    detailText: {
        marginTop: 10,
        lineHeight: 22,
        fontSize: 16,
        color: 'white',
        flexWrap: 'wrap',
    },
    subDetailInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'left',
        marginVertical: 10,
        borderTopWidth: 1,
    },
    subDetailTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },

    detailTaskContainer: {
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        marginRight: 10,
        //marginHorizontal: 10,
        padding: 10,
        backgroundColor: '#e6e6fa',
        width: 500,
    },

    detailTaskTitle: {
        lineHeight: 22,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    detailTaskText: {
        fontSize: 16,
        flexWrap: 'wrap',
        marginHorizontal: 5,
    },
    tasksList: {
        flexDirection: 'column',
    },

    bottomBtn: {
        margin: 40,
        bottom: 0
    },
    bookingBtn: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookingBtnText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
})