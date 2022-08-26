import React, {useContext, useEffect, useState} from 'react'
import { db } from '../../../database/firebase'
import { ref, onValue, update, push, child, remove } from "firebase/database"
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../../context/userContext'

import '../../../public/css/app.css'

import Modal from '../../components/modalCollab'
import Slide from '../../components/Slide'
import useModal from '../../context/useModal'


export const AccountPresentation= () => {

    //modal
    const { isShow, toggle } = useModal();

    //id présentation
    let { uuuid } = useParams();

    const [lapresentation, setPresentation] = useState([])
    const [validation, setValidation ] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [lengthSlide, setLengthSlide] = useState(0);

    const {currentUser} = useContext(UserContext)

    //read slides
    useEffect(() => {
        onValue(ref(db, `/users/${currentUser.uid}/${uuuid}/`), (snapshot) => {
            setPresentation([])
            const data = snapshot.val()
            setLengthSlide(Object.keys(data.slides).length)
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


    //delete slide
    const handleDeleteSlide = (slide) => {
        if(lengthSlide > 1){
            remove(ref(db, `/users/${currentUser.uid}/${uuuid}/slides/${slide}`))
        }
    }

    //create slide
    const createSlide = () => {

        const uidUser = currentUser.uid
        const id_slide = push(child(ref(db), `/users/${uidUser}/${uuuid}`)).key;
        
        update(ref(db, `/users/${uidUser}/${uuuid}/slides/${id_slide}`), {
            id_slide: id_slide,
            contenu: ""
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

    }

    const handleChangeSlide = (canvas, id_slide) => {
        const uidUser = currentUser.uid

        const json = JSON.stringify( canvas.target.toJSON() );

        console.log(canvas)
        
        // update(ref(db, `/users/${uidUser}/${uuuid}/slides/${id_slide}`), {
        //     contenu: json
        // }).then(() => {
        //     // data saved
        // }).catch((error) => {
        //     console.log(error)
        // })
    };


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

                        <button onClick={toggle} className="btn btn-info ms-2 modal-toggle" >
                            <i className="fa-solid fa-user-plus"></i>
                        </button>

                        <Modal isShow={isShow} hide={toggle} />

                    </div>
                </nav>
                

                {Object.keys(lapresentation[1]).map((key, slide) => (

                    <div key={lapresentation[1][key].id_slide}>

                        <Slide canvasModifiedCallback={(e) => handleChangeSlide(e, lapresentation[1][key].id_slide)} />

                        <div className="bg-dark d-flex justify-content-end">
                            <button onClick={() => handleDeleteSlide(lapresentation[1][key].id_slide)} className="btn btn-danger mx-2 px-2"><i className="fa-solid fa-trash text-white"></i></button>
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
