import React, {useContext, useEffect, useState} from "react";
import reactDom from "react-dom";

import { db } from '../../database/firebase'
import { ref, onValue, update, push, child, remove } from "firebase/database"
import { UserContext } from '../context/userContext'

import '../../public/css/app.css'

const modalCollab = ({ isShow, hide }) => {

  const [users, setUsers] = useState([])

  const {currentUser} = useContext(UserContext)

  //read slides
  useEffect(() => {
    onValue(ref(db, `/users/${currentUser.uid}`), (snapshot) => {
      setUsers([])
      const data = snapshot.val()
      if(data !== null){
          Object.values(data).map((user) => {
            setUsers((oldArray) => [...oldArray, user])
          })
      }else{
      }
    })
  }, [])

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
                <div className="modal-body">
                  {users.map((user) => (
                    <div key={user.uuid} className="d-flex p-2">

                      
                        
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