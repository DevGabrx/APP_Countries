import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Favorito() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem('favorites')) || []);
  }, []);

  return (
    <div className="p-4 mb-20">
      <h1 className="mb-4 rounded-xl bg-white p-4 text-center text-2xl font-bold text-gray-800 shadow-sm">
        Países favoritos
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">
          Aún no tienes países favoritos. Guarda uno desde su página de detalles.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {favorites.map(favorite => (
            <Link
              to={`/country/${favorite.cca3}`}
              key={favorite.cca3}
              className="flex items-center gap-4 rounded bg-white p-4 shadow"
            >
              <img
                src={favorite.flag}
                alt={`Bandera de ${favorite.name}`}
                className="h-10 w-16 object-cover"
              />
              <h2 className="font-bold">{favorite.name}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorito;
