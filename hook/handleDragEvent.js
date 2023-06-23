import { db } from '../firebaseConfigDB';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const handleDragEvent = (event, newStartDate, newEndDate) => {

    async function handleUpdateEvent() {
        try {
            const auth = getAuth();
            const userEmail = auth.currentUser.email;
            const docRef = doc(db, 'users', userEmail, "events", event.id);
            console.log(event);
            await setDoc(docRef, {
                id: event.id,
                description: event.description,
                startDate: newStartDate,
                endDate: newEndDate,
                colour: event.color,
            });
        } catch (error) {
            console.log(error);
        }
    }

    handleUpdateEvent();
};