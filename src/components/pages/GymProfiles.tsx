import { useEffect, useState } from 'react';
import { User, TrendingUp } from 'lucide-react';
import type { GymProfile } from '../../services/api.interfaces';
import apiService from '../../services/api.service';

interface Props {
  groupId: string|undefined
}

export const GymProfileCards: React.FC<Props> = ({groupId}) => {
  const [profiles,setProfiles] = useState<GymProfile[]|null>(null);
  const [selectedId, setSelectedId] = useState<number|null>(null);
  
  useEffect(() => {
      fetchProfiles()
    }, []);

  const fetchProfiles = async () => {
      try {
        if(!groupId) return
        const response = await apiService.getGymGroupProfiles(groupId);
        setProfiles(response)
      } catch (error) {
        console.error('Error fetching gym profiles:', error);
      }
  };

  const handleCardClick = (id:number) => {  
      setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-900/50 border border-slate-700 rounded-xl p-1 p-2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center my-4">
          <h1 className="text-4xl font-bold text-white mt-4 text-center">
            Perfiles del Grupo
          </h1>
          <p className="text-slate-400">Obten información de tus compañeros</p>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!profiles && !groupId && (
            <h3 className=" font-bold text-white mb-8 text-center">
              Probablemente no tienes grupo necesitas ir al menu de navegacio y unete a un equipo o crea uno 
            </h3>
          )}
          {profiles && 
          profiles.map((profile) => {
            const isExpanded = selectedId === profile.id;
            const displayData = profile;

            return (
              <div
                key={profile.id}
                className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Card Header - Siempre visible */}
                <div
                  onClick={() => handleCardClick(profile.id)}
                  className="p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      {profile.img ? (
                        <img src={profile.img} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={40} className="text-white" />
                      )}
                    </div>

                    {/* Info básica */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                      <p className="text-purple-400 text-lg italic">"{displayData.apodo}"</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {displayData.titulo}
                        </span>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                          {displayData.peso_corporal}
                        </span>
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {profile.altura}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido expandido */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-700">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Columna izquierda */}
                      <div className="space-y-4">
                        {/* Info editable */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-white mb-3">Información Personal</h3>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="text-gray-400 text-sm">Apodo:</label>
                                <p className="text-white">"{displayData.apodo}"</p>
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Título:</label>
                                <p className="text-white">{displayData.titulo}</p> 
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Peso Corporal:</label>
                                <p className="text-white">{displayData.peso_corporal}</p>
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Mujeres:</label>
                                <p className="text-white">{displayData.mujeres}</p>
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Objetivo:</label>
                                <p className="text-white">{displayData.objetivo}</p>
                            </div>
                          </div>
                        </div>

                        {/* Info no editable */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-white mb-3">Características</h3>
                          <div className="space-y-2">
                            <p className="text-gray-300">
                              <span className="text-gray-400">Aura:</span> <span className="text-red-400 font-bold">{profile.aura}</span>
                            </p>
                            <p className="text-gray-300">
                              <span className="text-gray-400">Deuda:</span> {profile.deuda.cantidad} ({profile.deuda.tipo})
                            </p>
                            <p className="text-purple-300 italic mt-3">
                              💬 "{profile.frase}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Columna derecha - Pesos */}
                      <div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <TrendingUp size={20} />
                            Los putos PR
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(displayData.pesos).map(([ejercicio, peso]) => (
                              <div key={ejercicio} className="flex justify-between items-center bg-gray-600 p-3 rounded">
                                <span className="text-gray-300 capitalize">
                                  {ejercicio === 'pressBanca' ? 'Press Banca' : 
                                   ejercicio === 'sentadilla' ? 'Sentadilla' :
                                   ejercicio === 'pesoMuerto' ? 'Peso Muerto' :
                                   ejercicio === 'biceps' ? 'Bíceps' : ejercicio}:
                                </span>
                                  <span className="text-white font-bold">{peso}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
