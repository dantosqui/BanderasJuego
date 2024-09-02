'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import {useEffect,useState} from "react"
import React from "react";
import './main.css'


export default function Home() {
  const [playerName,setPlayerName]=useState("")
  const [displayName,setDisplayName]=useState("guest")
  
  useEffect(() => {
    if (localStorage.getItem('player'))
    {localStorage.setItem("player","guest")}
    
  }, []);

  const cambiarPlayer = () => {
    setDisplayName(playerName)
    localStorage.setItem('player',playerName)
  }

  return (
    <div className="wrapmain">

    <h1>HOLA BIENVENIDOS AL JUEGO DE BANDERAS MAS EPICO Y HARDCORE DE LA HISTORIA</h1>
    <p>Jugador actual: {displayName}</p> 
    
    <div className="cambiarnombre">
      <p>cambiar nombre del jugador </p>
      <input onChange={(e) => {setPlayerName(e.target.value)}} type="text"></input>
    <button onClick={cambiarPlayer}>cambiar</button>
    </div>
    
    <Link className="zelda" href="pages/juego">jugar</Link>
    
    <Link className="zelda" href="pages/highscores">Ver Highscores</Link> {/* Add this link */}


    </div>
  );
}
