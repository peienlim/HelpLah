import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';


import DailyView from '../components/home page components/dailyView';
import Event from '../components/home page components/Event';


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
          <Text style={styles.hello}>Hello {userData.name ? userData.name : 'Loading...'}!</Text>
          <Text style={styles.date}>Mon, 12 June 2023</Text>
        </View>

        <View style={styles.todayce}>
          <Text style={styles.header}>Today's Events</Text>
          <ScrollView>
            <Event/>
            <Event/>
            <Event/>
            <Event/>
          </ScrollView>
        </View> 

        <DailyView/>

        <View style={styles.phc}>
          <View style={{flex:1}}>
            <Text style={styles.header}>Productive Hours:</Text>
            <View style={styles.phccontainer}>
              <Text style={styles.phctext}>3 hours!</Text>
            </View>
          </View>

          <View style={{flex:1}}>
            <Text style={styles.header}>Completed:</Text>
            <View style={styles.phccontainer}>
              <Text style={styles.phctext}>3/5!</Text>
            </View>
          </View>
        </View>

      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  background: {
    marginLeft: 7,
    flex: 1, 
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  top: {
    flex: 1,
    paddingTop: 20,
  },
  hello: {
    fontFamily: 'spacemono-bold',
    fontSize: 25,
  },
  date: {
    fontFamily:"spacemono",
    fontSize: 12
  },
  todayce: {
    flex: 1.7,
  },
  phc: {
    paddingTop: 10,
    flexDirection:"row",
    flex: 1,
  },
  phccontainer: {
    flex: 0.8,
    backgroundColor: "#E5E5E5",
    width: "78%",
    borderRadius: 10,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    paddingLeft: 6,
  },
  phctext: {
    fontFamily:"spacemono",
    fontSize: 12
  },
  header: {
    fontFamily:"spacemono-bold", 
    fontSize:13.5,
  }, 


})