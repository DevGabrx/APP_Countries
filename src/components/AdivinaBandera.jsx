import { useState, useEffect } from 'react';
import { fetchAllCountries } from '../services/countries';

function AdivinaBandera() {

    const [countries, setCountries] = useState([]);
    const [question, setQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reload, setReload] = useState(0);

    // Cargar todos los países al montar el componente
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');

        fetchAllCountries({ signal: controller.signal })
            .then(data => {
                setCountries(data);
                generateQuestion(data);
            })
            .catch(fetchError => {
                if (fetchError.name !== 'AbortError') {
                    console.error('Error cargando países:', fetchError);
                    setError('No se pudieron cargar los países para el juego. Inténtalo de nuevo.');
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [reload]);

    // Lógica para crear una nueva pregunta aleatoria
    const generateQuestion = (data) => {
        if (data.length === 0) return;

        // Obtener 4 países aleatorios
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selectedOptions = shuffled.slice(0, 4);

        // Elegir uno de esos 4 como la respuesta correcta
        const correctIndex = Math.floor(Math.random() * 4);
        const correctCountry = selectedOptions[correctIndex];

        setQuestion({
            flagUrl: correctCountry.flags.svg,
            correctAnswer: correctCountry.name.common,
            options: selectedOptions.map(c => c.name.common)
        });
        setFeedback(null);
    };

    // Evaluar la respuesta del usuario
    const handleGuess = (selectedAnswer) => {
        if (feedback !== null) return; // Evitar múltiples clics

        if (selectedAnswer === question.correctAnswer) {
            setScore(score + 1);
            setFeedback({ type: 'success', text: '¡Correcto! 🎉' });
        } else {
            setScore(0); // Reinicia el puntaje al fallar (puedes cambiar esta lógica)
            setFeedback({ type: 'error', text: `Incorrecto. Era ${question.correctAnswer} 😢` });
        }

        // Esperar 2 segundos y generar la siguiente pregunta
        setTimeout(() => {
            generateQuestion(countries);
        }, 2000);
    };

    if (loading) {
        return <div className="p-4 text-center mt-20">Cargando juego...</div>;
    }

    if (error) {
        return (
            <div className="p-4 text-center mt-20 text-red-700" role="alert">
                <p>{error}</p>
                <button
                    type="button"
                    onClick={() => setReload(current => current + 1)}
                    className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
                >
                    Reintentar
                </button>
            </div>
        );
    }


    return (

        <div className="p-4 flex flex-col items-center mb-20">
      <div className="w-full flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Adivina la Bandera</h2>
        <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold">
          Racha: {score}
        </div>
      </div>

      {question && (
        <div className="w-full flex flex-col items-center">
          <img 
            src={question.flagUrl} 
            alt="Adivina esta bandera" 
            className="w-full max-w-xs h-48 object-cover rounded-lg shadow-md mb-8 border border-gray-200"
          />

          <div className="grid grid-cols-1 w-full gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleGuess(option)}
                disabled={feedback !== null}
                className={`w-full py-4 px-6 rounded-xl font-medium transition-colors text-left border ${
                  feedback !== null 
                    ? option === question.correctAnswer
                      ? 'bg-green-500 text-white border-green-500' // Resalta la correcta
                      : 'bg-gray-100 text-gray-400 border-gray-200' // Opaca las incorrectas
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-blue-50 active:bg-blue-100 shadow-sm'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`mt-6 p-4 w-full text-center rounded-xl font-bold animate-bounce ${
              feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {feedback.text}
            </div>
          )}
        </div>
      )}
    </div>
    )
}

export default AdivinaBandera;