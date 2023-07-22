let firestoreSubscriptions = [];

export const addFirestoreSubscription = (unsubscribeFn) => {
  firestoreSubscriptions.push(unsubscribeFn);
};

export const cleanupFirestoreSubscriptions = () => {
  firestoreSubscriptions.forEach((unsubscribeFn) => unsubscribeFn());
  firestoreSubscriptions = [];
};
