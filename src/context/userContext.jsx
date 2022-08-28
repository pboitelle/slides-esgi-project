import React, { createContext, useState, useEffect } from "react";

import { signInWithEmailAndPassword,
 createUserWithEmailAndPassword,
onAuthStateChanged,
signInWithPopup} from "firebase/auth";
import { auth, providerFacebook, providerGoogle, db } from "../../database/firebase";
import { ref, set, update } from "firebase/database"

import { useNavigate } from "react-router-dom";

export const UserContext = createContext()

export const UserContextProvider = (props) => {

    const navigate = useNavigate();

    const signUp = (email, pwd) => createUserWithEmailAndPassword(auth, email, pwd)
    const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

    const [currentUser, setCurrentUser] = useState();
    const [loadingData, setLoadingData] = useState(true);

    const signInWithGoogle = () => {

        signInWithPopup(auth, providerGoogle).then((result) => {
      
          const emailUserGoogle = result.user.email
          const nameUserGoogle = result.user.displayName
          const imgUserGoogle = result.user.photoURL

          localStorage.setItem("emailUser", emailUserGoogle)
          localStorage.setItem("nameUser", nameUserGoogle)
          localStorage.setItem("imgUser", imgUserGoogle)

          navigate("/account/home");
      
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const signInWithFacebook = () => {

        signInWithPopup(auth, providerFacebook).then((result) => {

          const emailUserFb = result.user.email
          const nameUserFb = result.user.displayName
          const imgUserFb = result.user.photoURL

          localStorage.setItem("emailUser", emailUserFb)
          localStorage.setItem("nameUser", nameUserFb)
          localStorage.setItem("imgUser", imgUserFb)

          navigate("/account/home");
      
        })
        .catch((error) => {
          console.log(error);
        });
    }

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser)
            setLoadingData(false)
        })

        if(currentUser){
          navigate("/account/home");
        }

        return unsubscribe;

    }, [])

    return (
        <UserContext.Provider value={{signUp, signIn, signInWithGoogle, signInWithFacebook, currentUser}}>
            {!loadingData && props.children}
        </UserContext.Provider>
    )
} 