import { useState, useEffect, useCallback } from 'react';

import apiService from '../../services/api.service';
import type { GymProfile, GymProfileInit, GymProfileForm, User} from '../../services/api.interfaces';
import { useToast } from '../../hooks/useToast';
import { ProfileCard } from './ProfileCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ProfileForm } from './ProfileForm';
import { Edit } from 'lucide-react';
import Loader from '../loader';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface ProfileProps{
  user:User
}

export const MyProfile = ({user}:ProfileProps) => {

  const [profile, setProfile] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedProfile,setSelectedProfile] = useState<string|null>(null)
  
  const {addToast} = useToast()
    
  const initialData:GymProfileForm|undefined = profile
  ?{
        mujeres: profile.mujeres,
        apodo: profile.apodo,
        frase: profile.frase,
        objetivo: profile.objetivo,
        edad:parseInt(profile?.edad),
        peso_corporal:parseInt(profile?.peso_corporal),
        estatura: parseInt(profile?.estatura),
        pressBanca: parseInt(profile?.pesos.pressBanca),
        sentadilla: parseInt(profile?.pesos.sentadilla),
        pesoMuerto: parseInt(profile?.pesos.pesoMuerto),
        prensa: parseInt(profile?.pesos.prensa),
        biceps: parseInt(profile?.pesos.biceps),
        description: ""
    }
  :undefined

  const fetchMyProfile = useCallback(async (): Promise<void> => {
    if(!user.is_active) return
    try {
      setLoading(true);
      const response = await apiService.getMyGymProfile();
      setProfile(response);
    } catch (error) {
      console.error('Error fetching gym profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [user.is_active]);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  const onSubmit = async (editForm:GymProfileInit): Promise<void> => {
    try {
      const response = await apiService.updateGymProfile(editForm);
      setProfile(response)
      addToast("Perfil actualizado correctamente")
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      addToast('Error al guardar el perfil. Intenta nuevamente.',"error");
    } finally {
      setIsEditing(false);
    }
  };

  if(!user || !user.is_active){ 
    return(
      <div className='p-10 text-center'>
            <h1 className='text-white text-xl font-semibold'>Perfil no disponible</h1>
            <p className='text-slate-400'>Asegurate de iniciar el perfil</p>
      </div>
    )
  }

  if (loading) {
    return <Loader text="Cargando perfil..."/>
  }

  if (!profile) {
    return (
      <div className="p-10  text-center">
        <div className="text-white text-xl font-semibold">No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <Card className='border-0 p-0 gap-0'> 
      <CardHeader className='px-2 sm:px-3 sm:pt-3 md:px-4 md:pt-4 lg:px-6 lg:pt-6'>
        <CardTitle className="text-2xl text-white">
          Mi Perfil del Gym
        </CardTitle>
        <CardDescription className='flex justify-between flex items-center text-slate-400 '>
            Gestiona y actualiza tu información de entrenamiento
            <Button
              size="lg"
              className='hover:text-white bg-slate-800 hover:bg-slate-600 rounded'
              onClick={()=>setIsEditing(true)}
            >
              <Edit/>Editar
            </Button>
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-2 md:space-y-4 lg:space-y-6 p-2 md:p-4 lg:p-6'>
        <Separator className='bg-slate-700'/>
        <ProfileCard
            profileData={profile}
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
        />
      
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-[95vw] overflow-hidden text-white bg-slate-950 border-slate-700 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Perfil personal</DialogTitle>
              <DialogDescription className="text-slate-400">Edita tu perfil de entrenamiento</DialogDescription>
            </DialogHeader>
            <div 
              className="pr-2 overflow-y-auto max-h-[calc(90vh-100px)]"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff #0f172a' }}
            >
              <ProfileForm
                initialData={initialData}
                onSubmit={onSubmit}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};