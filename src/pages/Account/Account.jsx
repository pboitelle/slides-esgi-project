import React, {useContext} from 'react'
import { UserContext } from '../../context/userContext'
import { Outlet, Navigate } from 'react-router-dom'

export const Account = () => {

    const {currentUser} = useContext(UserContext)

    if(!currentUser){
        return <Navigate to="/"></Navigate>
    }

    return (
        <>
            <div className="container">
                <Outlet/>
            </div>
        </>
    )
}
