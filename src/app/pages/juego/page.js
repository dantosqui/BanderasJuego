'use client'
import axios from "axios"
import { useEffect, useState } from "react"

export default function Juego() {
    const [banderas, setBanderas] = useState([])
    const [banderaAleatoria, setBanderaAleatoria] = useState({name:"",image:""})
    const [nombreAdivinado,setNombreAdivinado] = useState("")
    const [puntaje,setPuntaje] = useState(0) //buscar del local host para continuar?


    useEffect(() => {
        const fetchBanderas = async () => {
            try {
                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
                setBanderas(response.data.data)
                seleccionarBanderaAleatoria(response.data.data)
                console.log("response",response.data.data) //borrar esto 
            } catch (error) {
                console.log("ERROR FECHEANDO BANDERAS: ", error)
            }
        }
        fetchBanderas()
        //console.log("banderas",banderas[1])
    }, [])

    
    
   const seleccionarBanderaAleatoria = (bandera) => {
        const randomIndex = Math.floor(Math.random() * bandera.length)
        setBanderaAleatoria(
            {name:bandera[randomIndex].name, image:bandera[randomIndex].flag}
            )
    }

    const adivinar = () => {
        if (nombreAdivinado.toLocaleLowerCase()==banderaAleatoria.name){ //no anda lowercase
            setPuntaje(puntaje+10)
        }
        else{
            setPuntaje(puntaje-1)
        }
        seleccionarBanderaAleatoria(banderas)
    }

    return (
        <div>
            <div className="juego">

                <p>puntaje: {puntaje}</p>
                <img src={banderaAleatoria.image}></img>
            

                <input type="text" onChange={(e) => {setNombreAdivinado(e.target.value.toLocaleLowerCase())}}></input>
            
                <button type="submit" onClick={() => {adivinar()}}>adivinar</button>
            </div>
        </div>
    )
}
