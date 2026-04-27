import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_E4lFrqUMouQnqNNzbyNHN2BlXK9oIDM",
  authDomain: "codevault-b6695.firebaseapp.com",
  projectId: "codevault-b6695",
  storageBucket: "codevault-b6695.firebasestorage.app",
  messagingSenderId: "339575165282",
  appId: "1:339575165282:web:02d89a51e80e3313635c3b",
}
console.log("FIREBASE CONFIG LOADED:", firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

export default app
