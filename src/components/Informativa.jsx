import { User, BookOpen, Code2, Info } from 'lucide-react';

function Informativa() {
  return (
    <div className="p-4 flex flex-col gap-4 mb-20">
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg text-center">
        <Info className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-2xl font-bold">Explorador de Paises</h1>
        <p className="text-blue-100 mt-1">Versión 1.0.0</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
          <User size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Desarrollador</p>
          <p className="font-bold text-gray-800">Gabriel Pino</p>
          <a href='https://github.com/DevGabrx/APP_Countries' target='_blank' className="text-blue-600 hover:text-blue-800 underline">
            Aquí encuentras el repositorio de GitHub
          </a>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
          <BookOpen size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Institución</p>
          <p className="font-bold text-gray-800">Universidad Uniagustiniana</p>
          <p className="text-xs text-gray-500">Desarrollo de Software</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
          <Code2 size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Tecnologías</p>
          <p className="font-bold text-gray-800">React, Tailwind CSS v4, API REST Countries</p>
        </div>
      </div>
    </div>
  );
}

export default Informativa;