import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';
import type { EventHistory, User } from '../../services/api.interfaces';
import Loader from '../loader';
import { Separator } from '../ui/separator';

const MissionHistory = ({user}:{user:User}) => {
  
  const [loading,setLoading] = useState(false)

  const [missions, setMissions] = useState<EventHistory[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      if(!user.is_active) return
      try{
        setLoading(true)
        const response = await apiService.getHistory()
        setMissions(response);
        // Extract logros 
        const completedAchievements = response
          .filter(mission => mission.status === 'completed' && mission.logro_name)
          .map(mission => mission.logro_name!);
        setAchievements(completedAchievements);
      } catch (error) {
        console.log("Error cargando historia: ",error)
      } finally {
        setLoading(false)
      }
    };
    fetchMissions()
  }, [user.is_active]);

  const mainMissions = missions.filter(mission => mission.tipo === 'mission');
  const secondaryMissions = missions.filter(mission => mission.tipo === 'secondary_mission');

  const MissionCard = ({ mission }: { mission: EventHistory }) => (
    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-semibold">{mission.name}</h3>
          <p className="text-slate-300 break-words max-w-[20vw] text-sm mt-1">{mission.result}</p>
          {mission.logro_name && (
            <span className="inline-block bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded mt-2">
              🏆 {mission.logro_name}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            mission.status === 'completed' 
              ? 'bg-green-500 text-green-900' 
              : 'bg-red-500 text-red-900'
          }`}>
            {mission.status === 'completed' ? '✅ Completada' : '❌ Fallida'}
          </span>
        </div>
      </div>
      <div className="text-slate-400 text-xs mt-3">
        {new Date(mission.created).toLocaleDateString()}
      </div>
    </div>
  );

  if (!user.is_active) {
    return (
      <div className='p-10 text-center'>
            <h1 className='text-white text-xl font-semibold'>Historial no disponible</h1>
            <p className='text-slate-400'>Asegurate de iniciar el perfil</p>
      </div>
    );
  }

  if (loading) {
      return <Loader text="Cargando historial..."/>
  }

  if (!missions) {
    return (
      <div className='p-10 text-center'>
            <h1 className='text-white text-xl font-semibold'>Nos se pudo cargar el historial</h1>
      </div>
    );
  }

  return (
    <div className="text-white rounded-xl p-6">
      <div className='mb-5'>
        <h1 className="text-2xl font-bold text-white">Historial de progreso</h1>
        <p className="text-slate-400">Resultados de misiones y logros obtenidos </p>
        <Separator className='bg-slate-700 mt-5'/>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Misiones Principales */}
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Misiones Principales
          </h2>
          <div className="space-y-4">
            {mainMissions.map(mission => (
              <MissionCard key={mission.mission_id} mission={mission} />
            ))}
          </div>
        </section>

        {/* Misiones Secundarias */}
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Misiones Secundarias
          </h2>
          <div className="space-y-4">
            {secondaryMissions.map(mission => (
              <MissionCard key={mission.mission_id} mission={mission} />
            ))}
          </div>
        </section>

        {/* Logros */}
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
            <span className="text-yellow-500 mr-2">🏆</span>
            Logros Desbloqueados
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-yellow-600 to-amber-700 rounded-lg p-4 border border-amber-500"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">🏅</span>
                  <span className="font-medium">{achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MissionHistory;