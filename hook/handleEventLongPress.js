import React from 'react';
import { Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfigDB';
import { doc, deleteDoc } from 'firebase/firestore';

export const handleEventLongPress = (event) => {

  async function handleDeleteEvent() {
    try {
        //console.log(event)
        const auth = getAuth();
        const userEmail = auth.currentUser.email;
        const docRef = doc(db, 'users', userEmail, 'events', event.id);
        await deleteDoc(docRef);
        //onClose(); // Call the onClose prop to close the modal after deletion
    } catch (error) {
        console.log(error);
    }
  }

  const alertPopUp = () => {
    Alert.alert("Delete Event", "Are you sure you want to delete?", [
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