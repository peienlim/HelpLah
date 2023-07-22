import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfigDB';
import { collection, onSnapshot } from 'firebase/firestore';

import { addFirestoreSubscription } from '../FirestoreManager';

export const getDailyTaskCompleted = (currDate) => {
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [taskCompletedCount, setTaskCompletedCount] = useState(0);


    useEffect(() => {
        const auth = getAuth();
        const userEmail = auth.currentUser.email;

        const eventsRef = collection(db, 'users', userEmail, 'events');
        const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
            const eventsData = querySnapshot.docs.map((doc) => doc.data());
      
            const filteredData = eventsData.filter((event) => {
              const completeStatus = event.completed;
              const eventDate = event.startDate.toDate();
              const isNusMod = event.nusmods;
              return completeStatus === true && eventDate.toDateString() === currDate.toDateString() && isNusMod === false;
            });
      
            setTasksCompleted(filteredData);
        });
        addFirestoreSubscription(unsubscribe);
        return unsubscribe;
    }, []);

    useEffect(() => {
        const tasksCompletedCount = tasksCompleted.length;
        setTaskCompletedCount(tasksCompletedCount);
        console.log('Number of completed tasks:', tasksCompletedCount);
    }, [tasksCompleted]);

    return taskCompletedCount;
};