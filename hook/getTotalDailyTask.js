import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfigDB';
import { collection, onSnapshot } from 'firebase/firestore';

import { addFirestoreSubscription } from '../FirestoreManager';

export const getTotalDailyTask = (currDate) => {
    const [totalTasks, setTotalTasks] = useState([]);
    const [totalTaskCount, setTotalTaskCount] = useState(0);


    useEffect(() => {
        const auth = getAuth();
        const userEmail = auth.currentUser.email;

        const eventsRef = collection(db, 'users', userEmail, 'events');
        const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
            const eventsData = querySnapshot.docs.map((doc) => doc.data());
      
            const filteredData = eventsData.filter((event) => {
              const eventDate = event.startDate.toDate();
              const eventType = event.category;
              const isNusMod = event.nusmods;
              return eventDate.toDateString() === currDate.toDateString() && isNusMod === false;
            });
      
            setTotalTasks(filteredData);
        });

        addFirestoreSubscription(unsubscribe);
        return unsubscribe;
    }, []);

    useEffect(() => {
        const count = totalTasks.length;
        setTotalTaskCount(count);
        console.log('Number of completed tasks:', count);
    }, [totalTasks]);

    return totalTaskCount;
};