import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { createDrawerNavigator } from "@react-navigation/drawer";

//firebase
import { getAuth, signOut } from 'firebase/auth';


import BottomTabNavigator from "./BottomTabNavigation";

import AddressesScreen from "../customers/users/Addresses";
import RecipientsScreen from "../customers/users/Recipients";

import ChangePasswordScreen from "../authentication/ChangePassword";

import HelpDeskScreen from "../customers/HelpDesk";

import ROUTES from "../src/constants/routes";
import CustomDrawer from "./CustomDrawer";

const drawerNav = createDrawerNavigator();

const DrawerNavigator = () => {

    const auth = getAuth();
    const HANDLESIGNOUT = ({ navigation }) => {
        auth.signOut()
            .then(() => {
                navigation.replace('SignInScreen')
            })
            .catch(error => alert(error.message))
    }
    return (
        <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <drawerNav.Navigator
                drawerContent={props => <CustomDrawer {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <drawerNav.Screen name={ROUTES.HOME_DRAWER} component={BottomTabNavigator}
                    options={{
                        title: "Home",
                        //tabBarLabel: "Home",
                        drawerIcon: ({ focused }) => focused ? (
                            <Entypo name="home" size={24} color="black" />
                        ) : (
                            <AntDesign name="home" size={24} color="black" />
                        ),
                    }}
                />
                <drawerNav.Screen name={'AddressesScreen'} component={AddressesScreen}
                    options={({ navigation }) => ({
                        title: "Address Book",
                        headerShown: true,
                        headerTitle: 'Addresses',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 10, }}>
                                <MaterialIcons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                        drawerIcon: ({ focused }) => focused ? (
                            <Ionicons name="location-sharp" size={24} color="black" />
                        ) : (
                            <Ionicons name="location-outline" size={24} color="black" />
                        ),
                    })}
                />
                <drawerNav.Screen name={'RecipientsScreen'} component={RecipientsScreen}
                    options={({ navigation }) => ({
                        title: "Care Recipients",
                        headerShown: true,
                        headerTitle: 'Care Recipients',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 10, }}>
                                <MaterialIcons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                        drawerIcon: ({ focused }) => focused ? (
                            <MaterialCommunityIcons name="hand-heart" size={24} color="black" />
                        ) : (
                            <MaterialCommunityIcons name="hand-heart-outline" size={24} color="black" />
                        ),
                    })}
                />
                <drawerNav.Screen name={'ChangePasswordScreen'} component={ChangePasswordScreen}
                    options={({ navigation }) => ({
                        title: "Change Password",
                        headerShown: true,
                        headerTitle: 'Change Password',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 10, }}>
                                <MaterialIcons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                        drawerIcon: ({ focused }) => focused ? (
                            <Ionicons name="key-sharp" size={24} color="black" />
                        ) : (
                            <Ionicons name="key-outline" size={24} color="black" />
                        ),
                    })}
                />
                <drawerNav.Screen name={ROUTES.HELPDESK_DRAWER} component={HelpDeskScreen}
                    options={({ navigation }) => ({
                        title: "Help Desk",
                        headerShown: true,
                        headerTitle: 'Help Desk',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 10, }}>
                                <MaterialIcons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                        drawerIcon: ({ focused }) => focused ? (
                            <Ionicons name="md-help-circle" size={24} color="black" />
                        ) : (
                            <Ionicons name="md-help-circle-outline" size={24} color="black" />
                        ),
                    })}
                />

                <drawerNav.Screen name={ROUTES.SIGN_OUT} component={HANDLESIGNOUT}
                    options={{
                        title: "Sign Out",
                        //tabBarLabel: "Home",
                        drawerIcon: () => (
                            <MaterialIcons name="logout" size={24} color="black" />
                        ),
                    }}
                />

            </drawerNav.Navigator>

        </ScrollView>

    );
}

export default DrawerNavigator;

const styles = StyleSheet.create({

});