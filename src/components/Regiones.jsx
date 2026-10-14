import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCountriesByRegion } from '../services/countries';

function Regiones() {
  // Estado para la región seleccionada, por defecto 'Americas'
  const [selectedRegion, setSelectedRegion] = useState('Americas');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lista de regiones con sus nombres en español y un emoji representativo
  const regions = [
    { id: 'Americas', name: 'América', icon: '🌎' },
    { id: 'Europe', name: 'Europa', icon: '🌍' },
    { id: 'Asia', name: 'Asia', icon: '🌏' },
    { id: 'Africa', name: 'África', icon: '🦁' },
    { id: 'Oceania', name: 'Oceanía', icon: '🌊' }
  ];

  // Efecto para buscar los países cada vez que cambia la región seleccionada
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchCountriesByRegion(selectedRegion, { signal: controller.signal })
      .then(data => {
        // Ordenar alfabéticamente para mejor presentación
        const sortedData = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedData);
      })
      .catch(fetchError => {
        if (fetchError.name !== 'AbortError') {
          console.error('Error al cargar la región:', fetchError);
          setError('No se pudieron cargar los países de esta región. Inténtalo de nuevo.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedRegion]);

  return (
    <div className="p-4 mb-20 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 bg-white p-4 rounded-xl shadow-sm text-center">
        Explorar por Región
      </h1>

      {/* Selector de regiones con scroll horizontal para móviles */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-2 hide-scrollbar">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setSelectedRegion(region.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-colors border ${
              selectedRegion === region.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{region.icon}</span>
            {region.name}
          </button>
        ))}
      </div>

      {/* Lista de países de la región seleccionada */}
      <div className="flex-grow overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-700" role="alert">{error}</p>
        ) : countries.length === 0 ? (
          <p className="text-center text-gray-600">No se encontraron países.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {countries.map((country) => (
              <Link 
                to={`/country/${country.cca3}`} 
                key={country.cca3} 
                className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-transform active:scale-95"
              >
                <img 
                  src={country.flags.svg} 
                  alt={`Bandera de ${country.name.common}`} 
                  className="w-full h-24 object-cover rounded shadow-sm border border-gray-200 mb-2" 
                />
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">
                  {country.name.common}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Regiones;