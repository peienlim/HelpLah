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
        setUserData({
          ...doc.data(),
          id: doc.id,
        })
        console.log(doc.id, " => ", doc.data());
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
          <Text style={{fontFamily: 'spacemono-bold'}}>Home Page</Text> 
          <Text style={{fontFamily: 'spacemono-bold'}}>Hello {userData.name} !</Text>
          <Text style={styles.date}>Mon, 12 June 2023</Text>
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
    // backgroundColor: 'red'
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
