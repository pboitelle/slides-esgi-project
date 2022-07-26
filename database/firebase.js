// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getDatabase} from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyA49AFSguiX2-lWmgvySFWaYWFnMic_o7g",
  authDomain: "slides-app-86d02.firebaseapp.com",
  databaseURL: "https://slides-app-86d02-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "slides-app-86d02",
  storageBucket: "slides-app-86d02.appspot.com",
  messagingSenderId: "812723778505",
  appId: "1:812723778505:web:86f091074affddbb2e6e18"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const providerGoogle = new GoogleAuthProvider()

export const providerFacebook = new FacebookAuthProvider();

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);