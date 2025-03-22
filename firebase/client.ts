// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1mPac2pyiTFXrEO-NEUSSlNldizNt0wg",
  authDomain: "interview-hero-46572.firebaseapp.com",
  projectId: "interview-hero-46572",
  storageBucket: "interview-hero-46572.appspot.com",
  messagingSenderId: "957876449469",
  appId: "1:957876449469:web:a92fe1c63ed247534347d4",
  measurementId: "G-15E6P2N18B",
};

// Debug: Log the configuration (without sensitive values)
console.log("Firebase Config:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? "***" : undefined,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
