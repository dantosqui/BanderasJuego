'use client'
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./juego.css";

export default function Juego() {
    const [banderas, setBanderas] = useState([]);
    const [banderaAleatoria, setBanderaAleatoria] = useState({ name: "", image: "" });
    const [nombreAdivinado, setNombreAdivinado] = useState("");
    const [puntaje, setPuntaje] = useState(0);
    const [timeRestante, setTimeRestante] = useState(15);
    const [name, setName] = useState("");
    const [ayudita, setAyudita] = useState("");
    const [flashColor, setFlashColor] = useState('');
    const [stopped, setStopped] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    const puntajeRef = useRef(puntaje);

    useEffect(() => {
        puntajeRef.current = puntaje;
    }, [puntaje]);

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
        };
        fetchBanderas();

        const id = setInterval(() => {
            setTimeRestante(prevTime => {
                if (prevTime > 1) {
                    return prevTime - 1;
                } else {
                    setPuntaje(puntajeRef.current - 1);
                    seleccionarBanderaAleatoria(banderastemp);
                    return 15;
                }
            });
        }, 1000);

        setIntervalId(id);

        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (name) {
            localStorage.setItem(name, puntaje.toString());
        }
    }, [puntaje, name]);

    const seleccionarBanderaAleatoria = (bandera) => {
        const randomIndex = Math.floor(Math.random() * bandera.length);
        setBanderaAleatoria({
            name: bandera[randomIndex].name,
            image: bandera[randomIndex].flag
        });
        setAyudita("_ ".repeat(bandera[randomIndex].name.length));
    };

    const adivinar = (event) => {
        event.preventDefault();
        if (nombreAdivinado.toLowerCase() === banderaAleatoria.name.toLowerCase()) {
            setPuntaje(puntaje + 10 + timeRestante);
            setFlashColor('flash-green');
        } else {
            setPuntaje(puntaje - 1);
            setFlashColor('flash-red');
        }
        clearInterval(intervalId);
        setStopped(true);

        setTimeout(() => {
            setFlashColor('');
            // Only restart the timer if the game is stopped
            if (stopped) {
                const id = setInterval(() => {
                    setTimeRestante(prevTime => {
                        if (prevTime > 1) {
                            return prevTime - 1;
                        } else {
                            setPuntaje(puntajeRef.current - 1);
                            seleccionarBanderaAleatoria(banderas);
                            return 15;
                        }
                    });
                }, 1000);
                setIntervalId(id);
            }
        }, 1000); // Duration of the flash effect
        setNombreAdivinado("");
    };

    const empezarDeNuevo = () => {
        clearInterval(intervalId);
        const id = setInterval(() => {
            setTimeRestante(prevTime => {
                if (prevTime > 1) {
                    return prevTime - 1;
                } else {
                    setPuntaje(puntajeRef.current - 1);
                    seleccionarBanderaAleatoria(banderas);
                    return 15;
                }
            });
        }, 1000);
        setIntervalId(id);
        setTimeRestante(15);
        seleccionarBanderaAleatoria(banderas);
        setNombreAdivinado("");
        setFlashColor('');
        setStopped(false); // Reset stopped state
    };

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
            setTimeRestante(timeRestante - 2);
        }
    };

    return (
        <div className={`juego ${flashColor}`}>
            <p>Jugador: {name}</p>
            <p>Puntaje: {puntaje}</p>
            <p>Tiempo restante: {timeRestante}s</p>
            <img src={banderaAleatoria.image} alt="Bandera Aleatoria" />
            <p>{ayudita}</p>

            <form onSubmit={adivinar}>
                <input 
                    type="text" 
                    value={nombreAdivinado}
                    onChange={(e) => setNombreAdivinado(e.target.value.toLowerCase())} 
                />
                <button type="submit">{nombreAdivinado ? "Adivinar" : "No se"}</button>
            </form>
            <button onClick={ayuda}>Ayuda</button>
            <button hidden={!stopped} onClick={empezarDeNuevo}>Siguiente</button>
        </div>
    );
}
