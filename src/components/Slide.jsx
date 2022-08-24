import React, {useEffect, useState, useRef} from "react";
import reactDom from "react-dom";

import { db } from '../../database/firebase'
import { ref, onValue, update, push, child, remove } from "firebase/database"
import { UserContext } from '../context/userContext'

import { fabric } from "fabric";

import '../../public/css/app.css'

const Slide = ({canvasModifiedCallback}) => {

    const canvasRef = useRef(null)
    const iconColorRef = useRef(null)

    const [canvas, setCanvas] = useState('');

    let color = "#000";

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);

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


    const saveCanvas = () => {
        // convert canvas to a json string
        let json = JSON.stringify( canvas.toJSON() );

        localStorage.setItem("json", json)
    }

    const load = () => {
        let json = `{"type":"textbox","version":"5.2.1","originX":"left","originY":"top","left":61.71,"top":10.69,"width":170.04,"height":22.6,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Times New Roman","fontWeight":"normal","fontSize":20,"text":"Ajouter votre texte","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":{},"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline","minWidth":20,"splitByGrapheme":false}`;

        canvas.loadFromJSON(json);

        canvas.renderAll();
    }

    return (
        <>
            <div id="my-canvas">
                
                <div className="controls">
                    <button onClick={handleAddText}><i className="fa-solid fa-t"></i></button>

                    <button onClick={load}><i className="fa-solid fa-l"></i></button>

                    <button onClick={saveCanvas}><i className="fa-solid fa-s"></i></button>

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