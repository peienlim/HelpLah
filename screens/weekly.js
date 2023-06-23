import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import WeekView from "react-native-week-view";
import MyEventComponent from '../components/weekly page components/myEventComponent';
import WeekScroll from '../components/weekly page components/weekScroll';

import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfigDB';
import { collection, onSnapshot } from 'firebase/firestore';

import { handleEventLongPress } from '../hook/handleEventLongPress';
import { handleDragEvent } from '../hook/handleDragEvent';
import { milliseconds } from 'date-fns';

export default function WeeklyScreen({navigation}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [myEvents, setMyEvents] = useState([]);
  const [isMeasurementDone, setIsMeasurementDone] = useState(false);

  const auth = getAuth();
  const userEmail = auth.currentUser.email;

  const calendarStripRef = useRef(null);
  const weekViewRef = useRef(null);

  const handleDateSelected = (date) => {
    weekViewRef.current.goToDate(date, { animated: true });
    scrollToTimeAfterMeasurement(7.8 * 60);
  };

  const handleSwipeNext = (date) => {
    setSelectedDate(date);
    scrollToTimeAfterMeasurement(7.8 * 60);
  };

  const handleSwipePrev = (date) => {
    setSelectedDate(date);
    scrollToTimeAfterMeasurement(7.8 * 60);
  };

  const scrollToTimeAfterMeasurement = (timeInMinutes) => {
    if (isMeasurementDone) {
      weekViewRef.current.scrollToTime(timeInMinutes, { animated: true });
    }
  };

  // retrieve data from realtime database
  const getEvents = () => {
    try {
      const eventsRef = collection(db, 'users', userEmail, 'events');
  
      const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
        const eventsData = querySnapshot.docs.map((doc) => doc.data());
        const transformedEvents = eventsData.map((event) => ({
          id: event.id,
          startDate: event.startDate.toDate(),
          endDate: event.endDate.toDate(),
          color: event.colour,
          description: event.description,
        }));
        setMyEvents(transformedEvents);
        //console.log(myEvents);
      });
  
      // Return an unsubscribe function to stop listening for updates
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };  

  useEffect(() => {
    getEvents();
  }, []);

  const handleLayout = () => {
    setIsMeasurementDone(true);
  };

  return (

    <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>

          <WeekScroll 
            forwardedRef={calendarStripRef}
            style={styles.exampleContainer}
            onDateSelected={handleDateSelected}
            selectedDate={selectedDate}
          />

          <View style={styles.weekViewContainer}>
            <WeekView
              events={myEvents}
              EventComponent={MyEventComponent}
              selectedDate={selectedDate}
              numberOfDays={1}
              pageStartAt={{ weekday: 1 }}
              headerStyle={styles.weekViewHeader}
              headerTextStyle={styles.headerText}
              hourTextStyle={styles.hourText}
              eventContainerStyle={styles.eventContainer}
              gridColumnStyle={styles.gridColumn}
              gridRowStyle={styles.gridRow}
              hourContainerStyle={styles.hourContainer}
              formatDateHeader='ddd D'
              allowScrollByDay={true}
              hoursInDisplay={6}
              timeStep={30}
              timesColumnWidth={0.16}
              ref={weekViewRef}
              onSwipeNext={handleSwipeNext}
              onSwipePrev={handleSwipePrev}
              startHour={7.8}
              showNowLine={true}
              onEventLongPress={(event) => handleEventLongPress(event)}
              //onEventPress={HandleEventPress}
              onDragEvent = {(event, newStartDate, newEndDate) => handleDragEvent(event, newStartDate, newEndDate)}
              afterLongPressDuration = {milliseconds}
            />
          </View>

        </View>
      </SafeAreaView>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  exampleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 100
  },
  calendarStrip: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
    fontFamily: 'spacemono'
  },
  weekViewContainer: {
    flex: 1,
  },
  weekViewHeader: {
    height: 90,
  },
  headerText: {
    fontFamily: 'spacemono',
    fontSize: 10,
  },
  hourText: {
    fontFamily: 'spacemono',
  },
  eventContainer: {
    borderRadius: 10,
  },
  gridColumn: {
    
  }, 
  gridRow: {
    
  }, 
  hourContainer: {

  },
})