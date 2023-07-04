import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getAuth, signOut } from "firebase/auth";

import { db } from '../firebaseConfigDB';
import { collection, query, where, getDocs, setDoc, doc, connectFirestoreEmulator } from "firebase/firestore";

import * as DocumentPicker from 'expo-document-picker';
import { RRule, RRuleSet, datetime, rrulestr } from 'rrule';
import * as FileSystem from 'expo-file-system';
import moment from 'moment-timezone';
import { event } from 'react-native-reanimated';

import { generateUUID } from '../hook/generateUUID';
import { getMultiSectionDigitalClockUtilityClass } from '@mui/x-date-pickers';

export default function ProfileScreen({navigation}) {

  const auth = getAuth();
  const userEmail = auth.currentUser.email;

  const [userData, setUserData] = useState({});

  // Function to retrieve user's name from firestore using their unique email address
  const getUserInfo = async () => {
    try {
      const q = query(collection(db, "users"), where("email", "==", userEmail));
      const querySnapShot = await getDocs(q);
      querySnapShot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        setUserData({
          ...doc.data(),
          id: doc.id,
        })
      });
    } catch (error) {
      console.log('Error retrieving user info: ', error);
    }

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

  function parseICS(icsData) {
    const lines = icsData.split('\n');
    const events = [];
    let event = null;
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      if (line.startsWith('BEGIN:VEVENT')) {
        event = {};
      } else if (line.startsWith('END:VEVENT')) {
        event.rrule = event.rrule || [];
        event.exdates = event.exdates || [];
        events.push(event);
        event = null;
      } else if (event) {
        const [key, value] = line.split(':');
  
        switch (key) {
          case 'SUMMARY':
            event.summary = value;
            break;
          case 'LOCATION':
            event.location = value;
            break;
          case 'DTSTART':
            event.dtstart = value;
            break;
          case 'DTEND':
            event.dtend = value;
            break;
          case 'RRULE':
            event.rrule = value;
            break;
          case 'EXDATE':
            event.exdates = event.exdates || [];
            event.exdates.push(value);
            break;
          
          default:
            // Ignore unrecognized properties
            break;
        }
      }
    }
  
    return events;
  }
  
  // Helper function to convert UTC date to Singapore time zone
  const convertToSingaporeTimeZone = (utcDate) => {
    return moment.tz(utcDate, 'UTC').tz('Asia/Singapore');
  };

  // Helper function to get all recurring dates based on rrule and exdates
  async function getAllRecurringDates(start, rrule, exdates) {
    console.log('hi');

    console.log('start: ', start);
    console.log('rrule: ', rrule);
    console.log('exdates: ', exdates);

    let newRRule = rrule;
    let freq = null;
    let count = null; 
    let byday = null;

    // extracting freq, count and day of the week from rrule
    if (newRRule.startsWith('FREQ=WEEKLY;')) {
      newRRule = newRRule.slice(12);
      freq = RRule.WEEKLY;
    }

    if (newRRule.startsWith('COUNT=')) {
      newRRule = newRRule.slice(6);
      count = newRRule.substring(0, newRRule.indexOf(';'));
      console.log('COUNT: ', count);
      console.log('newRRule: ', newRRule);
      newRRule = newRRule.slice(0, newRRule.indexOf(';') + 1);
      console.log('sliced: ', newRRule);
    }

    if (newRRule.startsWith('BYDAY=')) {
      newRRule = newRRule.slice(6);
      if (newRRule === 'MO') {
        byday = 1;
      } else if (newRRule === 'TU') {
        byday = 2;
      } else if (newRRule === 'WE') {
        byday = 3;
      } else if (newRRule === 'TH') {
        byday = 4;
      } else if (newRRule === 'FR') {
        byday = 5;
      } else if (newRRule === 'SA') {
        byday = 6;
      } else if (newRRule === 'SU') {
        byday = 7;
      }
      console.log('byday: ', byday);
    }

    // creation of RRuleSet for this particular module's class
    const rs = new RRuleSet();

    // convert starting date to sgt, string representation. 
    console.log(start);
    const dtstart = convertToSingaporeTimeZone(start).toString();
    console.log('dtstart: ', dtstart);
    // const bool = typeof dtstart === 'string';
    // console.log(bool);

    rs.rrule(
      new RRule({ 
        dtstart: new Date(dtstart),
        freq: freq, 
        count: count,
        byweekday: byday,
      })
    );

    // convert exdates to sgt and suitable format and add to the RRuleSet rs 
    const convertedExdates = exdates.map((date) => new Date(convertToSingaporeTimeZone(date)));
    for (let i = 0; i < convertedExdates.length; i++) {
      rs.exdate(convertedExdates[i]);
    }
    
    // generate all dates and return 
    return rs.all();
  };

  // helper function to process and upload classes/exams from nusmods tt to our database
  async function handleClassEventCreation(name, dtstart, dtend, rrule, exdates) {

    // class type events: lectures, tutorials, recitations etc with recurring dates 
    if (exdates.length > 0 && rrule.length > 0) {

      console.log('this is a class: ', name);
      const category = 'class';

      const startTime = dtstart.slice(9, 15);
      const endTime = dtend.slice(9, 15);
      const duration = endTime - startTime;
      const durationInHours = duration / 10000;

      const dates = await getAllRecurringDates(dtstart, rrule, exdates);
      console.log(dates);

      for (let i = 0; i < dates.length; i++) {
        const startDateTime = dates[i];
        console.log('SDT: ', startDateTime);

        let edt = startDateTime;
        const temp = moment(edt).add(durationInHours, 'hours').toDate();
        console.log('temp: ', temp);
        const endDateTimeStr = temp.toString();
      
        // upload class event to database
        try {
          const uniqueID = generateUUID(15);
          const docRef = doc(db, 'users', userEmail, "events", uniqueID);
          await setDoc(docRef, {
            id: uniqueID,
            description: name,
            startDate: startDateTime,
            endDate: new Date(endDateTimeStr),
            category: category,
            colour: '#9AC791', 
            completed: false, 
          });

        } catch(error) {
          console.log(error);
        }
      }

    // one time events: final exam
    } else {
      console.log('this is an exam: ', name);
      const category = 'event';

      const startdt = convertToSingaporeTimeZone(dtstart);
      const startDateTime = new Date(startdt);

      const enddt = convertToSingaporeTimeZone(dtend);
      const endDateTime = new Date(enddt);

      // upload exam event to database
      try {
        const uniqueID = generateUUID(15);
        const docRef = doc(db, 'users', userEmail, "events", uniqueID);
        await setDoc(docRef, {
          id: uniqueID,
          description: name,
          startDate: startDateTime,
          endDate: endDateTime,
          category: category,
          colour: '#E5E5E5', 
          completed: false, 
        });
        
      } catch(error) {
        console.log(error);
      }
    }

  }

  // handle selection of ics file that has been downloaded from nusmods by user
  const pickDoc = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: 'text/calendar',
      })

      if (file.type != 'success') {
        throw new Error('wrong file type, please select an ics file');
      } 

      console.log('new');

      const fileContents = await FileSystem.readAsStringAsync(file.uri);
      console.log(fileContents);

      try {
        const ev = parseICS(fileContents);
        // console.log('ev: ', ev);

        for (const mod of ev) {
          const name = mod.summary;
          const location = mod.location; 
          const dtstart = mod.dtstart;
          const dtend = mod.dtend;
          const rrule = mod.rrule;
          const exdates = mod.exdates;

          await handleClassEventCreation(name, dtstart, dtend, rrule, exdates);
          console.log('next');
        };

        return;

      } catch (error) {
        console.log('Error parsing ICS file: ', error);
      }
     
    } catch (error) {
      Alert.alert('Something went wrong: ', error); 
    }
  } 

  return (
      <SafeAreaView style={styles.background}>
        
        <Text style={{fontFamily:'spacemono-bold', fontSize: 25, paddingBottom: 35, paddingRight: 200}}>Profile</Text>
        
        <View style={styles.inputButton}> 
          <Ionicons name='happy-outline' color='black' size={15} paddingRight={10} paddingTop={3}/>
          <Text style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 13, color: 'grey'}} >{userData.name}</Text>         
        </View>

        <View style={styles.inputButton}> 
          <Ionicons name='mail-outline' color='black' size={15} paddingRight={10} paddingTop={3}/>
          <Text style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 13, color: 'grey'}} >{userEmail}</Text>
        </View>

        <View style={{paddingTop: 50}}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton} >
              <Text style={{fontFamily: 'spacemono-bold', fontSize:13}}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{paddingTop:20}}> 
          <Button title="Upload NUSMods timetable" onPress={pickDoc} />
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
    width: 150,
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