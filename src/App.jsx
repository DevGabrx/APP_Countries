
import {HashRouter as BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import { Home, Heart, Globe, Gamepad2, Info } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import HomeView from './components/HomeView';
import Favorito from './components/Favorito';
import Regiones from './components/Regiones';
import AdivinaBandera from './components/AdivinaBandera';
import Informativa from './components/Informativa';
import Pais from './components/Pais';


function App() {
  return (
    <SplashScreen>
      <BrowserRouter>
        <div className="pb-16 min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/favoritos" element={<Favorito />} />
            <Route path="/regiones" element={<Regiones />} />
            <Route path="/juego" element={<AdivinaBandera />} />
            <Route path="/info" element={<Informativa />} />
            <Route path="/country/:id" element={<Pais />} />
          </Routes>
          
          {/* Menú de Navegación Inferior */}
          <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3 text-gray-500">
            <Link to="/" className="flex flex-col items-center hover:text-blue-600"><Home size={24} /><span className="text-xs">Inicio</span></Link>
            <Link to="/favoritos" className="flex flex-col items-center hover:text-blue-600"><Heart size={24} /><span className="text-xs">Favoritos</span></Link>
            <Link to="/regiones" className="flex flex-col items-center hover:text-blue-600"><Globe size={24} /><span className="text-xs">Regiones</span></Link>
            <Link to="/juego" className="flex flex-col items-center hover:text-blue-600"><Gamepad2 size={24} /><span className="text-xs">Juego</span></Link>
            <Link to="/info" className="flex flex-col items-center hover:text-blue-600"><Info size={24} /><span className="text-xs">Info</span></Link>
          </nav>
        </div>
      </BrowserRouter>
    </SplashScreen>
  );
}

export default App;