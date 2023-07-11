import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert, View, PermissionsAndroid, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getAuth, signOut } from "firebase/auth";

import { db } from '../firebaseConfigDB';
import { collection, query, where, getDocs, setDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";

import * as DocumentPicker from 'expo-document-picker';
import { RRule, RRuleSet, datetime, rrulestr } from 'rrule';
import * as FileSystem from 'expo-file-system';
import moment from 'moment-timezone';
import { diff, event } from 'react-native-reanimated';

import { generateUUID } from '../hook/generateUUID';
import { getMultiSectionDigitalClockUtilityClass } from '@mui/x-date-pickers';
import { ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


export default function ProfileScreen({navigation}) {

  const auth = getAuth();
  const userEmail = auth.currentUser.email;

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  //const [uploadComplete, setUploadComplete] = useState(false);
  const [mods, setMods] = useState({});
  //const [modsUploaded, setModsUploaded] = useState(false);
  const [uploadedBefore, setUploadedBefore] = useState(false);
  const [deleting, setDeleting] = useState(false);
  //const [deleteSuccess, setDeleteSuccess] = useState(false);

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
      console.log('Error retrieving user info: ', error.message);
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
  async function handleClassEventCreation(name, moduleName, dtstart, dtend, rrule, exdates) {

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
            nusmods: true,
            moduleName: moduleName,
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
          nusmods: true, 
          moduleName: moduleName, 
        });
        
      } catch(error) {
        console.log(error);
      }
    }

  }

  const getModuleName = (name) => {
    let slicedName = name;
    if (name.startsWith(' ')) {
      slicedName = name.slice(1);
    } 
    const modName = slicedName.substring(0, slicedName.indexOf(' '));
    console.log('modName: ', modName);

    return modName;
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
      setLoading(true);
      
      let fileContents;

      if (Platform.OS === "android") {
        const response = await fetch(file.uri);
        fileContents = await response.text();
      } else {
        fileContents = await FileSystem.readAsStringAsync(file.uri);
      }

      console.log(fileContents);

        try {
          const ev = parseICS(fileContents);
          // console.log('ev: ', ev);


        for (const mod of ev) {
          const name = mod.summary;
          const moduleName = getModuleName(mod.summary);
          console.log(module);
          const location = mod.location; 
          const dtstart = mod.dtstart;
          const dtend = mod.dtend;
          const rrule = mod.rrule;
          const exdates = mod.exdates;

          await handleClassEventCreation(name, moduleName, dtstart, dtend, rrule, exdates);
          console.log('next');
        };
        
        setLoading(false);
        return;

      } catch (error) {
        setLoading(false);
        Alert.alert('Error processing file, please try again.');
        console.log('Error parsing ICS file: ', error);
      }

    } catch (error) {
      Alert.alert('Something went wrong: ', error.message); 
    }

  }

  // deletes events in database with nusmods field set to true (uploaded and not created by user)
  const handleDeleteTimetable= async () => {

    async function handleDeleteEvent() {
      try {
        setDeleting(true);
        const auth = getAuth();
        const userEmail = auth.currentUser.email;

        const eventsRef = collection(db, 'users', userEmail, 'events');
        const q = query(eventsRef, where('nusmods', '==', true));

        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map((docu) => {
            const docRef = doc(db, 'users', userEmail, 'events', docu.id);
            return deleteDoc(docRef); 
        });

        await Promise.all(deletePromises);

        //setDeleteSuccess(true);
        setUploadedBefore(false);
        
      } catch (error) {
        Alert.alert('Something went wrong: ', error);
        console.log(error);

      } finally {
        console.log('done finally');
        setDeleting(false);
      }
    }

    const alertPopUp = () => {
      Alert.alert("Delete previous timetable", "Are you sure you want to delete? (you will be able to upload a new timetable after successful deletion)", [
          {
              text: 'Cancel',
              onPress: () => console.log('Cancel'),
          },
          {
              text: 'Confirm',
              onPress: handleDeleteEvent,
          }
      ]);
    };
    alertPopUp();
  }

  // retrieve data from realtime database
  const getMods = () => {
    try {
      const eventsRef = collection(db, 'users', userEmail, 'events');
  
      const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
        const eventsData = querySnapshot.docs.map((doc) => doc.data());
        const nusmodsEvs = eventsData.filter((event) => event.nusmods);
        const moduleNameArr = nusmodsEvs.map((event) => event.moduleName);
        //console.log(moduleNameArr);

        let diffMods = [];
        moduleNameArr.forEach((mod) => {
          if (!diffMods.includes(mod)) {
            diffMods.push(mod);
          }
        });

        //console.log(diffMods);
        setMods(diffMods); 

        if (diffMods.length > 0) {
          setUploadedBefore(true);
        }

      });
  
      // Return an unsubscribe function to stop listening for updates
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };  

  useEffect(() => {
    getMods();
  }, []);
  
  return (
      <SafeAreaView style={styles.background}>
        
        <View style={styles.nameEmailContainer}>
          <Text style = {{fontFamily: 'spacemono', fontSize: 15, paddingLeft: 15}}>Name and Email:</Text>
          <View style={styles.inputButton}> 
            <Ionicons name='happy-outline' color='black' size={15} paddingRight={10} paddingTop={3}/>
            <Text style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 13, color: 'grey'}} >{userData.name}</Text>         
          </View>

          <View style={styles.inputButton}> 
            <Ionicons name='mail-outline' color='black' size={15} paddingRight={10} paddingTop={3}/>
            <Text style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 13, color: 'grey'}} >{userEmail}</Text>
          </View>
        </View>

        {uploadedBefore && Object.keys(mods).length > 0 && (
          <View style={styles.mod}>
            <Text style={{fontFamily: 'spacemono', fontSize: 15, paddingLeft: 10}}>Mods: </Text>
            {Object.keys(mods).map((key) => (
              <View key={key}> 
                <View style={styles.modContainer}>
                  <Text style={styles.modText}>{mods[key]}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {!loading && !deleting && (
          <View style={styles.nusmodsButton}> 
            <Button 
              title={!uploadedBefore ? "Upload NUSMods timetable" : 'Delete uploaded NUSMods timetable'} 
              onPress={!uploadedBefore ? pickDoc : handleDeleteTimetable} 
            />
          </View>
        )}
     
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9AC791" />
            <Text style={styles.loadingText}>Uploading...</Text>
          </View>
        )}

        {deleting && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffb6b3" />
            <Text style={styles.loadingText}>Deleting...</Text>
          </View>
        )}
 
        <View style={{paddingTop: 20, flex: 1}}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton} >
              <Text style={{fontFamily: 'spacemono-bold', fontSize:13}}>Sign Out</Text>
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

  nameEmailContainerNM: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    //backgroundColor: 'blue',
  },

  nameEmailContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
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

  mod: {
    paddingTop: 20,
    flex: 2
  },

  modContainer: {
    backgroundColor: '#E5E5E5', 
    height: 35,
    margin: 5,
    borderWidth: 0,
    padding: 10,
    borderColor: '#E5E5E5',
    width: 300,
    borderRadius: 10,
    flexDirection: 'row',
  },
  
  modText: {
    fontFamily: 'spacemono',
    fontSize: 13,
    color: 'grey',
  },

  nusmodsButtonNM: {
    paddingTop: 20,
  },

  nusmodsButton: {
    paddingTop: 30
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'spacemono',
    fontSize: 15,
    color: 'grey',
  },

  completedContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  completedText: {
    marginTop: 10,
    fontFamily: 'spacemono',
    fontSize: 15,
    color: '#9AC791',
  },

});

