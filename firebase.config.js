// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJZ2dD5Qb6aYngH3aSQbmKwVN_umwnDS4",
  authDomain: "campus-multiplataforma.firebaseapp.com",
  projectId: "campus-multiplataforma",
  storageBucket: "campus-multiplataforma.firebasestorage.app",
  messagingSenderId: "867993435245",
  appId: "1:867993435245:web:52f0de9e51d09ea79e5364",
  measurementId: "G-M8VND6VX4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);