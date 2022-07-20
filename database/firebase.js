// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA49AFSguiX2-lWmgvySFWaYWFnMic_o7g",
  authDomain: "slides-app-86d02.firebaseapp.com",
  projectId: "slides-app-86d02",
  storageBucket: "slides-app-86d02.appspot.com",
  messagingSenderId: "812723778505",
  appId: "1:812723778505:web:86f091074affddbb2e6e18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider).then((result) => {
    console.log(result);
    localStorage.setItem("email", email);
  })
  .catch((error) => {
    console.log(error);
  });
};