import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';

import { db } from '../firebaseConfigDB';
import { collection, query, where, getDocs } from "firebase/firestore";

import { getAuth } from "firebase/auth";

export default function HomeScreen({navigation}) {

  // Retrieve's user's email from Firebase authentication
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

  return (
      <SafeAreaView style={styles.background}>

        <View style={styles.top}> 
          <Text style={{fontFamily: 'spacemono-bold', fontSize: 25}}>Hello {userData.name ? userData.name : 'Loading...'}!</Text>
          <Text style={{fontFamily: 'spacemono-bold'}}>Mon, 12 June 2023</Text>
        </View>

        <View style={styles.todayce}>
          <ScrollView>
            <Text style={{justifyContent:"flex-start"}}>classes</Text>
          </ScrollView>
          <ScrollView>
            <Text style={{justifyContent:"flex-end"}}>today's events:</Text>
          </ScrollView>
        </View>

        <View style={styles.dailyview}>
          <Text>daily view</Text>
          <ScrollView>
            <Text>contents for scrolling</Text>
          </ScrollView>
        </View>

        <View style={styles.phc}>
          <View style={{flex:1}}>
            <Text style={{justifyContent:"flex-start"}}>productive hours:</Text>
          </View>

          <View style={{flex:1}}>
            <Text style={{justifyContent:"flex-end"}}>completed:</Text>
          </View>
        </View>

      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white', 
    flex: 1, 
    paddingTop: 40,
    paddingHorizontal: 20,
    // justifyContent: 'flex-start'
    // alignItems: 'center', 
    // justifyContent: 'center',
  },
  top: {
    flex: 1,
    paddingTop: 10,
  },
  hello: {
    // flex: 1
  },
  date: {
    // flex: 1
  },
  todayce: {
    flexDirection:"row",
    flex: 2,
    // backgroundColor:"white"
  },
  dvheader: {
    flex: 1
  },
  dailyview: {
    flex: 5,
    // backgroundColor:"blue"
  }, 
  phc: {
    flexDirection:"row",
    flex: 2,
    // backgroundColor:'green'
  }


})