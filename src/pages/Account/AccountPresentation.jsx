import React, {useContext, useEffect, useState} from 'react'
import { db } from '../../../database/firebase'
import { ref, onValue, update, push, child } from "firebase/database"
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import { TrixEditor } from "react-trix";
import "trix/dist/trix";
import "trix/dist/trix.css";

import '../../../public/css/app.css'
import '../../../public/css/trix.css'

export const AccountPresentation= () => {

    const handleEditorReady = editor => {
        // this is a reference back to the editor if you want to
        // do editing programatically
        // editor.insertString("editor is ready");
      };
      
      const handleChange = (html, text) => {
        console.log({ html, text });
        // html is the new html content
        // text is the new text content
      };

    //id présentation
    let { uuuid } = useParams();

    const [lapresentation, setPresentation] = useState([])
    const [validation, setValidation ] = useState("");
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
    let mergeTags = [
        {
          trigger: "@",
          tags: [
            { name: "Dominic St-Pierre", tag: "@dominic" },
            { name: "John Doe", tag: "@john" }
          ]
        },
        {
          trigger: "{",
          tags: [
            { name: "First name", tag: "{{ .FirstName }}" },
            { name: "Last name", tag: "{{ .LastName }}" }
          ]
        }
      ];

    console.log(validation)

    //create slide
    const createSlide = () => {

        const uidUser = currentUser.uid
        const id_slide = push(child(ref(db), `/users/${uidUser}/${uuuid}`)).key;
        
        update(ref(db, `/users/${uidUser}/${uuuid}/slides/${id_slide}`), {
            img : "",
            id_slide: id_slide,
            title: "Présentation sans titre"
        }).then(() => {
            // data saved
        }).catch((error) => {
            console.log(error)
        })

    }
    
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
                


                {Object.keys(lapresentation[1]).map((key, slide) => (
                    <>
                    <div className='bg-light m-b-25 m-t-5 rounded'>

                            <TrixEditor key={lapresentation[1][key].id_slide} id="trixEditor" className='bg-light card'
                                placeholder="editor's placeholder" value={`
                                
                                `.replace(/(\r\n|\n|\r)/gm, "")}
                                onChange={handleChange}
                                onEditorReady={handleEditorReady}
                            />
                    </div>
                    </>
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
