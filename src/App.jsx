import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import { Init } from './pages/init';
import { Camera } from './pages/camera';
import { GeoLocalizacao } from './pages/geolocalização';
import { Home } from './pages/home';
import { Inventario } from './pages/inventario';
import { Missoes } from './pages/missoes';
import { Cadastro } from './pages/cadastro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Init />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/geolocalizacao" element={<GeoLocalizacao />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/missoes" element={<Missoes />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  )
}


