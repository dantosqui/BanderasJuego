'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Highscores() {
    const [highscores, setHighscores] = useState([]);

    useEffect(() => {
        const fetchHighscores = () => {
            const keys = Object.keys(localStorage);
            const scores = keys
                .filter(key => key !== 'player') // Exclude 'player' key
                .map(key => ({ name: key, score: parseInt(localStorage.getItem(key), 10) }))
                .filter(entry => !isNaN(entry.score))
                .sort((a, b) => b.score - a.score);
            setHighscores(scores);
        };

        fetchHighscores();
    }, []);

    return (
        <div>
            <h1>Highscores</h1>
            <ul>
                {highscores.map((entry, index) => (
                    <li key={index}>
                        {entry.name}: {entry.score}
                    </li>
                ))}
            </ul>
            <Link href="/">Back to Home</Link>
        </div>
    );
}
