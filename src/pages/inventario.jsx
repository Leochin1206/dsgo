import { useState, useEffect } from "react";
import { NavPages } from "../components/navPages";
import arena from "../assets/arenaPokemon.png";
import missao1 from "../assets/inventario/missao1.png";
import missao2 from "../assets/inventario/missao2.png";
import missao3 from "../assets/inventario/missao3.png";
import missao4 from "../assets/inventario/missao4.png";
import missao5 from "../assets/inventario/missao5.png";
import missao6 from "../assets/inventario/missao6.png";
import missao7 from "../assets/inventario/missao7.png";
import missao8 from "../assets/inventario/missao8.png";
import missao9 from "../assets/inventario/missao9.png";
import missao10 from "../assets/inventario/missao10.png";

export function Inventario() {
    const [insignias, setInsignias] = useState([]);

    const insigniaMap = {
        1: missao1, 2: missao2, 3: missao3, 4: missao4, 5: missao5,
        6: missao6, 7: missao7, 8: missao8, 9: missao9, 10: missao10,
    };

    useEffect(() => {
        const insigniasSalvas = JSON.parse(localStorage.getItem('insigniasGanhas')) || [];
        setInsignias(insigniasSalvas);
    }, []); 

    return (
        <main className="relative min-h-screen bg-black flex flex-col items-center justify-center p-8 pt-24">
            <img src={arena} alt="plano de fundo de arena pokemon" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover z-0 blur-sm" />

            <section aria-labelledby="titulo-inventario" className="relative z-10 text-center">
                <h1 id="titulo-inventario" className="text-5xl font-bold text-white mb-10" style={{ textShadow: '2px 2px 4px #000000' }}>
                    Minhas Insígnias
                </h1>

                <ul className="flex flex-wrap justify-center gap-6 p-6 bg-gray-900 bg-opacity-70 rounded-lg border-2 border-yellow-500">
                    {insignias.length > 0 ? (
                        insignias.map((insigniaNum) => (
                            <li key={insigniaNum} className="flex flex-col items-center justify-center bg-white w-35 h-35 rounded-xl shadow p-2">
                                <img
                                    src={insigniaMap[insigniaNum]}
                                    alt={`Insígnia número ${insigniaNum}`}
                                    className="w-24 h-24 transition-transform duration-300 hover:scale-105"
                                />
                                <span className="text-black font-semibold mt-2">Insígnia {insigniaNum}</span>
                            </li>
                        ))
                    ) : (
                        <li>
                            <p className="text-white text-xl">
                                Você ainda não ganhou nenhuma insígnia. Complete 3 missões para ganhar a primeira!
                            </p>
                        </li>
                    )}
                </ul>
            </section>

            <div className="absolute bottom-0 w-full">
                <NavPages />
            </div>
        </main>
    );
}