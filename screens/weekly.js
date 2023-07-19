<<<<<<< HEAD
import { SafeAreaView, StyleSheet } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

/* import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react'; */

export default function WeeklyScreen() {

  /* const [fontsLoaded] = useFonts({
    'spacemono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'spacemono-bold': require('../assets/fonts/SpaceMono-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }
 */
  return (
    <SafeAreaView>
      <CalendarStrip
        scrollable
        style={{height:200, paddingTop: 20, paddingBottom: 10}}
        calendarColor={'#3343CE'}
        calendarHeaderStyle={{color: 'white', fontSize: 20, fontFamily: 'spacemono-bold',}}
        dateNumberStyle={{color: 'white', fontFamily:'spacemono-bold',}}
        dateNameStyle={{color: 'white'}}
        iconContainer={{flex: 0.1}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  background: {
    backgroundColor: 'white', 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
});




/* import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';

export default class WeeklyScreen extends Component {
  state = {
    items: undefined,
  };

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems}
        selected={'2023-05-16'}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showClosingKnob={true}
      />
    );
  }

  loadItems = (day) => {
    const items = this.state.items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
            });
          }
        }
      }

      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      this.setState({
        items: newItems,
      });
    }, 1000);
  };

  renderItem = (reservation, isFirst) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';
    const fontFamily = "spacemono-bold"

    return (
      <TouchableOpacity
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{ fontSize, color, fontFamily}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}
=======
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View , StatusBar} from 'react-native';
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
          category: event.category,
          completed: event.completed,
          nusmods: event.nusmods,
          disableDrag: event.nusmods, 
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
              //onEventLongPress={(event) => handleEventLongPress(event)}
              onEventPress={(event) => handleEventLongPress(event)}
              onDragEvent = {(event, newStartDate, newEndDate) => handleDragEvent(event, newStartDate, newEndDate)}
              afterLongPressDuration = {milliseconds}
            />
          </View>

        </View>
      </SafeAreaView>

  );
};

>>>>>>> beverley_branch

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:StatusBar.currentHeight, 
  },
  contentContainer: {
    flex: 1,
  },
<<<<<<< HEAD
}); */
=======
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
>>>>>>> beverley_branch
