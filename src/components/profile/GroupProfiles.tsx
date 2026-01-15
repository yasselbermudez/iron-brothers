import { useEffect, useState } from 'react';
import type { GymProfile, User } from '../../services/api.interfaces';
import apiService from '../../services/api.service';
import { ProfileCard } from './ProfileCard';
import Loader from '../loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface ProfileCardsProps{
  user:User
}

export const GroupProfiles = ({user}:ProfileCardsProps) => {

  const [profiles,setProfiles] = useState<GymProfile[]|null>(null);
  const [loadingProfile,setLoadingProfile] = useState(false)

  const [selectedProfile,setSelectedProfile] = useState<string|null>(null)

  const groupId = user?.group_id

  useEffect(() => {
    const fetchProfiles = async () => {
      if(!user.is_active || !groupId) return
      try {
        setLoadingProfile(true)
        const response = await apiService.getGymGroupProfiles(groupId);
        setProfiles(response)
      } catch (error) {
        console.error('Error fetching gym profiles:', error);
      } finally {
        setLoadingProfile(false)
      }
    };
    fetchProfiles()
  }, [groupId,user.is_active]);

  if (!user) return

  if(!user.is_active || !user.group_id){
    return (
      <div className='p-10 text-center'>
            <h1 className='text-white text-xl font-semibold'>Perfiles grupales no disponibles</h1>
            <p className='text-slate-400'>Asegurate de iniciar el perfil y de pertenecer a un grupo</p>
      </div>
    );
  }

  if (loadingProfile) {
    return <Loader text="Cargando perfiles..."/>
  }

  if(!profiles){
    return (
      <div className='p-10 text-center'>
            <h1 className='text-white text-xl font-semibold'>No se pudieron cargar los perfiles</h1>
      </div>
    );
  }

  return (
    <Card className='border-0'> 
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Perfiles del Grupo
        </CardTitle>
        <CardDescription className='text-slate-400'>
          Obten información de tus compañeros
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <Separator className='bg-slate-700'/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {profiles.map((profile) => {
            return (
              <ProfileCard
                profileData={profile}
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
              />
            )
          })}
        </div>

      </CardContent>
    </Card>
  );
}
