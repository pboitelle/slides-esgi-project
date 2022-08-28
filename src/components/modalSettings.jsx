import React, {useContext, useState} from "react";
import reactDom from "react-dom";
import { useNavigate } from 'react-router-dom'

import { auth } from '../../database/firebase'
import { signOut } from 'firebase/auth'

import { UserContext } from '../context/userContext'

import '../../public/css/app.css'

const modalSettings = ({ isShow, hide, namePresentation }) => {

    const navigate = useNavigate()

    const [users, setUsers] = useState([])

    const {currentUser} = useContext(UserContext)

    const logOut = async () => {
        try {

            await signOut(auth)
            localStorage.clear();
            navigate("/")     
        
        } catch (error) {

        alert("Impossible de vous déconnecter, veuillez vérifier votre connexion internet.")
        
        }
    }

  return isShow
    ? reactDom.createPortal(
        <>
            <div className="modal-overlay-settings">
                <div className="modal-wrapper-settings">
                    <div className="modal-settings">
                        <div className="modal-header-settings">
                            <h5>{namePresentation}</h5>
                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={hide}
                            >
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body-settings">
                            
                            <div>Partager</div>

                            <div>Exporter</div>

                            <div onClick={logOut}>Se déconnecter</div>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
      )
    : null;
  }

export default modalSettings;