import React,  {useContext, useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const Inscription = () => {

    const { signUp } = useContext(UserContext);

    const navigate = useNavigate();

    const {currentUser} = useContext(UserContext)

    useEffect(() => {

        if(currentUser){
            navigate("/account/home");
        }

    }, [])

    const [ validation, setValidation ] = useState("");
    const [ radioPhoto, setRadioPhoto] = useState("../../public/img/img_avatar.png");

    const inputs = useRef([])
    const addInputs = el => {
        if(el && !inputs.current.includes(el)){
            inputs.current.push(el)
        }
    }

    const formRef = useRef()

    const handleForm = async (e) => {
        e.preventDefault()

        if(inputs.current[2].value !== inputs.current[3].value){
            setValidation("Mot de passe différents.")
            return;
        }else if((inputs.current[2].value.length || inputs.current[3].value.length) < 6){
            setValidation("Mot de passe trop court.")
            return;
        }

        try {
            const cred = await signUp(
                inputs.current[1].value,
                inputs.current[2].value
            )

            localStorage.setItem("emailUser", inputs.current[1].value)
            localStorage.setItem("nameUser", inputs.current[0].value)
            localStorage.setItem("imgUser", radioPhoto)

            formRef.current.reset();
            setValidation("");
            navigate("/account/home");

        } catch (error) {

            if(error.code === "auth/invalid-email"){
                setValidation("Email invalide !")
            }
            
            if(error.code === "auth/email-already-in-use"){
                setValidation("Un compte utilise déjà cet email.")
            }
        }
    }

    const handleChangeRadioPhoto = event => {
        setRadioPhoto(event.target.value);
    };

    return (
        <div className="container p-5">
            <h1 className="display-2 text-light">Inscription</h1>

            <form ref={formRef} onSubmit={handleForm}>

                <div className="form-outline mb-4">
                    <input ref={addInputs} type="text" id="NameRegister" max="15" className="form-control" placeholder="Pseudo" name="NameRegister"/>
                </div>
                
                <div className="form-outline mb-4">
                    <input ref={addInputs} type="email" id="emailRegister" className="form-control" placeholder="Email" name="emailRegister"/>
                </div>

                <div className="form-outline mb-4">
                    <input ref={addInputs} type="password" id="pwdRegister" className="form-control" placeholder="Mot de passe" name="pwdRegister"/>
                </div>

                <div className="form-outline mb-4">
                    <input ref={addInputs} type="password" id="repeatPwdRegister" className="form-control" placeholder="Mot de passe" name="repeatPwdRegister"/>
                </div>

                <div className="form-outline mb-4">
                    
                    <label>
                        <input onChange={handleChangeRadioPhoto} type="radio" name="photoRegister" value="../../public/img/img_avatar.png" checked={radioPhoto === "../../public/img/img_avatar.png"} />
                        <img src="../../public/img/img_avatar.png" alt="Avatar_boy" />
                    </label>

                    <label>
                        <input onChange={handleChangeRadioPhoto} type="radio" name="photoRegister" value="../../public/img/img_avatar2.png" checked={radioPhoto === "../../public/img/img_avatar2.png"} />
                        <img src="../../public/img/img_avatar2.png" alt="Avatar_girl" />
                    </label>

                </div>

                <button type="submit" className="btn btn-primary btn-block mb-4">S'inscrire</button>

                <p className="text-danger mt-1">{validation}</p>

            </form>
                

        </div>

        
    )
}