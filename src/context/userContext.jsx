import React, { createContext, useState, useEffect } from "react";

import { signInWithEmailAndPassword,
 createUserWithEmailAndPassword,
onAuthStateChanged} from "firebase/auth";
import { auth, signInWithGoogle } from "../../database/firebase";

export const UserContext = createContext()

export const UserContextProvider = (props) => {

    const signUp = (email, pwd) => createUserWithEmailAndPassword(auth, email, pwd)
    const signIn = (email, pwd) => signInWithEmailAndPassword(auth, email, pwd)

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
        <UserContext.Provider value={{signUp, signIn, currentUser}}>
            {!loadingData && props.children}
        </UserContext.Provider>
    )
} 