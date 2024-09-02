'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import {useEffect,useState} from "react"
import React from "react";


export default function Home() {
  const [playerName,setPlayerName]=useState("")
  
  useEffect(() => {
    if (localStorage.getItem('player'))
    {localStorage.setItem("player","guest")}
    
  }, []);

  const cambiarPlayer = () => {
    localStorage.setItem('player',playerName)
  }

  return (
    <div>

    <h1>bienvenidos al juego de banderas</h1>
    <p>jugador: {localStorage.getItem('player')}</p> 
    <p>cambiar nombre del jugador </p><input onChange={(e) => {setPlayerName(e.target.value)}} type="text"></input>
    <button onClick={cambiarPlayer()}>cambiar</button>
    <Link href="pages/juego">jugar</Link>

    </div>
  );
}
