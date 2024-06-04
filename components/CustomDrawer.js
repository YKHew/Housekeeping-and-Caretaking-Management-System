import React, { Component, useState, useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Image, View, Text,
  Dimensions, TouchableOpacity,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, } from '@react-navigation/drawer';

//Firebase
import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('screen');

const CustomDrawer = props => {
  const uid = FIREBASE_AUTH.currentUser.uid;
  const [profile, setProfile] = useState([]);

  //get data by id
  useEffect(() => {
    const fetchClient = async () => {
      console.log('hello: ');
      getDoc(doc(FIRESTORE_DB, 'users', uid)).then((docData) => {
        if (docData.exists()) {
          console.log('ClientPP: ', docData.data());
          setProfile(docData.data());
        }
      })
    };
    fetchClient();
  }, [])

  const auth = getAuth();
  const HANDLESIGNOUT = ({ navigation }) => {
    auth.signOut()
      .then(() => {
        navigation.navigate('SignInScreen')
      })
      .catch(error => alert(error.message))
  }

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always", horizontal: "never" }}>
      <DrawerContentScrollView {...props} >
        <ImageBackground source={require('../src/images/drawerBg.jpg')} style={{ height: 140 }}>
          {
            profile.profileImage != ''
              ? (
                <Image source={{ uri: profile.profileImage }} style={styles.userImg} />
              ) : (
                <></>
              )
          }

        </ImageBackground>
        <View style={styles.drawerListWrapper}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>

  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  userImg: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    position: 'absolute',
    left: width / 2 - 110,
    bottom: -110 / 2,
    borderWidth: 4,
    borderColor: "white",

  },
  drawerListWrapper: {
    marginTop: 65,
  },

  drawerItem: {
    marginBottom: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, .87)',
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  }
});