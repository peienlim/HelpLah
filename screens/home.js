import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';
import moment from 'moment';

import DailyView from '../components/home page components/dailyView';
import Event from '../components/home page components/Event';

import { db } from '../firebaseConfigDB';
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";

import { getAuth } from "firebase/auth";

export default function HomeScreen({navigation}) {

  // Retrieve's user's email from Firebase authentication
  const auth = getAuth();
  const userEmail = auth.currentUser.email;

  const [userData, setUserData] = useState({});
  const [eventsDC, setEventsDC] = useState([]);
  const [eventComponents, setEventComponents] = useState([]);
  const [productiveHours, setProductiveHours] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);    

  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = moment().format("ddd, DD MMMM YYYY");

  // Function to retrieve user's name from firestore using their unique email address
  const getUserInfo = async () => {
      const q = query(collection(db, "users"), where("email", "==", userEmail));
      const querySnapShot = await getDocs(q);
      querySnapShot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
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

  const updateEvDescr = (descr) => {
    if (descr.startsWith('T: ') || descr.startsWith('C: ') || descr.startsWith('O: ') || descr.startsWith('E: ')) {
      return descr.substring(3);
    } 
    return descr;
  }

  // retrieve data from realtime database
  const getEventsCat = () => {
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

        const eventDCs = filteredEvents
          .filter((event) => event.category === 'event')
          .map((event) => ({ colour: event.colour, description: updateEvDescr(event.description) }));
          setEventsDC(eventDCs);
          console.log(eventDCs);
      });

      // Return an unsubscribe function to stop listening for updates
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };  

  // handles side effect from changing the state of object
  useEffect(() => {
    getEventsCat();
  }, []);

  // for mapping the eventsDC data 
  useEffect(() => {
    const mappedComponents = eventsDC.map((event, index) => (
      <Event key={index} colour={event.colour} description={event.description} />
    ));
    setEventComponents(mappedComponents);
  }, [eventsDC]);


  // retrieve data from realtime database
  const getProductiveHours = () => {
    try {
      const eventsRef = collection(db, 'users', userEmail, 'events');

      const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
        const eventsData = querySnapshot.docs.map((doc) => doc.data());

        const filteredEvents = eventsData.filter((event) => { 
          const eventStartDate = event.startDate.toDate();
          const eventDate = eventStartDate.toDateString();
          const currentDate = selectedDate.toDateString();
          return eventDate === currentDate && event.completed;
        });

        const eventHours = filteredEvents.reduce((totalHours, event) => {
          const start = moment(event.startDate.toDate());
          const end = moment(event.endDate.toDate());
          const duration = moment.duration(end.diff(start));
          const hours = duration.asHours();
          return totalHours + hours;
        }, 0);

        const roundedHours = eventHours.toFixed(1);
        setProductiveHours(roundedHours);
      });

      // Return an unsubscribe function to stop listening for updates
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };  

  // handles side effect from changing the state of object
  useEffect(() => {
    getProductiveHours();
  }, []);



  // retrieve data from realtime database
  const getTasksData = () => {
    try {
      const eventsRef = collection(db, 'users', userEmail, 'events');

      const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
        const eventsData = querySnapshot.docs.map((doc) => doc.data());

        const filteredTasks = eventsData.filter((event) => { 
          const eventStartDate = event.startDate.toDate();
          const eventDate = eventStartDate.toDateString();
          const currentDate = selectedDate.toDateString();
          return eventDate === currentDate && event.category === 'task';
        });

        const completed = filteredTasks.filter((task) => task.completed);
        setCompletedTasks(completed.length);
        setTotalTasks(filteredTasks.length);
      });

      // Return an unsubscribe function to stop listening for updates
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  // handles side effect from changing the state of object
  useEffect(() => {
    getTasksData();
  }, []);


  return (
      <SafeAreaView style={styles.background}>

        <View style={styles.top}> 
          <Text style={styles.hello}>Hello {userData.name ? userData.name : 'Loading...'}!</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <View style={styles.todayce}>
          <Text style={styles.header}>Today's Events:</Text>
          <ScrollView>
            { eventComponents }
          </ScrollView>
        </View> 

        <DailyView/>

        <View style={styles.phc}>
          <View style={{flex:1, paddingBottom:5}}>
            <Text style={styles.header}>Productive Hours:</Text>
            <View style={styles.phccontainer}>
              <Text style={styles.phctext}>~{productiveHours}!</Text>
            </View>
          </View>

          <View style={{flex:1, paddingBotom: 5}}>
            <Text style={styles.header}>Completed tasks:</Text>
            <View style={styles.phccontainer}>
                <Text style={styles.phctext}>{completedTasks}/{totalTasks}!</Text>
            </View>
          </View>
        </View>

      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  background: {
    marginLeft: 3,
    flex: 1, 
    //paddingTop: 40,
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
    fontSize: 12,
    paddingTop: 2,
  },
  todayce: {
    flex: 1.5,
    paddingTop: 5,
  },
  phc: {
    paddingTop: 10,
    flexDirection:"row",
    flex: 1.3,
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
    paddingBottom: 4
  }, 


})

/* const auth = getAuth();
const email = auth.currentUser.email;
const userDocRef = doc(db, "users", email);
const [userData, setUserData] = useState({});

useEffect(() => {
  const getUser = async () => {
    const snap = await getDoc(userDocRef);
    setUserData({email, ...snap.data()});
  }
  getUser()
}, []); */

 /* const auth = getAuth();

  const user = auth.currentUser;
  const [userEmail, setUserEmail] = useState("");

  const [userInfo, setUserInfo] = useState({});
  //const {email, name} = userInfo;

  useEffect(() => {
    const getUserEmail = async () => {
      if (user) {
        setUserEmail(user.email);
      } else {
        console.log("User name not found!");
      }
    };
  }, [user]);

  useEffect(() => {
    const getUserInfo = async () => {
      const docRef = doc(db, 'users', userEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserInfo(data);
        console.log("Document data", data);
      } else {
        console.log("No such document!")
      }
    };
  }, [userEmail]);

  if (!userInfo) {
    return <Text>Loading ...</Text>;
  }
 */

/*   const auth = getAuth();
  const user = auth.currentUser;
  const [userEmail, setUserEmail] = useState("");

  // get the user's email address
 
  if (user) {
    //userEmail = user.email;
    setUserEmail(user.email);
  } else {
    console.log("User name not found!")
  }

  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
  });

  const getUserInfo = async () => {
    const q = query(collection(db, "users"), where("email", "==", userEmail));
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setUserInfo({
        ...doc.data(),
        id: doc.id,
      })
    });
    console.log(userInfo);
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  if (userInfo === null) {
    return {}; // Return null or loading indicator while waiting for data
  }  */
/* 
  const auth = getAuth();
  const user = auth.currentUser;
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const { email, name } = userInfo;

  useEffect(() => {
    const getUserEmail = async () => {
      if (user) {
        setUserEmail(user.email);
      } else {
        console.log("User name not found!");
      }
    };

    getUserEmail();
  }, [user]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (userEmail) {
        const q = query(collection(db, "users"), where("email", "==", userEmail));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const data = doc.data();
          setUserInfo({data});
        });
        console.log(userInfo);
      }
    };

    getUserInfo();
  }, [userEmail]);

  if (userInfo === {email: "", name: "",}) {
    return {email: "", name: "",}; // Return null or a loading indicator while waiting for data
  } */
