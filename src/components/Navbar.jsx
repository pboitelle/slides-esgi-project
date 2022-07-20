import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../database/firebase'
import { UserContext } from '../context/userContext'


const UserGreeting = () => {

  const navigate = useNavigate()

  const logOut = async () => {
    try {

      await signOut(auth)
      navigate("/")     
      
    } catch (error) {

      alert("Impossible de vous déconnecter, veuillez vérifier votre connexion internet.")
      
    }
  }

  return (
    <nav className="navbar navbar-light bg-light px-4">
        <Link to="/" className="navbar-brand">Progressive Web App - Slides app</Link>

        <div>
          <Link to="/account/home" className="btn btn-primary ms-2">Mon compte</Link>
          <button onClick={logOut} className="btn btn-danger ms-2">Déconnexion</button>
        </div>
    </nav>
  )
}

const GuestGreeting = () => {
  return (
    <nav className="navbar navbar-light bg-light px-4">
        <Link to="/" className="navbar-brand">Progressive Web App - Slides app</Link>

        <div>
          <Link to="/inscription" className="btn btn-primary ms-2">Inscription</Link>
          <Link to="/" className="btn btn-primary ms-2">Connexion</Link>
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
