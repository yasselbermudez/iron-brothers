import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';
import { type LogroGalery } from '../../services/api.interfaces';
import Loader from '../loader';

export default function GaleryLogros() {
  const [logros, setLogros] = useState<LogroGalery[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadingLogros,setLoadingLogros] = useState(false)

  useEffect(() => {
    fetchLogros();
  }, []);

  const fetchLogros = async () => {
    try {
      setLoadingLogros(true)
      const response = await apiService.getAllLogros();
      setLogros(response);
    } catch (error) {
      console.error('Error fetching logros:', error);
    } finally{
      setLoadingLogros(false)
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "1": return 'from-amber-600 to-orange-700';
      case "2": return 'from-purple-600 to-fuchsia-700';
      case "3": return 'from-cyan-600 to-blue-700';
      default: return 'from-gray-600 to-red-700';
    }
  };

  const getNivelBorder = (nivel: string) => {
    switch (nivel) {
      case "1": return 'border-amber-500/30';
      case "2": return 'border-purple-500/30';
      case "3": return 'border-cyan-500/30';
      default: return 'border-red-500/30';
    }
  };

  const getNivelGlow = (nivel: string) => {
    switch (nivel) {
      case "1": return 'shadow-amber-500/20';
      case "2": return 'shadow-purple-500/20';
      case "3": return 'shadow-cyan-500/20';
      default: return 'shadow-red-500/20';
    }
  };

  if (loadingLogros) {
    return <Loader text="Cargando galeria de logros"/>
  }
    
  if (!logros) {
    return (
      <div className="p-10 text-center ">
        <div className="text-white text-xl font-semibold">No se pudo cargar la galeria de logros</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/50 border border-slate-700 rounded-xl p-4">
     
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 opacity-20 blur-3xl"></div>
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 mb-4 relative z-10 tracking-tight">
          Logros Epicos
        </h1>
        <p className="text-white text-xl relative z-10 font-medium">Informacion sobre todas los logros</p>
      </div>

      {/* Grid compacto de logros */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {logros.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative group transition-all duration-300 ${
              hoveredId === achievement.id ? 'scale-105 z-10' : ''
            }`}
            onMouseEnter={() => setHoveredId(achievement.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Card cuadrada más oscura */}
            <div className={`relative bg-gradient-to-br from-gray-950 to-black rounded-xl overflow-hidden border ${
              hoveredId === achievement.id
                ? `border-opacity-100 ${getNivelBorder(achievement.nivel).replace('/30', '/60')} shadow-2xl ${getNivelGlow(achievement.nivel).replace('/20', '/40')}`
                : `${getNivelBorder(achievement.nivel)} shadow-lg ${getNivelGlow(achievement.nivel)}`
            } transition-all duration-300`}>

              {/* Borde superior de color */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getNivelColor(achievement.nivel)} ${
                hoveredId === achievement.id ? 'opacity-100' : 'opacity-60'
              }`}></div>

              {/* Contenido */}
              <div className="p-5">
                {/* Icono y badge de nivel */}
                <div className="flex items-start justify-between mb-3">
                  
                  <img
                      src={achievement.pegatina}
                      alt={achievement.nombre}
                      className="w-22 h-22 "
                    />

                  
                </div>

                {/* Título */}
                <h3 className={`text-lg font-bold mb-2 ${
                  hoveredId === achievement.id
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'
                    : 'text-white'
                } transition-all duration-300`}>
                  {achievement.nombre}
                </h3>

                {/* Descripción */}
                <p className="text-gray-400 text-xs mb-3 leading-relaxed min-h-[2.5rem]">
                  {achievement.descripcion}
                </p>

                {/* Separador */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-3"></div>

                {/* Misión asociada */}
                <div className="space-y-3">
                  <div className={`px-3 py-1 bg-gradient-to-br ${getNivelColor(achievement.nivel)} rounded-full text-white font-bold text-xs shadow-lg`}>
                    Nivel {achievement.nivel}
                  </div>
                </div>
              </div>

              {/* Efecto de brillo al hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${getNivelColor(achievement.nivel)} opacity-0 ${
                hoveredId === achievement.id ? 'opacity-5' : ''
              } transition-opacity duration-300 pointer-events-none`}></div>

              {/* Brillo en las esquinas al hover */}
              {hoveredId === achievement.id && (
                <>
                  <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-br ${getNivelColor(achievement.nivel)} opacity-20 blur-xl`}></div>
                  <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${getNivelColor(achievement.nivel)} opacity-20 blur-xl`}></div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}