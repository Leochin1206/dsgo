import missoes from "../assets/missoes.png"
import inventario from "../assets/inventario.png"
import geoloc from "../assets/geoloc.png"
import camera from "../assets/camera.png"
// 1. Importe o NavLink em vez do Link
import { NavLink } from "react-router-dom";

export function NavPages() {
    return (
        <nav aria-label="Navegação principal do aplicativo"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#e1effc] h-35 w-[50%] z-50 flex items-center justify-center rounded shadow-xl"
        >
            <ul className="flex items-center justify-evenly w-full">
                <li>
                    <NavLink to="/missoes"
                        className="flex flex-col items-center justify-center hover:scale-105 transition-all p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <img src={missoes} alt="Icone de missoes" className="h-auto w-20" />
                        <span className="text-[18px] font-semibold">Missões</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink o="/inventario"
                        className="flex flex-col items-center justify-center hover:scale-105 transition-all p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <img src={inventario} alt="icone de inventario" className="h-auto w-20" />
                        <span className="text-[18px] font-semibold">Inventário</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/geolocalizacao"
                        className="flex flex-col items-center justify-center hover:scale-105 transition-all p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <img src={geoloc} alt="icone de geolocalização" className="h-auto w-20" />
                        <span className="text-[18px] font-semibold">GeoLocalização</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/camera"
                        className="flex flex-col items-center justify-center hover:scale-105 transition-all p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <img src={camera} alt="icone de camera" className="h-auto w-20" />
                        <span className="text-[18px] font-semibold">Câmera</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}