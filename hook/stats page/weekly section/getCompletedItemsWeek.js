import React, {useState, useEffect} from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../../firebaseConfigDB';
import { collection, onSnapshot } from 'firebase/firestore';

import moment from 'moment';

// duration is in seconds
export const getCompletedItemsWeek = (weekStart, weekEnd) => {

    const auth = getAuth();
    const userEmail = auth.currentUser.email;

    const [numComplete, setNumComplete] = useState(0);
    const [numIncomplete, setNumIncomplete] = useState(0);

    const [modsPieLabel, setModsPieLabel] = useState([]);
    const [modsPieData, setModsPieData] = useState([]);
 
    const [categoriesPieLabel, setCategoriesPieLabel] = useState([]);
    const [categoriesPieData, setCategoriesPieData] = useState([]);

    const calculateDurationInHours = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        const durationInMs = end.diff(start);
        const durationInHours = moment.duration(durationInMs).asHours();
        return durationInHours;
    };

    // retrieve data from realtime database
    const getEvents = () => {
        try {
            const eventsRef = collection(db, 'users', userEmail, 'events');

            const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
                const eventsData = querySnapshot.docs.map((doc) => doc.data());

                const weekEvents = eventsData.filter((event) => { 
                    const eventStartDate = moment(event.startDate.toDate());
                    console.log(eventStartDate);
                    return eventStartDate.isBetween(weekStart, weekEnd, null, '[]');
                }); 

                // get number of completed events
                const completedEvents = weekEvents.filter((event) => {
                    return event.completed === true;
                })  

                setNumComplete(completedEvents.length);


                // get number of uncompleted events
                const uncompletedEvents = weekEvents.filter((event) => {
                    return event.completed === false;
                })  

                setNumIncomplete(uncompletedEvents.length);


                // get mods task distribution
                const moduleHoursMap = completedEvents.reduce((acc, event) => {
                    const moduleName = event.moduleName;
                    const durationInHours = calculateDurationInHours(event.startDate.toDate(), event.endDate.toDate());
                    acc[moduleName] = (acc[moduleName] || 0) + durationInHours;
                    return acc;
                })

                console.log('modHoursMap: ', moduleHoursMap)


                const modNamesArray = Object.keys(moduleHoursMap);
                setModsPieLabel(modNamesArray);

                const modTransformedData = Object.keys(moduleHoursMap).map((moduleName) => ({
                    x: moduleName,
                    y: moduleHoursMap[moduleName],
                }));

                setModsPieData(modTransformedData);


                // get categories task distribution
                const categoriesHoursMap = completedEvents.reduce((acc, event) => {
                    const category = event.category;
                    const durationInHours = calculateDurationInHours(event.startDate.toDate(), event.endDate.toDate());
                    acc[category] = (acc[category] || 0) + durationInHours;
                    return acc;
                })

                const categoryNamesArray = Object.keys(categoriesHoursMap);
                setCategoriesPieLabel(categoryNamesArray);

                const catTransformedData = Object.keys(categoriesHoursMap).map((category) => ({
                    x: category,
                    y: moduleHoursMap[category],
                }));

                setCategoriesPieData(catTransformedData);
                
            });

            // Return an unsubscribe function to stop listening for updates
            return unsubscribe;

        } catch (error) {
            console.log('hi: ', error);
        }
    };  

    // handles side effect from changing the state of object
    useEffect(() => {
        getEvents();
    }, [weekStart, weekEnd]); 

    console.log('before returning: ', numComplete);

    return {
        numComplete,
        numIncomplete,
        modsPieLabel,
        modsPieData,
        categoriesPieLabel,
        categoriesPieData,
    };

};
