import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import WeekView from 'react-native-week-view';
import MyEventComponent from '../weekly page components/myEventComponent';
import moment from 'moment';

import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfigDB';
import { collection, onSnapshot } from 'firebase/firestore';

export default function DailyView() {
  const auth = getAuth();
  const userEmail = auth.currentUser.email;

  const [myEvents, setMyEvents] = useState([]);

  //get today's date so that correct calendar page shown 
  const selectedDate = new Date();

  //get current time so that daily view calendar starts off at current timing
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;
  
  // retrieve data from realtime database
  const getEvents = () => {
    try {
      const eventsRef = collection(db, 'users', userEmail, 'events');

      const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
        const eventsData = querySnapshot.docs.map((doc) => doc.data());

        const filteredEvents = eventsData.filter((event) => { 
          const eventStartDate = event.startDate.toDate();
          const eventDate = eventStartDate.toDateString();
          const currentDate = selectedDate.toDateString();
          return eventDate === currentDate;
        });
        const transformedEvents = filteredEvents.map((event) => ({
          id: event.id,
          startDate: event.startDate.toDate(),
          endDate: event.endDate.toDate(),
          color: event.colour,
          description: event.description,
        }));                                    
                                            
        setMyEvents(transformedEvents);
        console.log(myEvents);
      });

      // Return an unsubscribe function to stop listening for updates
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };  

  // handles side effect from changing the state of object
  useEffect(() => {
    getEvents();
  }, []);

 

  return (
    <View style={styles.dailyview}>
      <View style={styles.overlay}>
        <Text style={styles.header}>Today's Schedule</Text>
      </View> 
      <View style={styles.calendar}>
        <WeekView
          events={myEvents}
          EventComponent={MyEventComponent}
          selectedDate={selectedDate}
          numberOfDays={1}
          pageStartAt={{ weekday: 1 }}
          headerStyle={styles.weekViewHeader}
          hourTextStyle={styles.hourText}
          eventContainerStyle={styles.eventContainer}
          gridColumnStyle={styles.gridColumn}
          gridRowStyle={styles.gridRow}
          hourContainerStyle={styles.hourContainer}
          formatDateHeader='ddd D'
          allowScrollByDay={true}
          hoursInDisplay={6}
          timeStep={60}
          timesColumnWidth={0.14}
          startHour={currentTimeInMinutes}
          showNowLine={true}
          fixedHorizontally={true}
        />
      </View>    
    </View>
  )

}

const styles = StyleSheet.create({
    dailyview: {
        paddingTop: 10,
        flex: 6.5,
        // backgroundColor:"blue"
    }, 
    overlay: {
      position: 'absolute',
      top: 30,
      left: 0,
      right: 0,
      bottom: 0,
      //justifyContent: 'center',
      //alignItems: 'center',
    },
    header: {
      fontFamily: "spacemono-bold", 
      fontSize: 13.5,
    },
    calendar: {
      flex: 1,
      //border: 1,
      borderColor: 'white',
      paddingBottom: 20,
    },
    weekViewContainer: {
      flex: 1,
    },
    weekViewHeader: {
      flex: 0,
      height: 0,
    },
    hourText: {
      fontFamily: 'spacemono',
    },
    eventContainer: {
      //borderRadius: 10,
    },
    gridColumn: {
      borderTopWidth: 1
    },
    gridRow: {
      borderLeftWidth: 1
    }
}
)