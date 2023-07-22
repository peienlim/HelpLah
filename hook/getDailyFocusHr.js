import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfigDB';
import { collection, onSnapshot } from 'firebase/firestore';
import { addFirestoreSubscription } from '../FirestoreManager';

export const getDailyFocusHr = (currDate) => {
    const [totalDuration, setTotalDuration] = useState(0);

    useEffect(() => {
        const auth = getAuth();
        const userEmail = auth.currentUser.email;

        const eventsRef = collection(db, 'users', userEmail, 'focusMode');
        const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
            const focusData = querySnapshot.docs.map((doc) => doc.data());

            const filteredData = focusData.filter((focusEvent) => {
                const focusEventDate = focusEvent.timeStarted.toDate();
                return focusEventDate.toDateString() === currDate.toDateString();
            });

            const sumOfDurations = filteredData.reduce((sum, focusEvent) => {
                return sum + focusEvent.duration;
            }, 0);

            setTotalDuration(sumOfDurations);
        });
        
        addFirestoreSubscription(unsubscribe);
        return unsubscribe;
    }, [currDate]);

    console.log(totalDuration); // This will log the updated value

    return totalDuration / 60;
};