import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet, Button, Text, View, Image,
    SafeAreaView, Pressable, ScrollView,
    ActivityIndicator, RefreshControl,
    FlatList, TouchableWithoutFeedback, TouchableOpacity,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Icon, SearchBar } from '@rneui/themed';

//Firebase
import { collection, doc, getDoc, getDocs, query, where, get, documentId, QuerySnapshot } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

// Example
const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';
const API_ENDPOINT2 = 'https://randomuser.me/api/?results=5';

import Staffs from '../src/constants/staffs';

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from '@rneui/base';

const SearchScreen = ({ route, navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filteredDataSource, setFilteredDataSource] = useState([])
    const [search, setSearch] = useState('');

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');

    const [providers, setProvides] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);

    //get all services
    useEffect(() => {
        const fetchServices = async () => {
            await getDocs(collection(FIRESTORE_DB, 'services'))
                .then((querySnapshot) => {
                    const servicesArr = [];
                    querySnapshot.forEach((doc) => {
                        servicesArr.push({ id: doc.id, ...doc.data() });
                        //console.log('Services: ', doc.data());
                    });
                    setServices(servicesArr);
                    setFilteredDataSource(servicesArr);
                    //console.log('Services: ', servicesArr);
                })
        };
        fetchServices();
    }, []);


    const ServicesList = ({ service }) => {
        return (
            <TouchableOpacity style={[styles.pressable, isServiceBtnSelected(service.id) ? { backgroundColor: '#0a75ad' } : {}]}
                onPress={() => selectService(service.id)}
            >
                {
                    service.title === 'Cleaning' && (
                        <Text style={[styles.category, isServiceBtnSelected(service.id) ? { color: 'white' } : {}]}>
                            <MaterialCommunityIcons name='broom' size={24} />
                            Cleaning
                        </Text>
                    )
                }
                {
                    service.title === 'Baby Sitting' && (
                        <Text style={[styles.category, isServiceBtnSelected(service.id) ? { color: 'white' } : {}]}>
                            <MaterialCommunityIcons name='human-baby-changing-table' size={24} />
                            Baby Sitting
                        </Text>
                    )
                }
                {
                    service.title === 'Pet Sitting' && (
                        <Text style={[styles.category, isServiceBtnSelected(service.id) ? { color: 'white' } : {}]}>
                            <MaterialIcons name='pets' size={24} />
                            Pet Sitting
                        </Text>
                    )
                }
                {
                    service.title === 'Cooking' && (
                        <Text style={[styles.category, isServiceBtnSelected(service.id) ? { color: 'white' } : {}]}>
                            <MaterialCommunityIcons name="chef-hat" size={24} />
                            Cooking
                        </Text>
                    )
                }
                {
                    service.title === 'Maternity Care' && (
                        <Text style={[styles.category, isServiceBtnSelected(service.id) ? { color: 'white' } : {}]}>
                            <MaterialCommunityIcons name="account-child" size={24} />
                            Maternity Care
                        </Text>
                    )
                }
                {
                    service.title === 'Senior Care' && (
                        <Text style={[styles.category, isServiceBtnSelected(service.id) ? { color: 'white' } : {}]}>
                            <MaterialCommunityIcons name="human-wheelchair" size={24} />
                            Senior Care
                        </Text>
                    )
                }
                {
                    service.title === 'Personal Care' && (
                        <Text style={[styles.category, isServiceBtnSelected(service.id) ? { color: 'white' } : {}]}>
                            <MaterialCommunityIcons name="human-wheelchair" size={24} />
                            Personal Care
                        </Text>
                    )
                }
            </TouchableOpacity>

        )
    }
    const isServiceBtnSelected = (service) => selectedService === service;

    const selectService = (service) => {
        // Toggle the selection of the service button
        if (selectedService === service) {
            setSelectedService('');
            setFilteredProviders(providers);

        } else {
            setSelectedService(service);
            const filtered = providers.filter((provider) =>
                // Assuming services is an array in provider data
                provider.category.includes(service)
            );
            setFilteredProviders(filtered);
        }
    }



    //get all providers
    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        await getDocs(query(collection(FIRESTORE_DB, 'users'), where('role', '==', 'Provider')))
            .then((querySnapshot) => {
                const providersArr = [];
                querySnapshot.forEach((doc) => {
                    providersArr.push({ id: doc.id, ...doc.data() });
                    //console.log('Providers: ', doc.data());
                });
                providersArr.sort((a, b) => a.fName.localeCompare(b.fName));
                setProvides(providersArr);
                setFilteredProviders(providersArr);
            })
    };


    const searchFilter = (text) => {
        //Check if searched text is not blank
        if (text) {
            //Inserted text is not blank
            const filtered = providers.filter((provider) =>
                provider.fName.toLowerCase().includes(text.toLowerCase()) ||
                provider.lName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredProviders(filtered);
            setSearch(text);
        } else {
            //Inserted text is blank
            setFilteredProviders(providers);
            setSearch(text);
        }
    };

    const ItemView = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => getItem(item)}>
                <View style={{ flexDirection: 'row', }} >
                    <Text style={styles.itemStyle}>
                        {item.id}
                    </Text>
                    <Text style={styles.itemStyle}>
                        {item.title.toUpperCase()}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const ItemSeparatorView = () => {
        return (
            <View style={styles.itemSeparator} />
        );
    };

    const getItem = (item) => {
        alert('Id: ' + item.id + 'Title: ' + item.title);
    };

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size={'large'} color="#5500dc" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loading}>
                <Text>Error in fetching data... Please check your internet connect: </Text>
            </View>
        )
    }

    const StaffsList = ({ staff }) => {
        const setviceTitle = services.find(service => service.id === staff.category)?.title;
        return (
            <TouchableOpacity style={styles.staffListContainer}
                onPress={() => {
                    navigation.navigate('StaffInfoScreen', {
                        screen: 'StaffInfoScreen',
                        params: staff
                    })
                }}>
                <Image source={{ uri: staff.profileImage }} style={styles.staffImg} />
                <View>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{staff.fName} {staff.lName}</Text>
                        <Text style={{ fontSize: 16 }}>{setviceTitle}</Text>
                    </View>

                    <View style={styles.staffInfoContainer}>
                        <View style={styles.staffInfo}>
                            <Text style={styles.staffInfoText}>Job</Text>
                            <Text style={styles.staffInfoText}>{staff.workedHours} hrs</Text>
                        </View>
                        <View style={styles.staffInfo}>
                            <Text style={styles.staffInfoText}>Rating</Text>
                            <Text style={styles.staffInfoText}>{staff.rate}</Text>
                        </View>

                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    //pull to refresh
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = () => {
        // Simulate a reload action with a timeout
        fetchProviders();
        setTimeout(() => {
            // After the reload is complete, set refreshing to false
            setRefreshing(false);
        }, 2000); // You can replace this with your actual reload logic
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />}
            onScroll={(e) => {
                // Example: Detect scrolling and trigger refresh when scrolled to the top
                const scrollY = e.nativeEvent.contentOffset.y;
                if (scrollY <= 0) {
                    setRefreshing(true);
                    handleRefresh();
                }
            }}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.search}>
                    <SearchBar
                        value={search}
                        onChangeText={(text) => searchFilter(text)}
                        placeholder="Search"

                        //style
                        containerStyle={{
                            backgroundColor: 'white',
                            borderBottomColor: 'transparent',
                            borderTopColor: 'transparent'
                        }}
                        inputContainerStyle={{
                            backgroundColor: 'white',
                            borderBottomWidth: 2,
                            borderBottomColor: '#000080',
                            //borderTopColor: 'transparent'
                        }}
                        inputStyle={{
                            backgroundColor: 'white',
                        }}
                    />

                    <FlatList
                        data={services}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <ServicesList service={item} />}
                    />
                </View>

                <FlatList
                    style={styles.searchedList}
                    showsVerticalScrollIndicator={false}
                    data={filteredProviders}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={({ item }) => <StaffsList staff={item} />}
                />
            </SafeAreaView>

        </ScrollView>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    button: {
        margin: 10,
    },
    search: {

    },
    searchBar: {
        padding: 5,
        margin: 5,
        //flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#000080",
        borderBottomWidth: 2,
        borderRadius: 10,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 5,
        fontSize: 15,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollViewContent: {
        flexGrow: 1,
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    scrollableContent: {
        fontSize: 20,
        padding: 20,
        textAlign: 'center',
    },



    staffListContainer: {
        flexDirection: 'row',
        padding: 10,
        flexWrap: 'wrap',
        borderWidth: 2,
        borderRadius: 30,
        margin: 10,
    },
    staffImg: {
        height: 100,
        width: 70,
        marginHorizontal: 10,
    },
    staffInfoContainer: {
        flexDirection: 'row',
    },
    staffInfo: {
        flexDirection: 'column',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    staffInfoText: {
        alignItems: 'center',
    },


    itemSeparator: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'blue',
    },
    items: {
        flex: 1,
        flexDirection: 'column',

    },
    pressable: {
        //width: 100,
        //height: 80,
        marginTop: 10,
        backgroundColor: "#c6e2ff",
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
    },
    category: {
        color: "#000080",
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 7,
    },
    searchedList: {
        marginVertical: 10,
    },
});

