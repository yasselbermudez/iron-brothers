import { useEffect, useState } from 'react';
import type { GymProfile } from '../services/api.interfaces';
import apiService from '../services/api.service';
import { ProfileCard } from './profile/ProfileCard';

interface Props {
  groupId: string|undefined
}

export const GymProfileCards: React.FC<Props> = ({groupId}) => {
  const [profiles,setProfiles] = useState<GymProfile[]|null>(null);
  
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
            return (
              <ProfileCard
                profileData={profile}
              >
              </ProfileCard>
            )
          })}
        </div>
      </div>
    </div>
  );
}
