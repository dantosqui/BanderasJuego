'use client'
import axios from "axios";
import { useEffect, useState } from "react";

export default function Juego() {
    const [banderas, setBanderas] = useState([]);
    const [banderaAleatoria, setBanderaAleatoria] = useState({ name: "", image: "" });
    const [nombreAdivinado, setNombreAdivinado] = useState("");
    const [puntaje, setPuntaje] = useState(0);
    const [timeRestante, setTimeRestante] = useState(15);
    const [name, setName] = useState("");
    const [ayudita, setAyudita] = useState("");

    useEffect(() => {
        setName(localStorage.getItem("player"));

        let banderastemp = [];

        const fetchBanderas = async () => {
            try {
                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
                setBanderas(response.data.data);
                banderastemp = response.data.data;
                seleccionarBanderaAleatoria(response.data.data);
                console.log("response", response.data.data); //borrar esto
            } catch (error) {
                console.log("ERROR FETCHING FLAGS: ", error);
            }
        }
        fetchBanderas();

        const intervalId = setInterval(() => {
            setTimeRestante(prevTime => {
                if (prevTime > 1) {
                    return prevTime - 1;
                } else {
                    setPuntaje(puntaje - 1);
                    seleccionarBanderaAleatoria(banderastemp);
                    setTimeRestante(15);
                    return 0;
                }
            });
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (name) {
            localStorage.setItem(name, puntaje.toString());
        }
    }, [puntaje]);

    const seleccionarBanderaAleatoria = (bandera) => {
        const randomIndex = Math.floor(Math.random() * bandera.length);
        setBanderaAleatoria({
            name: bandera[randomIndex].name,
            image: bandera[randomIndex].flag
        });
        setAyudita("_ ".repeat(bandera[randomIndex].name.length));
    }

    const adivinar = () => {
        if (nombreAdivinado.toLowerCase() === banderaAleatoria.name.toLowerCase()) {
            setPuntaje(puntaje + 10 + timeRestante);
        } else {
            setPuntaje(puntaje - 1);
        }
        setTimeRestante(15);
        seleccionarBanderaAleatoria(banderas);
    }

    const ayuda = () => {
        if (!banderaAleatoria.name) return;

        const nameLower = banderaAleatoria.name.toLowerCase();
        const ayuditaLower = ayudita.replace(/ /g, ""); 
        let newAyudita = "";

        const unrevealedIndices = [];
        for (let i = 0; i < nameLower.length; i++) {
            if (ayuditaLower[i] === "_") {
                unrevealedIndices.push(i);
            }
        }

        
        if (unrevealedIndices.length > 0) {
            const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
            const letterToReveal = nameLower[randomIndex];
            
            
            for (let i = 0; i < nameLower.length; i++) {
                if (i === randomIndex) {
                    newAyudita += nameLower[i] + " ";
                } else {
                    newAyudita += ayudita[i * 2] + " "; 
                }
            }
            setAyudita(newAyudita.trim());
            setTimeRestante(timeRestante-2)
        }
    }

    return (
        <div>
            <div className="juego">
                <p>Jugador: {name}</p>
                <p>Puntaje: {puntaje}</p>
                <p>Tiempo restante: {timeRestante}s</p>
                <img src={banderaAleatoria.image} alt="Bandera Aleatoria" />
                <p>{ayudita}</p>

                <input 
                    type="text" 
                    onChange={(e) => { 
                        setNombreAdivinado(e.target.value.toLowerCase()) 
                    }} 
                />

                <button type="submit" onClick={adivinar}>Adivinar</button>
                <button onClick={ayuda}>Ayuda</button>
            </div>
        </div>
    )
}
