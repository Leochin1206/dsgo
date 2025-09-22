import arena from "../assets/arenaPokemon.png";
import { NavPages } from "../components/navPages";

export function Home() {
    return (
        <main className="relative w-screen h-screen bg-black">
            <img  src={arena}  alt="plano de fundo de arena pokemon"  aria-hidden="true" className="absolute inset-0 w-full h-full object-cover z-0 blur-xs"  />

            <h1 className="sr-only">
                Página Inicial do Aplicativo
            </h1>

            <NavPages />
        </main>
    );
}