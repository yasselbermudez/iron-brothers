import { useState, useEffect, useCallback } from 'react';

import apiService from '../services/api.service';
import type { GymProfile, GymProfileInit} from '../services/api.interfaces';
import { useToast } from '../hooks/useToast';
import { ProfileCard } from './profile/ProfileCard';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ProfileForm } from './profile/ProfileForm';
import { Edit } from 'lucide-react';

export const MyProfile = () => {
  const [profile, setProfile] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
console.log(saveLoading)
  const {addToast} = useToast()
    
  const initialData = profile
  ?{
        ...profile,
        edad:parseInt(profile?.edad),
        peso_corporal:parseInt(profile?.peso_corporal),
        estatura: parseInt(profile?.estatura),
        pressBanca: parseInt(profile?.pesos.pressBanca),
        sentadilla: parseInt(profile?.pesos.sentadilla),
        pesoMuerto: parseInt(profile?.pesos.pesoMuerto),
        prensa: parseInt(profile?.pesos.prensa),
        biceps: parseInt(profile?.pesos.biceps),
    }
  :undefined

  const fetchMyProfile = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.getMyGymProfile();
      setProfile(response);
    } catch (error) {
      console.error('Error fetching gym profiles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  const onSubmit = async (editForm:GymProfileInit): Promise<void> => {
    setSaveLoading(true);
    try {
      const response = await apiService.updateGymProfile(editForm);
      if (response) {
        fetchMyProfile()
        setIsEditing(false);
        addToast("Perfil actualizado correctamente")
      }
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      addToast('Error al guardar el perfil. Intenta nuevamente.',"error");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Cargando perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-white text-xl">No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/50 border border-slate-700 rounded-xl p-2">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center my-4">
          <h1 className="text-4xl font-bold text-white mt-4">
            Mi Perfil del Gym
          </h1>
          <p className="text-slate-400">Gestiona y actualiza tu información de entrenamiento</p>
        </div>

        <ProfileCard
            profileData={profile}
            expanded={true}
        >
            
                <Button
                    size="lg"
                    className='text-white'
                    onClick={()=>setIsEditing(true)}
                >
                    <Edit/>Editar
                </Button>
        
        </ProfileCard>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="max-w-4xl max-h-[90vh] text-white overflow-y-auto bg-slate-950 border-slate-800">
                <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">Perfil personal</DialogTitle>
                <p className="text-sm text-slate-400 mt-1">Edita tu perfil de entrenamiento</p>
                </DialogHeader>

                <ProfileForm
                    initialData={initialData}
                    onSubmit={onSubmit}
                />

            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};