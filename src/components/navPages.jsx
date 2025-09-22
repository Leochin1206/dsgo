import missoes from "../assets/missoes.png"
import inventario from "../assets/inventario.png"
import geolocalizacao from "../assets/geoloc.png"
import camera from "../assets/camera.png"
import { Link } from "react-router-dom";

export function NavPages() {
    return (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#e1effc] h-35 w-[50%] z-50  flex items-center justify-evenly rounded shadow-xl">
            <Link to="/missoes" className="flex flex-col items-center justify-center hover:scale-105 transition-all">
                <img src={missoes} alt="" className="h-auto w-20" />
                <h1 className="text-[18px] font-semibold">Missões</h1>
            </Link>
            <Link to="/inventario" className="flex flex-col items-center justify-center hover:scale-105 transition-all">
                <img src={inventario} alt="" className="h-auto w-20" />
                <h1 className="text-[18px] font-semibold">Inventário</h1>
            </Link>
            <Link to="/geolocalizacao" className="flex flex-col items-center justify-center hover:scale-105 transition-all">
                <img src={geolocalizacao} alt="" className="h-auto w-20" />
                <h1 className="text-[18px] font-semibold">GeoLocalização</h1>
            </Link>
            <Link to="/camera" className="flex flex-col items-center justify-center hover:scale-105 transition-all">
                <img src={camera} alt="" className="h-auto w-20" />
                <h1 className="text-[18px] font-semibold">Câmera</h1>
            </Link>
        </div>
    );
}