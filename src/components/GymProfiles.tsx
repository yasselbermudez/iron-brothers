import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import type { GymProfile } from '../services/api.interfaces';
import apiService from '../services/api.service';

interface Props {
  groupId: string|undefined
}

export const GymProfileCards: React.FC<Props> = ({groupId}) => {
  const [profiles,setProfiles] = useState<GymProfile[]|null>(null);
  const [selectedId, setSelectedId] = useState<string|null>(null);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if(!groupId) return
        const response = await apiService.getGymGroupProfiles(groupId);
        setProfiles(response)
      } catch (error) {
        console.error('Error fetching gym profiles:', error);
      }
    };
    fetchProfiles()
  }, [groupId]);

  const handleCardClick = (id:string) => {  
      setSelectedId(selectedId === id ? null : id);
  };

  if(!profiles){
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-white text-xl">No se pudieron cargar los perfiles del grupo. </div>
        <div className="text-white text-xl">Asegurate de pertenecer a un grupo.</div>
      </div>
    );
  }
  
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
          {profiles && 
          profiles.map((profile) => {
            const isExpanded = selectedId === profile.user_id;
            const displayData = profile;

            return (
              <div
                key={profile.id}
                className={`bg-slate-800/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                  isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Card Header - Siempre visible */}
                <div
                  onClick={() => handleCardClick(profile.user_id)}
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
                      <p className="text-purple-400 text-lg italic">"{displayData.apodo?displayData.apodo:'Sin apodo'}"</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {displayData.titulo?displayData.titulo:'Sin título'}
                        </span>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                          {displayData.peso_corporal}
                        </span>
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                          {profile.estatura}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido expandido */}
                {isExpanded && (
                  <div className="px-6 pb-6 ">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Columna izquierda */}
                      <div className="space-y-4">
                        {/* Info editable */}
                        <div className=" border-2 border-gray-700 p-4 rounded-xl">
                          <h3 className="text-lg font-semibold text-white mb-3">Información Personal</h3>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="text-white">Apodo:</label>
                                <p className="text-gray-400 text-sm">{displayData.apodo?displayData.apodo:'Sin apodo'}</p>
                            </div>

                            <div>
                              <label className="text-white">Título:</label>
                                <p className="text-gray-400 text-sm">{displayData.titulo?displayData.titulo:'Sin título'}</p> 
                            </div>

                            <div>
                              <label className="text-white">Peso Corporal:</label>
                                <p className="text-gray-400 text-sm">{displayData.peso_corporal}</p>
                            </div>

                            <div>
                              <label className="text-white">Mujeres:</label>
                                <p className="text-gray-400 text-sm">{displayData.mujeres?displayData.mujeres:'Ninguna'}</p>
                            </div>

                            <div>
                              <label className="text-white">Objetivo:</label>
                                <p className="text-gray-400 text-sm">{displayData.objetivo?displayData.objetivo:'Sin objetivo'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Info no editable */}
                        <div className="p-4 border-2 border-gray-700 rounded-xl ">
                          <h3 className="text-lg font-semibold text-white mb-3">Características</h3>
                          <div className="space-y-2">
                            <div>
                              <label className="text-white">Aura:</label>
                              <p className="text-gray-400 text-sm">
                                {profile.aura}
                              </p>
                            </div>
                            <div>
                              <label className="text-white">Frase:</label>
                              <p className="text-gray-400 text-sm">
                                {profile.frase?profile.frase:"Sin frase"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Columna derecha - Pesos */}
                      <div>
                        <div className=" p-4 border-gray-700 border-2 rounded-xl">
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            Record Personal
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(displayData.pesos).map(([ejercicio, peso]) => (
                              <div key={ejercicio} className="border border-gray-700 flex justify-between items-center p-3 rounded">
                                <span className="text-white capitalize">
                                  {ejercicio === 'pressBanca' ? 'Press Banca' : 
                                   ejercicio === 'sentadilla' ? 'Sentadilla' :
                                   ejercicio === 'pesoMuerto' ? 'Peso Muerto' :
                                   ejercicio === 'biceps' ? 'Bíceps' : ejercicio}:
                                </span>
                                <span className="text-gray-400">{peso}</span>
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
