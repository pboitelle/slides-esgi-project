import React, {useEffect, useState, useRef} from "react";
import reactDom from "react-dom";

import { db } from '../../database/firebase'
import { ref, onValue, update, push, child, remove } from "firebase/database"
import { UserContext } from '../context/userContext'

import { fabric } from "fabric";

import '../../public/css/app.css'

const Slide = ({canvasModifiedCallback, onReady}) => {

    const canvasRef = useRef(null)
    const iconColorRef = useRef(null)

    const [canvas, setCanvas] = useState('');

    let color = "#000";

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);


        canvas.loadFromJSON(onReady);

        canvas.renderAll();


        setCanvas(canvas);


        canvas.on('object:added', canvasModifiedCallback);
        canvas.on('object:removed', canvasModifiedCallback);
        canvas.on('object:modified', canvasModifiedCallback);
        // canvas.on('object:moving', canvasModifiedCallback);


        window.addEventListener('keydown', function(event) {
            const key = event.key;
            if (key === "Delete") {
                canvas.remove(canvas.getActiveObject());
            }
        });
    }, []);
    

    const handleChangeColor = (e) => {

        let colorRef = e.target.value;

        let item = canvas.getActiveObject();

        iconColorRef.current.style.color = colorRef;

        color = colorRef;

        if (!item) return;
        
        item.set("fill", color);

        canvas.renderAll();
    }

    const handleAddText = () => {

        let textbox = new fabric.Textbox('Ajouter votre texte', {
            left: 50,
            top: 50,
            width: 150,
            fontSize: 20,
            fill: color
        });

        canvas.add(textbox).setActiveObject(textbox);

        canvas.renderAll();
    }

    const handleUploadImage = (e) => {

        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onload = function (f) {
            let data = f.target.result;  
                                
            fabric.Image.fromURL(data, function (img) {

                let scale = 300 / img.width;

                let oImg = img.set({left: 50, top: 50, scaleX: scale,scaleY: scale});

                canvas.add(oImg).renderAll();                      
            });
        };
        reader.readAsDataURL(file);
    }


    return (
        <>
            <div id="my-canvas">
                
                <div className="controls">
                    <button onClick={handleAddText}><i className="fa-solid fa-t"></i></button>

                    <input onChange={handleUploadImage} type="file" id="avatar" name="avatar" accept="image/png, image/jpeg"/>
                    <label htmlFor="avatar"><i className="fa-regular fa-image"></i></label>

                    <input onChange={handleChangeColor} type="color" name="" id="color"/>
                    <label htmlFor="color" ref={iconColorRef}><i className="fa-solid fa-palette"></i></label>
                </div>

                <canvas ref={canvasRef} id="c"></canvas>
            </div>
            
        </>
    )
}

export default Slide;