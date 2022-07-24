import React, {useContext, useEffect, useState} from 'react'
import { db } from '../../../database/firebase'
import { ref, onValue, update, push, child } from "firebase/database"
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../../context/userContext'

import '../../../public/css/app.css'

export const AccountPresentation= () => {

    //id présentation
    let { uuuid } = useParams();

    const [lapresentation, setPresentation] = useState([])
    const [ validation, setValidation ] = useState("");
    const [loadingData, setLoadingData] = useState(true);

    const {currentUser} = useContext(UserContext)

    //read
    useEffect(() => {
        onValue(ref(db, `/users/${currentUser.uid}/${uuuid}/`), (snapshot) => {
            setPresentation([])
            const data = snapshot.val()
            if(data !== null){
                Object.values(data).map((pres) => {
                    setPresentation((oldArray) => [...oldArray, pres])
                })
                setValidation("")
                setLoadingData(false)
            }else{
                setValidation("Aucune présentation.")
            }
        })
    }, [])

    //create slide
    const createSlide = () => {

        const uidUser = currentUser.uid
        const id_slide = push(child(ref(db), `/users/${uidUser}/${uuuid}`)).key;
        
        update(ref(db, `/users/${uidUser}/${uuuid}/slides/${id_slide}`), {
            img : "http://test2",
            id_slide: id_slide,
            title: "test2"
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

    }

    console.log(lapresentation[1])
    
    if(!loadingData && !validation){

        return (
            <>
                <nav className="navbarPres navbar-light bg-warning px-4">

                    <h1 className="navbar-brand text-light">Présentation : {lapresentation[0]}</h1>

                    <div>
                        <button className="btn btn-info ms-2">
                            <i className="fa-solid fa-play"></i>
                        </button>
                        <button onClick={createSlide} className="btn btn-info ms-2">
                            <i className="fa-solid fa-file-circle-plus"></i>
                        </button>
                        <button className="btn btn-info ms-2">
                            <i className="fa-solid fa-user-plus"></i>
                        </button>
                    </div>
                </nav>

                {lapresentation[1].map((slide) => (
                    <div className="card" key={slide.id_slide}>
                        <img class="card-img-top" src={slide.img} alt={slide.title}></img>
                        <div className="card-body">
                            <h5 className="card-title">{slide.title}</h5>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        </div>
                    </div>
                ))}
            </>
        )

    }else{

        return (
            <>
                <div className="container p-5">

                    <h1 className="display-3 text-light mb-4">{validation}</h1>

                </div>
            </>
        )

    }     
}
