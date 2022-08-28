import React, {useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../../database/firebase'
import { signOut } from 'firebase/auth'
import { UserContext } from '../context/userContext'

import '../../public/css/app.css'


const UserGreeting = () => {

  const navigate = useNavigate()

  const logOut = async () => {
    try {

      await signOut(auth)
      localStorage.clear();
      navigate("/")     
      
    } catch (error) {

      alert("Impossible de vous déconnecter, veuillez vérifier votre connexion internet.")
      
    }
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
        <Link to="/" className="navbar-brand">PWA - Slides ESGI</Link>

        {/* <div>
          <Link to="/account/home" className="btn btn-primary ms-2">Mon compte</Link>
          <button onClick={logOut} className="btn btn-danger ms-2">Déconnexion</button>
        </div> */}

        <div className="navbar-btn">

          <Link to="/account/home" className="btn-avatar">
            <img className="avatar" referrerPolicy="no-referrer" src={localStorage.getItem("imgUser")} alt="Avatar" />
          </Link>

        </div>
    </nav>
  )
}

const GuestGreeting = () => {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
        <Link to="/" className="navbar-brand">PWA - Slides ESGI</Link>

        <div className="navbar-btn-guest">
          <Link to="/inscription" className="btn btn-outline-primary btn-sm ms-2">Inscription</Link>
          <Link to="/" className="btn btn-primary btn-sm ms-2">Connexion</Link>
        </div>
    </nav>
  )
}

export const Navbar = () => {

  const {currentUser} = useContext(UserContext)

  if(currentUser){

    return <UserGreeting />;

  }else{

    return <GuestGreeting />;

  }
}