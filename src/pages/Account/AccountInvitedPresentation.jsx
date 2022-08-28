import React, {useContext, useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../../context/userContext'

import { db, auth } from '../../../database/firebase'
import { ref, onValue, update, push, child, remove } from "firebase/database"

import '../../../public/css/app.css'

import ModalSettings from '../../components/modalSettings'
import Slide from '../../components/Slide'
import useModal from '../../context/useModal'


export const AccountInvitedPresentation = () => {

    //modal
    const [ isShowSettings, toggleSettings ] = useModal();

    //ids
    const { uuuid } = useParams();
    const { user_id } = useParams();

    const [lapresentation, setPresentation] = useState([])
    const [slides, setSlides] = useState([])

    const [validation, setValidation ] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [lengthSlide, setLengthSlide] = useState(0);

    const {currentUser} = useContext(UserContext)

    //read slides
    useEffect(() => {
        onValue(ref(db, `/users/${user_id}/presentations/${uuuid}/`), (snapshot) => {
            setPresentation([])
            setSlides([])
            const data = snapshot.val()
            setLengthSlide(Object.keys(data.slides).length)
            if(data !== null){
                
                setPresentation({name: data.name, uuid: data.uuid})

                if(data.slides){
                    Object.values(data.slides).map((slide) => {
                        setSlides((oldArray) => [...oldArray, slide])
                    })
                }
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
            remove(ref(db, `/users/${user_id}/presentations/${uuuid}/slides/${slide}`))
        }
    }

    //create slide
    const createSlide = () => {
        const id_slide = push(child(ref(db), `/users/${user_id}/presentations/${uuuid}`)).key;
        
        update(ref(db, `/users/${user_id}/presentations/${uuuid}/slides/${id_slide}`), {
            id_slide: id_slide,
            contenu: ""
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

    }

    const handleChangeSlide = (canvas, id_slide) => {

        const json = JSON.stringify( canvas.target.canvas.toJSON() );
        
        update(ref(db, `/users/${user_id}/presentations/${uuuid}/slides/${id_slide}`), {
            contenu: json
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })
    };


    if(!loadingData && !validation){

        return (
            <>
                <nav className="navbarPres navbar-light bg-warning px-4">

                    <Link to="/account/home" className="btn btn-primary ms-2"><i className="fa-solid fa-arrow-left"></i></Link>

                    <div>
                        <button className="btn btn-info ms-2">
                            <i className="fa-solid fa-play"></i>
                        </button>

                        <button onClick={createSlide} className="btn btn-info ms-2">
                            <i className="fa-solid fa-file-circle-plus"></i>
                        </button>

                        <button onClick={toggleSettings} className="btn btn-info ms-2 modal-toggle" >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        <ModalSettings isShow={isShowSettings} hide={toggleSettings} namePresentation={lapresentation.name} />

                    </div>
                </nav>
                

                {slides.map((slide) => (

                    <div key={slide.id_slide}>

                        <Slide canvasModifiedCallback={(e) => handleChangeSlide(e, slide.id_slide)} onReady={slide.contenu} />

                        {
                            lengthSlide > 1
                            ?
                                <div className="bg-dark d-flex justify-content-end">
                                    <button onClick={() => handleDeleteSlide(slide.id_slide)} className="btn btn-danger mx-2 px-2"><i className="fa-solid fa-trash text-white"></i></button>
                                </div>
                            :
                            ""
                        }
                            
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
