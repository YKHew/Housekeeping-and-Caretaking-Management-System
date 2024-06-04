import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

//firebase
import { getAuth, signOut } from 'firebase/auth';

import BottomTabNavigator_Provider from "./BottomTabNavigation_Provider";

import HelpDeskScreen from "../customers/HelpDesk";

import ROUTES from "../src/constants/routes";
import CustomDrawer from "./CustomDrawer";

const drawerNav = createDrawerNavigator();

const DrawerNavigator_Provider = () => {

    const auth = getAuth();

    const HANDLESIGNOUT = ({navigation}) => {
        auth.signOut()
            .then(() => {
                navigation.replace('SignInScreen')
            })
            .catch(error => alert(error.message))
    }
    return (
        <drawerNav.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <drawerNav.Screen name={ROUTES.P_HOME_DRAWER} component={BottomTabNavigator_Provider}
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
            {/* <drawerNav.Screen name={ROUTES.HELPDESK_DRAWER} component={HelpDeskScreen}
                options={{
                    //drawerLabel: 'Home Screen Option',
                    //title: 'Home Screen',
                }}
            /> */}

            <drawerNav.Screen name={ROUTES.SIGN_OUT} component={HANDLESIGNOUT} />
        </drawerNav.Navigator>
    );
}

export default DrawerNavigator_Provider;