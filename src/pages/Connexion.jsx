import React,  {useContext, useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const Connexion = () => {

    const { signIn } = useContext(UserContext);
    const { signInWithGoogle } = useContext(UserContext);
    const { signInWithFacebook } = useContext(UserContext);

    const {currentUser} = useContext(UserContext)
    
    const navigate = useNavigate();

    useEffect(() => {

        if(currentUser){
            navigate("/account/home");
        }

    }, [])

    const [ validation, setValidation ] = useState("");

    const inputs = useRef([])
    const addInputs = el => {
        if(el && !inputs.current.includes(el)){
            inputs.current.push(el)
        }
    }

    const formRef = useRef()

    const handleForm = async (e) => {
        e.preventDefault()

        try {
            const cred = await signIn(
                inputs.current[0].value,
                inputs.current[1].value
            )
            localStorage.setItem("emailUser", inputs.current[0].value)

            formRef.current.reset();
            setValidation("");
            navigate("/account/home");

        } catch {

            setValidation("Identifiants invalides !")
        }
    }

    return (
        <div className="container p-5">
            <h1 className="display-2 text-light">Connexion</h1>

            <form ref={formRef} onSubmit={handleForm}>
                
                <div className="form-outline mb-4">
                    <input ref={addInputs} type="email" id="loginEmail" className="form-control" placeholder="email" name="loginEmail"  />
                </div>

                <div className="form-outline mb-4">
                    <input ref={addInputs} type="password" id="loginPassword" className="form-control" placeholder="mot de passe" />
                </div>

                <p className="text-danger mt-1">{validation}</p>

                <button type="submit" className="btn btn-primary btn-block mb-4">Se connecter</button>

                <div className="text-center mb-3">

                    <p className="text-light">Connectez vous avec</p>

                    <button onClick={signInWithFacebook} type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-facebook-f"></i>
                    </button>

                    <button onClick={signInWithGoogle} type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-google"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-twitter"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-github"></i>
                    </button>
                </div>

            </form>
                

        </div>

        
    )
}