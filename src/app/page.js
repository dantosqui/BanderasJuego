'use effect'
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div>

    <h1>bienvenidos al juego de banderas</h1>
    <Link href="pages/juego">jugar</Link>

    </div>
  );
}
