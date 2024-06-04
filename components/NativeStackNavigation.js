import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ServiceDetailScreen from "../customers/ServiceDetail";

const nativeStackNav = createNativeStackNavigator();

const nativeStackNavigator = () => {
    return (
        <nativeStackNav.Navigator
            screenOptions={{
                headerShown: false,
            }}>
                <nativeStackNav.Screen name='ServiceDetailScreen' component={ServiceDetailScreen} />
        </nativeStackNav.Navigator>
    )
}

export default nativeStackNavigator;