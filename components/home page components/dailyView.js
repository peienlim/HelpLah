import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, ScrollView, View, Alert, Modal, StatusBar, Button, TouchableOpacity} from 'react-native';
import WeekView from 'react-native-week-view';
import MyEventComponent from '../weekly page components/myEventComponent';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfigDB';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import CountDownTimer from '../countdownTimer';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DailyView() {
  const auth = getAuth();
  const userEmail = auth.currentUser.email;

  const [myEvents, setMyEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); 

  //get current time so that daily view calendar starts off at current timing
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  
  const getDescr = (descr, completed) => {
    if (completed) {
      return descr += ' (done)';
    } else {
      return descr;
    }
  }

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
          category: event.category,
          color: event.colour,
          description: getDescr(event.description, event.completed),
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

  const handleTickEvent = (event) => {
    const eventRef = doc(collection(db, 'users', userEmail, 'events'), event.id);
    const newStatus = !event.completed; // Toggle the completed status
    let newDescription = event.description;

    if (newStatus && !newDescription.endsWith(' (done)')) {
      newDescription += ' (done)'; // Append " (done)" to the description if the event is marked as completed
    } else if (!newStatus && newDescription.endsWith(' (done)')) {
      newDescription = newDescription.slice(0, -7);
    }

    updateDoc(eventRef, { completed: newStatus })
      .then(() => {
        console.log('Event status and description updated!');
        const updatedEvents = myEvents.map((ev) => {
          if (ev.id === event.id) {
            return { ...ev, completed: newStatus, description: newDescription };
          }
          return ev;
        });
        setMyEvents(updatedEvents);
      })
      .catch((error) => {
        console.log('Error updating event status:', error);
      });
  };
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);
  const [modalEventTime, setModalEventTime] = useState(0); // in miliseconds
  
  // handles long press of event to display focus timer
  const handleLongPress = (event) => {
    const startTime = event.startDate.getTime();
    const endTime = event.endDate.getTime();
    Alert.alert("Focus Mode", "Do you want to enter Focus Mode?", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel'),
      },
      {
        text: 'Confirm',
        onPress: () => {
          setModalEvent(event); // need to set in this order for the timer to show the correct time!
          setModalEventTime(event.endDate.getTime() - event.startDate.getTime());
          setModalVisible(true);
        }
      }
    ]);
  };

  const handleExitFocus = () => {
    Alert.alert("Exit Focus Mode", "Are you sure you want to exit Focus Mode?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel"),
      },
      {
        text: "Confirm",
        onPress: () => setModalVisible(!modalVisible),
      }
    ]);
  };

  const navigation = useNavigation();
  const navigateToHomeScreen = () => {
    navigation.navigate('FocusScreen');
  };  

  const closeModal = () => {
    setModalVisible(!modalVisible);
  };



  return (
      <View style={styles.dailyview}>
      <View style={styles.overlay}>
        <Text style={styles.header}>Today's Schedule:</Text>
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
          timeStep={30}
          timesColumnWidth={0.14}
          startHour={currentTimeInMinutes}
          showNowLine={true}
          fixedHorizontally={true}
          onEventPress={handleTickEvent}
          onEventLongPress={(event) => handleLongPress(event)}
        />
      </View>  

      <Modal 
        animationType="slide"
        transparent={false}
        visible={modalVisible}>
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: StatusBar.currentHeight}}>

            <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 190}}>
              <Text style={styles.eventText}>{modalEvent ? modalEvent.description : "noevent"}</Text>
            </View>

            <View style={{paddingBottom: 300, alignItems: 'center', justifyContent: 'center'}}>
              <CountDownTimer duration={modalEventTime > 0 ? modalEventTime/1000 : 0} closeModal={closeModal}></CountDownTimer>

              <TouchableOpacity onPress={() => handleExitFocus()} testID= 'exit-button'>
                <Text style={{fontFamily: 'spacemono-bold', color: '#9AC791', fontSize: 15}}>Exit</Text>
              </TouchableOpacity>
            </View>

          </View>
      </Modal>
    </View>
  );
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
    },
    eventText: {
      fontFamily:'spacemono-bold', 
      fontSize: 30, 
      /* paddingBottom: 35, 
      paddingRight: 200, 
      paddingTop: 50, */
    },
    returnButton: {
      paddingRight: 250, 
      flexDirection: 'row',
      paddingBottom: 45
    }
}
)
