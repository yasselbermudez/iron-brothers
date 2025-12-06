import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, Zap, Star, Flame, X } from 'lucide-react';
import apiService from "../../services/api.service"
import type {Mission,Nivel,Logro} from "../../services/api.interfaces"

interface MisionesPorNivel {
  [key: number]: {
    nivel: Nivel;
    misiones: Mission[];
  };
}

const MisionesGame = () => {
  const [nivelExpandido, setNivelExpandido] = useState<number|null>(null);
  const [logroVisible, setLogroVisible] = useState<{logro:Logro,misionId:string}|null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  
  console.log("Missions:", missions);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await apiService.getAllMissions()
      setMissions(response);
    } catch (error) {
      console.error('Error fetching missions:', error);
    }
  };

  // Agrupar misiones por nivel
  const misionesPorNivel = missions.reduce<MisionesPorNivel>((acc, mision) => {
    const numNivel = mision.nivel.numeroNivel;
    if (!acc[numNivel]) {
      acc[numNivel] = {
        nivel: mision.nivel,
        misiones: []
      };
    }
    acc[numNivel].misiones.push(mision);
    return acc;
  }, {});

  const niveles = Object.values(misionesPorNivel).sort((a, b) => a.nivel.numeroNivel - b.nivel.numeroNivel);

  const toggleNivel = (numNivel:number) => {
    setNivelExpandido(nivelExpandido === numNivel ? null : numNivel);
  };

  const mostrarLogro = (logro:Logro|undefined, misionId:string) => {
    if(logro)
    setLogroVisible({ logro, misionId });
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header épico */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 opacity-20 blur-3xl"></div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 mb-4 relative z-10 tracking-tight">
            MISIONES PRINCIPALES
          </h1>
          <p className="text-gray-400 text-xl relative z-10 font-medium">Conquista tu destino. Forja tu leyenda.</p>
        </div>

        {/* Grid de niveles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {niveles.map((nivel) => (
            <div key={nivel.nivel.numeroNivel} className="relative group">
              {/* Tarjeta del nivel con imagen de fondo */}
              <div
                onClick={() => toggleNivel(nivel.nivel.numeroNivel)}
                className="relative h-64 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-xl"
              >
                {/* Imagen de fondo */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${nivel.nivel.imagen})`,
                  }}
                ></div>
                
                {/* Overlay oscuro con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
                
                {/* Brillo superior */}
                <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
                
                {/* Contenido */}
                <div className="relative h-full flex flex-col justify-between p-6 z-10">
                  <div className="flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30">
                      <span className="text-orange-400 text-sm font-bold">NIVEL {nivel.nivel.numeroNivel}</span>
                    </div>
                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 border border-white/20">
                      {nivelExpandido === nivel.nivel.numeroNivel ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-4xl font-black text-white mb-3 drop-shadow-lg">{nivel.nivel.descripcionNivel}</h2>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Star className="w-5 h-5 fill-yellow-400" />
                        <span className="font-bold">{nivel.nivel.rangoXp}</span>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-lg">
                        <span className="text-white font-bold">{nivel.misiones.length} Misiones</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Lista de misiones expandibles */}
              {nivelExpandido === nivel.nivel.numeroNivel && (
                <div className="mt-4 space-y-4 animate-in slide-in-from-top duration-500">
                  {nivel.misiones.map((mision:Mission) => (
                    <div key={mision.id} className="bg-gradient-to-br from-zinc-900 to-black rounded-xl p-6 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{mision.nombre}</h3>
                          <p className="text-gray-400 leading-relaxed">{mision.descripcion}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-black px-4 py-2 rounded-lg font-black shadow-lg ml-4">
                          <Zap className="w-5 h-5 fill-black" />
                          {mision.recompensa} XP
                        </div>
                      </div>
                      
                      {mision.extra && (
                        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-4 mb-4 backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-purple-400" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-black text-sm tracking-wider">AURA PLUS</span>
                          </div>
                          <p className="text-purple-200 text-sm mb-2">{mision.extra.descripcion}</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-yellow-400 font-bold">+{mision.extra.recompensa} XP Bonus</span>
                          </div>
                        </div>
                      )}
                      
                      {mision?.logro && (
                        <button
                          onClick={() => mostrarLogro(mision?.logro, mision.id)}
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black px-5 py-3 rounded-lg font-black transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105"
                        >
                          <Trophy className="w-5 h-5" />
                          VER LOGRO
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de logro */}
      {logroVisible && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
          onClick={() => setLogroVisible(null)}
        >
          <div
            className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-3xl max-w-lg w-full transform animate-in zoom-in duration-500 shadow-2xl border-2 border-yellow-500/50 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
            
            {/* Botón cerrar */}
            <button
              onClick={() => setLogroVisible(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all z-20"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <div className="relative z-10 p-8">
              {/* Imagen del logro */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl blur-xl opacity-50"></div>
                <img 
                  src={logroVisible.logro.pegatina} 
                  alt={logroVisible.logro.nombre}
                  className="w-48 h-48 mx-auto object-cover rounded-2xl border-4 border-yellow-500 shadow-2xl relative z-10"
                />
              </div>
              
              {/* Contenido */}
              <div className="text-center">
                
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-4">
                  {logroVisible.logro.nombre}
                </h2>
                
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">{logroVisible.logro.descripcion}</p>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisionesGame;