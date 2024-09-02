'use client'
import axios from "axios"
import { useEffect, useState } from "react"

export default function Juego() {
    const [banderas, setBanderas] = useState([])
    const [banderaAleatoria, setBanderaAleatoria] = useState({name:"",image:""})
    const [nombreAdivinado,setNombreAdivinado] = useState("")
    const [puntaje,setPuntaje] = useState(0) //buscar del local host para continuar?
    const [timeRestante,setTimeRestante] = useState(15)


    useEffect(() => {
        let banderastemp 
        
        const fetchBanderas = async () => {
            try {
                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
                setBanderas(response.data.data)
                banderastemp = response.data.data
                seleccionarBanderaAleatoria(response.data.data)
                console.log("response",response.data.data) //borrar esto 
            } catch (error) {
                console.log("ERROR FECHEANDO BANDERAS: ", error)
            }
        }
        fetchBanderas()
        //console.log("banderas",banderas[1])
        const intervalId = setInterval(() => {
          setTimeRestante(prevTime => {
            if (prevTime > 1) {
              return prevTime - 1;
            } else {
              setPuntaje(puntaje-1)
              seleccionarBanderaAleatoria(banderastemp)
              setTimeRestante(15)
              return 0; 
            }
          });
        }, 1000);

        return () => clearInterval(intervalId); //no se por que esto hace que no se corra dos veces por cada vez

    }, [])

    
    
   const seleccionarBanderaAleatoria = (bandera) => {
        const randomIndex = Math.floor(Math.random() * bandera.length)
        setBanderaAleatoria(
            {name:bandera[randomIndex].name, image:bandera[randomIndex].flag}
            )
    }

    const adivinar = () => {
        if (nombreAdivinado.toLocaleLowerCase()==banderaAleatoria.name.toLocaleLowerCase()){ //no anda lowercase
            setPuntaje(puntaje+10+timeRestante)
        }
        else{
            setPuntaje(puntaje-1)
        }
        setTimeRestante(15)
        seleccionarBanderaAleatoria(banderas)
    }

    return (
        <div>
            <div className="juego">

                <p>puntaje: {puntaje}</p>
                <p>tiempo restante {timeRestante}s</p>
                <img src={banderaAleatoria.image}></img>

                
                <input type="text" onChange={(e) => {setNombreAdivinado(e.target.value.toLocaleLowerCase())}}></input>
            
                <button type="submit" onClick={() => {adivinar()}}>adivinar</button>
            </div>
        </div>
    )
}
