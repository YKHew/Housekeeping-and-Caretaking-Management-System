import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerToggleButton } from "@react-navigation/drawer";
import ROUTES from "../src/constants/routes";

import HomeScreenProvider from "../providers/Home";
import ProfileScreenProvider from "../providers/Profile";
import TaskScreen from "../providers/Tasks";

//import provider screen

import { HomeStack, SearchStack, ActivityStack, ProfileStack, HelpDeskStack, } from "./StackNavigation";
import DrawerNavigator from "./DrawerNavigation";

//const
const stackNav = createStackNavigator();
const bottomTabNav = createBottomTabNavigator();
//const drawerNav = createDrawerNavigator();

const BottomTabNavigator_Provider = () => {
    return (
        <bottomTabNav.Navigator
            screenOptions={({ navigation }) => ({
                // headerLeft: () => (
                //     <Ionicons name="menu" 
                //         size={24} color="black" 
                //         style={{margin: 10}} 
                //         onPress={() => navigation.openDrawer()} 
                //     />
                // ),
                headerRight: () => (
                    <Ionicons name="ios-notifications-outline"
                        size={24} color="black"
                        style={{ margin: 10 }}
                    />
                ),
                headerStyle: {
                    backgroundColor: '#b0e0e6',
                }
            })}
        >
            <bottomTabNav.Screen
                name={ROUTES.P_HOME_TAB} component={HomeScreenProvider}
                options={{
                    tabBarLabel: "Home",
                    headerTitle: 'Home',
                    //headerShown: false,
                    tabBarIcon: ({ focused }) => focused ? (
                        <Entypo name="home" size={24} color="#000080" />
                    ) : (
                        <AntDesign name="home" size={24} color="black" />
                    ),
                }}
            />

            <bottomTabNav.Screen
                name={ROUTES.Task_TAB} component={TaskScreen}
                options={{
                    title: "Task",
                    tabBarLabel: "Task",
                    headerTitle: 'Task',
                    tabBarIcon: ({ focused }) => focused ? (
                        <Ionicons name="calendar" size={24} color="#000080" />
                    ) : (
                        <Ionicons name="calendar-outline" size={24} color="black" />
                    ),
                }}
            />

            <bottomTabNav.Screen
                name={ROUTES.P_PROFILE_TAB} component={ProfileScreenProvider}
                options={{
                    tabBarLabel: "Profile",
                    headerTitle: 'Profile',
                    //headerShown: false,
                    tabBarIcon: ({ focused }) => focused ? (
                        <FontAwesome name="user" size={24} color="#000080" />
                    ) : (
                        <FontAwesome name="user-o" size={24} color="black" />
                    ),
                }}
            />
        </bottomTabNav.Navigator>
    );
};

export default BottomTabNavigator_Provider;