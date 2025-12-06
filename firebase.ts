// Firebase configuration for Gogrichiani Studio
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCZjMZuac24uwIH1xprulUWse6LRc_zjjQ",
    authDomain: "gogrichiani-studio.firebaseapp.com",
    projectId: "gogrichiani-studio",
    storageBucket: "gogrichiani-studio.firebasestorage.app",
    messagingSenderId: "1050882943734",
    appId: "1:1050882943734:web:95a849c5945e57f1315ad7",
    measurementId: "G-NZNQES2XKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
