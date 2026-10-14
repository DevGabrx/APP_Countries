import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllCountries } from '../services/countries';

export default function HomeView() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchAllCountries({ signal: controller.signal })
      .then(setCountries)
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          console.error('Error al cargar los países:', fetchError);
          setCountries([]);
          setError(`No se pudieron cargar los países: ${fetchError.message}`);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reload]);

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.common.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'All' || country.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="p-4">
      <input 
        type="text" 
        placeholder="Buscar país..." 
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setSearch(e.target.value)}
      />
      <select 
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setRegionFilter(e.target.value)}
      >
        <option value="All">Todas las regiones</option>
        <option value="Americas">América</option>
        <option value="Europe">Europa</option>
        <option value="Asia">Asia</option>
        <option value="Africa">África</option>
        <option value="Oceania">Oceanía</option>
      </select>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-center text-gray-600">Cargando países...</p>
        ) : error ? (
          <div className="text-center text-red-700" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setReload((current) => current + 1)}
              className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Reintentar
            </button>
          </div>
        ) : filteredCountries.length === 0 ? (
          <p className="text-center text-gray-600">No se encontraron países.</p>
        ) : (
          filteredCountries.map(country => (
            <Link to={`/country/${country.cca3}`} key={country.cca3} className="bg-white p-4 rounded shadow flex items-center gap-4">
              <img src={country.flags.svg} alt={`Bandera de ${country.name.common}`} className="w-16 h-10 object-cover" />
              <h3 className="font-bold">{country.name.common}</h3>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}