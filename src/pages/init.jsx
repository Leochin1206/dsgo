import logo from "../assets/dsgoLogo.png"
import { Link } from "react-router-dom";

export function Init() {
    return(
        <main className="w-screen h-screen flex flex-col items-center justify-center">
            <h1 className="sr-only">Página de entrada da plataforma DSGO</h1>

            <img src={logo} alt="Logo da plataforma DSGO" />
            
            <Link to="/home" className="bg-gradient-to-b from-[#00B4D8] to-[#0096C7] text-white p-4 text-[26px] w-40 flex items-center justify-center rounded hover:shadow-xl transition-all duration-200 hover:to-[#00B4D8] hover:from-[#0096C7] mt-5">
                Entrar
            </Link>
        </main>
    );
}