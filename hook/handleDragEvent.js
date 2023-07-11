import { db } from '../firebaseConfigDB';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const handleDragEvent = (event, newStartDate, newEndDate) => {
    // Calculate the time difference in minutes
    const timeDifference = Math.abs(newStartDate - newEndDate) / (1000 * 60);

    // Round the new start date to the nearest multiple of 5 minutes
    const roundedMinutes = Math.round(newStartDate.getMinutes() / 5) * 5;
    const roundedStartDate = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate(), newStartDate.getHours(), roundedMinutes);
  
    // Adjust the end date based on the rounded start date
    const adjustedEndDate = new Date(roundedStartDate.getTime() + timeDifference * 1000 * 60);
  

    async function handleUpdateEvent() {
        try {
            const auth = getAuth();
            const userEmail = auth.currentUser.email;
            const docRef = doc(db, 'users', userEmail, "events", event.id);
            console.log(event);
            await setDoc(docRef, {
                id: event.id,
                description: event.description,
                startDate: roundedStartDate,
                endDate: adjustedEndDate,
                colour: event.color,
                category: event.category,
                completed: event.completed,
                nusmods: event.nusmods,
            });
        } catch (error) {
            console.log(error);
        }
    }

    handleUpdateEvent();
};