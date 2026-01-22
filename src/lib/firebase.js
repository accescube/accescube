import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics optional

const firebaseConfig = {
    apiKey: "AIzaSyB_V9jNj6RWM87gzPzxWh-ds20GKfAg1pg",
    authDomain: "accescube-d571b.firebaseapp.com",
    projectId: "accescube-d571b",
    storageBucket: "accescube-d571b.firebasestorage.app",
    messagingSenderId: "896940040254",
    appId: "1:896940040254:web:60de0efd52fa8a3119716f",
    measurementId: "G-SLHEQZJXSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
