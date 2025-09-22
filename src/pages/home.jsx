import arena from "../assets/arenaPokemon.png";
import { NavPages } from "../components/navPages";

export function Home() {
    return (
        <div className="relative w-screen h-screen bg-black">
            <img src={arena} alt="" className="absolute inset-0 w-full h-full object-cover z-0 blur-xs" />

            <NavPages />
        </div>
    );
}
