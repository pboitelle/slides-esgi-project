import React, {useContext, useEffect, useState} from "react";
import reactDom from "react-dom";

import { db } from '../../database/firebase'
import { ref, onValue, update, push, child, remove } from "firebase/database"
import { UserContext } from '../context/userContext'

import '../../public/css/app.css'

const modalCollab = ({ isShow, hide, idPresentation, collaborators, setCollaborators }) => {

  const [users, setUsers] = useState([])

  const {currentUser} = useContext(UserContext)

  //select all users 
  useEffect(() => {
    onValue(ref(db, `/users/`), (snapshot) => {
      setUsers([])
      setCollaborators([])
      const data = snapshot.val()

      let tab = [];

      if(data[currentUser.uid].presentations[idPresentation].collaborators){
        Object.values(data[currentUser.uid].presentations[idPresentation].collaborators).map((collab) => {
            setCollaborators((oldArray) => [...oldArray, collab.user_id])
            tab.push(collab.user_id)
        })
      }

      if(data !== null){
        Object.values(data).map((user) => {
          if(/*!tab.includes(user.uid) &&*/ user.uid !== currentUser.uid){
            setUsers((oldArray) => [...oldArray, {uid: user.uid, name: user.name, email: user.email, img: user.photoURL}])
          }
        })
      }else{
      }
    })
  }, [])

  //add collaborator
  const handleCollaborate = (user_id) => {

    const uidUser = currentUser.uid;

    update(ref(db, `/users/${uidUser}/presentations/${idPresentation}/collaborators/${user_id}`), {
      user_id
    }).then(() => {

    }).catch((error) => {
        console.log(error)
    })

    update(ref(db, `/users/${user_id}/invitations/${uidUser}/${idPresentation}`), {
      idPresentation
    }).then(() => {

    }).catch((error) => {
        console.log(error)
    })
  }

  const handleDeleteCollaborate = (user) => {
    remove(ref(db, `/users/${currentUser.uid}/presentations/${idPresentation}/collaborators/${user}`))

    remove(ref(db, `/users/${user}/invitations/${currentUser.uid}/${idPresentation}/`))
  }

  return isShow
    ? reactDom.createPortal(
        <>
          <div className="modal-overlay-collab">
            <div className="modal-wrapper-collab">
              <div className="modal-collab">
                <div className="modal-header-collab">
                  <h4>Ajouter un collaborateur</h4>
                  <button
                    type="button"
                    className="modal-close-button"
                    onClick={hide}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body-collab">
                  {users.map((user) => (
                    <div key={user.uid} className="card-profile">

                      <img referrerPolicy="no-referrer" src={user.img} alt="Avatar" />
                      <div>{user.email}<br/>{user.name}</div> 

                      {
                        collaborators && collaborators.includes(user.uid) 
                        ? 
                        <button className="btn btn-danger btn-sm float-right" onClick={() => handleDeleteCollaborate(user.uid)}>
                            <i className="fa-solid fa-user-slash"></i>
                        </button> 
                        : 
                        <button className="btn btn-primary btn-sm float-right" onClick={() => handleCollaborate(user.uid)}>
                            <i className="fa-solid fa-user-plus"></i>
                        </button>
                      }

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null;
  }

export default modalCollab;