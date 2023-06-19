import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getAuth, signOut } from "firebase/auth";

import { db } from '../firebaseConfigDB';
import { collection, query, where, getDocs } from "firebase/firestore";


export default function ProfileScreen({navigation}) {

  const auth = getAuth();
  const userEmail = auth.currentUser.email;

  const [userData, setUserData] = useState({});

  // Function to retrieve user's name from firestore using their unique email address
  const getUserInfo = async () => {
    const q = query(collection(db, "users"), where("email", "==", userEmail));
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setUserData({
        ...doc.data(),
        id: doc.id,
      })
    });
    console.log(userData);
  };

  // handles side effect from changing the state of object
  useEffect(() => {
    getUserInfo();
  }, []);

  // Uses firebase to signout and navigates back to home screen
  async function handleSignOut() {
    try {
      await signOut(auth);
      await navigation.navigate("LoginScreen")

    } catch(error) {
      Alert.alert("Try again")
    }
  };

  return (
      <SafeAreaView style={styles.background}>
        
        <Text style={{fontFamily:'spacemono-bold', fontSize: 25, paddingBottom: 35, paddingRight: 200}}>Profile</Text>
        
        <View style={styles.inputButton}> 
          <Ionicons name='happy-outline' color='black' size={15} paddingRight={10} paddingTop={3}/>
          <Text style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 15, color: 'grey'}} >{userData.name}</Text>         
        </View>

        <View style={styles.inputButton}> 
          <Ionicons name='mail-outline' color='black' size={15} paddingRight={10} paddingTop={3}/>
          <Text style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 15, color: 'grey'}} >{userEmail}</Text>
        </View>

        <View style={{paddingTop: 50}}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton} >
              <Text style={{fontFamily: 'spacemono-bold', fontSize:15}}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white', 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },

  signOutButton: {
    backgroundColor: '#9AC791',
    borderColor: '#9AC791',
    height: 35,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  inputButton: {
    backgroundColor: '#E5E5E5', 
    height: 40,
    margin: 12,
    borderWidth: 0,
    padding: 10,
    borderColor: '#E5E5E5',
    width: 300,
    borderRadius: 10,
    flexDirection: 'row',
  },

})