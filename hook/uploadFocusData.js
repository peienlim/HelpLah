import React, {useState} from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfigDB';
import { doc, setDoc } from 'firebase/firestore';
import { generateUUID } from './generateUUID';


// duration is in seconds
export const uploadFocusData = (duration, timeStarted) => {
    const auth = getAuth();
    const userEmail = auth.currentUser.email;

    async function handleUploadFocusData() {
        try {
            const uniqueID = generateUUID(15);
            const docRef = doc(db, 'users', userEmail, "focusEvent", uniqueID);
            await setDoc(docRef, {
                id: uniqueID,
                duration: duration,
                timeStarted: timeStarted,
            });

        } catch(error) {
            console.log(error);
        }
    };

    handleUploadFocusData();
};
