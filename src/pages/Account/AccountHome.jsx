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
    const [invitations, setInvitations] = useState([])
    
    const handleOnChange = (e) => {
        setName(e.target.value)
    }

    //read
    useEffect(() => {
        onValue(ref(db, `/users/${currentUser.uid}/presentations/`), (snapshot) => {
            setPresentations([])
            const data = snapshot.val()
            if(data !== null){
                Object.values(data).map((pres) => {
                    setPresentations((oldArray) => [...oldArray, {uuid: pres.uuid, name: pres.name}])
                })
            }
        })

        onValue(ref(db, `/users/${currentUser.uid}/invitations/`), (snapshot) => {
            setInvitations([])
            const data = snapshot.val()
            
            if(data !== null){
                Object.values(data).map((user, key) => {
                    let user_id = Object.keys(data)[key]
                    onValue(ref(db, `/users/${user_id}/presentations/`), (snapshot) => {

                        const data = snapshot.val()
                        
                        if(data !== null){
                            Object.values(data).map((pres) => {
                                setInvitations((oldArray) => [...oldArray, {user_id: user_id, uuid: pres.uuid, name: pres.name}])
                            })
                        }
                    })
                })
            }
        })

        let updateUser = {
            uid: currentUser.uid
        }

        localStorage.getItem("emailUser") ? updateUser["email"] = localStorage.getItem("emailUser"):""
        localStorage.getItem("nameUser") ? updateUser["name"] = localStorage.getItem("nameUser"):""
        localStorage.getItem("imgUser") ? updateUser["photoURL"] = localStorage.getItem("imgUser"):""

        update(ref(db, `/users/${currentUser.uid}/`), updateUser).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    //create
    const createPresentation = () => {

        const uidUser = currentUser.uid

        const uuid = uid()
        
        set(ref(db, `/users/${uidUser}/presentations/${uuid}`), {
            name,
            uuid
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

        setName('');

        const id_slide = push(child(ref(db), `/users/${uidUser}/presentations/${uuid}`)).key;
        
        update(ref(db, `/users/${uidUser}/presentations/${uuid}/slides/${id_slide}`), {
            id_slide: id_slide,
            contenu: ""
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

    }

    //delete
    const handleDeletePresentation = (presentation) => {
        remove(ref(db, `/users/${currentUser.uid}/presentations/${presentation.uuid}`))
    }

    const handleEditPresentation = (e, id_presentation) => {
        const uidUser = currentUser.uid

        let value = e.target.value;

        update(ref(db, `/users/${uidUser}/presentations/${id_presentation}/`), {
            name: value
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })
    };

    return (
        <>
            <nav className="navbar navbar-dark bg-dark px-3">

                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"></span>

                    <input type="text" className="form-control" placeholder="Rechercher une présentation" />

                </div>

                <Link to="/account/home" className="btn-avatar">
                    <img className="avatar" referrerPolicy="no-referrer" src={localStorage.getItem("imgUser")} alt="Avatar" />
                </Link>
        
            </nav>

            <div>

                <h1 className="display-3 text-light mb-4 m-t-50">
                    Bienvenue {localStorage.getItem("nameUser")} !
                </h1>

                <div className="btn-group mb-4">
                    <input className="form-control" type="text" onChange={handleOnChange} value={name} />
                    <button className="btn btn-primary" onClick={createPresentation}>Nouvelle présentation</button>
                </div>

                <h5 className="card-title">Mes présentations</h5>
                <div className="row-custom mb-4">
                    {presentations.map((pres) => (
                        <div key={pres.uuid} className="col-6 p-2">
                            <div className="card-custom">

                                <Link to={`/account/home/${pres.uuid}`} className="btn-avatar">
                                    <img src="https://via.placeholder.com/150C/O" className="card-img-top" alt={pres.name} />
                                </Link>

                                <div className="card-body-custom">

                                    <input className="card-input" value={pres.name} onChange={(e) => handleEditPresentation(e, pres.uuid)}/>

                                    <button onClick={() => handleDeletePresentation(pres)} className="btn btn-danger btn-sm mx-1">
                                        <i className="fa-solid fa-trash text-white"></i>
                                    </button>
                                    
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                <h5 className="card-title">Partagés avec moi</h5>
                <div className="row-custom mb-4">
                    {invitations.map((pres) => (
                        <div key={pres.uuid} className="col-6 p-2">
                            <div className="card-custom">

                                <Link to={`/account/home/invited/${pres.user_id}/${pres.uuid}`} className="btn-avatar">
                                    <img src="https://via.placeholder.com/150C/O" className="card-img-top" alt={pres.name} />
                                </Link>

                                <div className="card-body-custom">

                                    <div className="card-input" >{pres.name}</div>
                                    
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </>
    )
}
