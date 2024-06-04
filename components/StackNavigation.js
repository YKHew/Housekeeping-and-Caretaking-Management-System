import React from "react";
import { StyleSheet, Text, View } from "react-native";

//Firebase

//Icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//Navigator
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { createDrawerNavigator } from "@react-navigation/drawer";

//import customers screens
import HomeScreen from "../customers/Home";
import ProfileScreen from "../customers/Profile";
import SearchScreen from "../customers/Search";
import ActivityScreen from "../customers/Activity";

import HelpDeskScreen from "../customers/HelpDesk";

import ServiceDetailScreen from "../customers/ServiceDetail";
import SelectServiceProviderScreen from "../customers/SelectServiceProvider";
import StaffInfoScreen from "../customers/StaffInfo";

import BookingScreen from "../customers/Booking";
import FeedbackScreen from "../customers/Feedback";

import EditProfileScreen from "../customers/users/EditProfile";
import AddressesScreen from "../customers/users/Addresses";


//Cleaning
import CleaningScheduleScreen from "../customers/cleaning/Schedule";


//Baby Sitting
import BabySittingScheduleScreen from "../customers/babySitting/Schedule";


//import provides screens
import BottomTabNavigator_Provider from "./BottomTabNavigation_Provider";
import DrawerNavigator_Provider from "./DrawerNavigation_Provider";
import HomeScreenProvider from "../providers/Home";
import WorkingHoursScreen from "../providers/workingHours";


import BottomTabNavigator from "./BottomTabNavigation";
import DrawerNavigator from "./DrawerNavigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Example

import ROUTES from "../src/constants/routes";
import Services from '../src/constants/services';

//test
import SignInScreen from '../authentication/SignIn';
import SignUpScreen from "../authentication/SignUp";
import ForgotPasswordScreen from "../authentication/ForgotPassword";
import { SafeAreaView } from "react-native-safe-area-context";

//const
const stackNav = createStackNavigator();
const nativeStackNav = createNativeStackNavigator();
const bottomTabNav = createBottomTabNavigator();
//const drawerNav = createDrawerNavigator();

const StackNavigator = () => {
    return (
        <stackNav.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <stackNav.Screen name="SignInScreen" component={SignInStack} />
            <stackNav.Screen name="SignUpScreen" component={SignUpStack} />
            <stackNav.Screen name="ForgotPasswordScreen" component={ForgotPasswordStack} />

            <stackNav.Screen name={ROUTES.HOME} component={DrawerNavigator} />
            <stackNav.Screen name={ROUTES.P_HOME_TAB} component={BottomTabNavigator_Provider} />

            {/* Customer Profile */}
            <stackNav.Screen name='EditProfileScreen' component={EditProfileStack} />

            {/* Provider Profile */}
            <stackNav.Screen name="WorkingHoursScreen" component={WorkingHoursStack} />

            <stackNav.Screen name='ServiceDetailScreen' component={ServiceInfoStack} />

            <stackNav.Screen name="SelectServiceProviderScreen" component={SelectServiceProviderStack} />
            <stackNav.Screen name="StaffInfoScreen" component={StaffInfoStack} />
            <stackNav.Screen name="BookingScreen" component={BookingStack} />
            <stackNav.Screen name="FeedbackScreen" component={FeedbackStack} />

            <stackNav.Screen name="CleaningScheduleScreen" component={CleaningScheduleScreen} />
            <stackNav.Screen name="BabySittingScheduleScreen" component={BabySittingScheduleScreen} />
        </stackNav.Navigator>
    );
}
const SignInStack = () => {
    return (
        <stackNav.Navigator>
            <stackNav.Screen name="SignInScreen" component={SignInScreen}
                initialRouteName='SignInScreen'
                options={{
                    headerShown: false,
                }} />
        </stackNav.Navigator>
    )
}

const SignUpStack = ({ navigation }) => {
    return (
        <stackNav.Navigator>
            <stackNav.Screen name="SignUpScreen" component={SignUpScreen} options={{
                headerShown: true,
                headerTitle: 'Sign Up',
                headerLeft: () => (
                    <Ionicons name="arrow-back-outline" size={24} color="black"
                        onPress={() => { navigation.goBack(null) }}
                        style={styles.backIcon}
                    />
                ),
            }} />
        </stackNav.Navigator>
    )
}

const ForgotPasswordStack = () => {
    return (
        <stackNav.Navigator>
            <stackNav.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{
                headerShown: true,
                headerTitle: '',
            }} />
        </stackNav.Navigator>
    )
}

const EditProfileStack = () => {
    return (
        <stackNav.Navigator>
            <stackNav.Screen name="EditProfileScreen" component={EditProfileScreen}
                options={{
                    headerShown: true,
                    headerTitle: 'Edit Profile',
                }}
            />
        </stackNav.Navigator>
    )
}

//Provider Screen
const WorkingHoursStack = () => {
    return (
        <stackNav.Navigator>
            <stackNav.Screen name={ROUTES.WORKINGHOURS} component={WorkingHoursScreen}
                options={{
                    headerShown: true,
                    headerTitle: 'Working Hours',
                }}
            />
        </stackNav.Navigator>
    )
}

const ServiceInfoStack = () => {
    return (
        <stackNav.Navigator >
            <stackNav.Screen name="ServiceDetailScreen" component={ServiceDetailScreen}
                options={{
                    headerTitle: 'Detail',
                    headerShown: true
                }}
            />
        </stackNav.Navigator>
    )
}

const BookingStack = () => {
    return (
        <stackNav.Navigator >
            <stackNav.Screen name="BookingScreen" component={BookingScreen}
                options={{
                    headerTitle: 'Booking Detail',
                    headerShown: true
                }}
            />
        </stackNav.Navigator>
    )
}

const FeedbackStack = () => {
    return (
        <stackNav.Navigator >
            <stackNav.Screen name="FeedbackScreen" component={FeedbackScreen}
                options={{
                    headerTitle: 'Feedback',
                    headerShown: true
                }}
            />
        </stackNav.Navigator>
    )
}

const SelectServiceProviderStack = () => {
    return (
        <stackNav.Navigator >
            <stackNav.Screen name="SelectServiceProviderScreen" component={SelectServiceProviderScreen}
                options={{
                    headerTitle: 'Select Service Provider',
                    headerShown: true,
                }}
            />
        </stackNav.Navigator>
    )
}

const StaffInfoStack = () => {
    return (
        <stackNav.Navigator >
            <stackNav.Screen name="StaffInfoScreen" component={StaffInfoScreen}
                options={{
                    headerTitle: '',
                    headerShown: true,

                }}
            />
        </stackNav.Navigator>
    )
}


// const CleaningScheduleStack = () => {
//     return (
//         <stackNav.Navigator >
//             <stackNav.Screen name="CleaningScheduleScreen" component={CleaningScheduleScreen}
//                 options={{
//                     headerTitle: 'Cleaning Detail',
//                     headerShown: true
//                 }}
//             />
//         </stackNav.Navigator>
//     )
// }

// export { HomeStack, SearchStack, ActivityStack, ProfileStack, 
//     HelpDeskStack, 
// };

//export { HomeStack, HelpDeskStack, };
export default StackNavigator;

//style
const styles = StyleSheet.create({
    backIcon: {
        marginHorizontal: 10,
    },
    headerRightBtn: {
        marginHorizontal: 15,
    },
});