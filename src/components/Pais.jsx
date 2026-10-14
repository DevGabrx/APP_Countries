import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, HeartOff, MapPin, Users, Globe2, Coins, Languages } from 'lucide-react';
import { fetchCountryByCode } from '../services/countries';

export default function Pais() {
  const { id } = useParams(); // Obtiene el código cca3 de la URL
  const navigate = useNavigate();
  
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setCountry(null);
    setLoading(true);
    setError('');

    fetchCountryByCode(id, { signal: controller.signal })
      .then(setCountry)
      .catch(fetchError => {
        if (fetchError.name !== 'AbortError') {
          console.error('Error al cargar el país:', fetchError);
          setError(`No se pudo cargar la información del país: ${fetchError.message}`);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
      
    // Comprobar estado de favoritos en localStorage
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favs.some(fav => fav.cca3 === id));

    return () => controller.abort();
  }, [id]);

  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite) {
      favs = favs.filter(fav => fav.cca3 !== id);
    } else {
      favs.push({ 
        cca3: id, 
        name: country.name.common, 
        flag: country.flags.svg 
      });
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!country) {
    return <div className="p-4 text-center mt-20" role={error ? 'alert' : undefined}>
      {error || 'No se encontró el país.'}
    </div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* Cabecera con imagen (Bandera) */}
      <div className="relative w-full h-64 bg-gray-200">
        <img 
          src={country.flags.svg} 
          alt={`Bandera de ${country.name.common}`} 
          className="w-full h-full object-cover" 
        />
        
        {/* Botón flotante para regresar */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 p-2 rounded-full shadow-md backdrop-blur-sm text-gray-800 hover:bg-white"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Botón flotante para favoritos */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md backdrop-blur-sm hover:bg-white"
        >
          {isFavorite ? <Heart size={24} className="text-red-500 fill-red-500" /> : <HeartOff size={24} className="text-gray-600" />}
        </button>
      </div>

      {/* Contenido detallado */}
      <div className="p-4 -mt-6 relative z-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{country.name.common}</h1>
          <p className="text-gray-500 mb-6">{country.name.official}</p>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Capital</p>
                <p className="font-semibold text-gray-800">{country.capital ? country.capital[0] : 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-gray-50 pb-3">
              <div className="bg-green-50 p-2 rounded-lg text-green-600">
                <Globe2 size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Región</p>
                <p className="font-semibold text-gray-800">{country.region} {country.subregion ? `(${country.subregion})` : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-gray-50 pb-3">
              <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Población</p>
                <p className="font-semibold text-gray-800">{country.population.toLocaleString('es-CO')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-gray-50 pb-3">
              <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600">
                <Coins size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Moneda</p>
                <p className="font-semibold text-gray-800">
                  {country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-2 rounded-lg text-red-600">
                <Languages size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Idiomas</p>
                <p className="font-semibold text-gray-800">
                  {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}