import React, {useState, useContext, useEffect} from 'react'
import { db } from '../../../database/firebase'
import { set, ref, onValue, remove, update, push, child } from "firebase/database"
import { UserContext } from '../../context/userContext'
import { Link } from 'react-router-dom'
import { uid } from 'uid'

export const AccountHome = () => {

    const {currentUser} = useContext(UserContext)

    const [name, setName] = useState('')
    const [presentations, setPresentations] = useState([])
    
    const handleOnChange = (e) => {
        setName(e.target.value)
    }

    //read
    useEffect(() => {
        onValue(ref(db, `/users/${currentUser.uid}/`), (snapshot) => {
            setPresentations([])
            const data = snapshot.val()
            if(data !== null){
                Object.values(data).map((pres) => {
                    setPresentations((oldArray) => [...oldArray, pres])
                })
            }
        })
    }, [])

    //create
    const createPresentation = () => {

        const uidUser = currentUser.uid

        const uuid = uid()
        
        set(ref(db, `/users/${uidUser}/${uuid}`), {
            name,
            uuid
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

        setName('');

        const id_slide = push(child(ref(db), `/users/${uidUser}/${uuid}`)).key;
        
        update(ref(db, `/users/${uidUser}/${uuid}/slides/${id_slide}`), {
            img : "",
            id_slide: id_slide,
            title: "Présentation sans titre"
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

    }

    //delete
    const handleDeletePresentation = (presentation) => {
        remove(ref(db, `/users/${currentUser.uid}/${presentation.uuid}`))
    }
    

    return (
        <>
            <div className="">

                <h1 className="display-3 text-light mb-4 p-t-50">
                    Bienvenue {localStorage.getItem("nameUserGoogle")} !
                </h1>
                
                <br /><br />

                <input type="text" onChange={handleOnChange} value={name} />
                <button onClick={createPresentation}>Add</button>
                <br /><br />
                <div >
                    {presentations.map((pres) => (
                        <div key={pres.uuid} className="d-flex p-2">
                            <div className="p-2 border boder-white w-100 mx-2 d-flex align-items-center">
                                <i className="fa-solid fa-file-lines text-white"></i>
                                <h2 className="display-5 text-light text-center m-auto">{pres.name}</h2>

                                <Link to={`/account/${pres.uuid}`} className="btn btn-primary mx-2 px-2"><i className="fa-solid fa-file-pen text-white"></i></Link>
                                
                                <button onClick={() => handleDeletePresentation(pres)} className="btn btn-danger mx-2 px-2"><i className="fa-solid fa-trash text-white"></i></button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
