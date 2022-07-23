import React,  {useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const Inscription = () => {

    const { signUp } = useContext(UserContext);

    const navigate = useNavigate();

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

        if(inputs.current[1].value !== inputs.current[2].value){
            setValidation("Mot de passe différents.")
            return;
        }else if((inputs.current[1].value.length || inputs.current[2].value.length) < 6){
            setValidation("Mot de passe trop court.")
            return;
        }

        try {
            const cred = await signUp(
                inputs.current[0].value,
                inputs.current[1].value
            )
            formRef.current.reset();
            setValidation("");
            navigate("/account/home");

        } catch (error) {

            console.dir(error);
            if(error.code === "auth/invalid-email"){
                setValidation("Email invalide !")
            }
            
            if(error.code === "auth/email-already-in-use"){
                setValidation("Un compte utilise déjà cet email.")
            }
        }
    }

    return (
        <div className="container p-5">
            <h1 className="display-2 text-light">Inscription</h1>

            <form ref={formRef} onSubmit={handleForm}>
                
                <div className="form-outline mb-4">
                    <input ref={addInputs} type="email" id="emailRegister" className="form-control" placeholder="email" name="emailRegister"/>
                </div>

                <div className="form-outline mb-4">
                    <input ref={addInputs} type="password" id="pwdRegister" className="form-control" placeholder="mot de passe" name="pwdRegister"/>
                </div>

                <div className="form-outline mb-4">
                    <input ref={addInputs} type="password" id="repeatPwdRegister" className="form-control" placeholder="mot de passe" name="repeatPwdRegister"/>
                </div>

                <p className="text-danger mt-1">{validation}</p>

                <button type="submit" className="btn btn-primary btn-block mb-4">S'inscrire</button>

            </form>
                

        </div>

        
    )
}