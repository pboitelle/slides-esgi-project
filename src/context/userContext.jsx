import React, { createContext, useState, useEffect } from "react";

import { signInWithEmailAndPassword,
 createUserWithEmailAndPassword,
onAuthStateChanged,
signInWithPopup} from "firebase/auth";
import { auth, providerFacebook, providerGoogle } from "../../database/firebase";

import { useNavigate } from "react-router-dom";

export const UserContext = createContext()

export const UserContextProvider = (props) => {

    const navigate = useNavigate();

    const signUp = (email, pwd) => createUserWithEmailAndPassword(auth, email, pwd)
    const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

    const signInWithGoogle = () => {

        signInWithPopup(auth, providerGoogle).then((result) => {
      
          const emailUserGoogle = result.user.email
          const nameUserGoogle = result.user.displayName
          const imgUserGoogle = result.user.photoURL
      
          localStorage.setItem("emailUserGoogle", emailUserGoogle)
          localStorage.setItem("nameUserGoogle", nameUserGoogle)
          localStorage.setItem("imgUserGoogle", imgUserGoogle)

          navigate("/account/home");
      
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const signInWithFacebook = () => {

        signInWithPopup(auth, providerFacebook).then((result) => {

        console.log(result);
      
          const emailUserGoogle = result.user.email
          const nameUserGoogle = result.user.displayName
          const imgUserGoogle = result.user.photoURL
      
          localStorage.setItem("emailUserGoogle", emailUserGoogle)
          localStorage.setItem("nameUserGoogle", nameUserGoogle)
          localStorage.setItem("imgUserGoogle", imgUserGoogle)

          navigate("/account/home");
      
        })
        .catch((error) => {
          console.log(error);
        });
    }

    const [currentUser, setCurrentUser] = useState();
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser(currentUser)
            setLoadingData(false)
        })

        return unsubscribe;

    }, [])

    return (
        <UserContext.Provider value={{signUp, signIn, signInWithGoogle, signInWithFacebook, currentUser}}>
            {!loadingData && props.children}
        </UserContext.Provider>
    )
} 