import { useEffect, useState } from 'react';


function SplashScreen({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-600 text-white">
        <h1 className="text-4xl font-bold mb-4">🌍 Explorador Global</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }
  return children;
}

export default SplashScreen;