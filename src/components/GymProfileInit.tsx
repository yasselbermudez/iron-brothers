import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Settings2 } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import apiService from "../services/api.service";
import type { GymProfileInit, Pesos } from '../services/api.interfaces';

interface ProfileDialogProps {
  openInitProfile: boolean;
  setOpenInitProfile: (open: boolean) => void;
  refreshUser: ()=> void;
}

export const ProfileInitDialog: React.FC<ProfileDialogProps> = ({
  openInitProfile,
  setOpenInitProfile,
  refreshUser
}) => {
  // Estado para los datos del perfil
  const [profileData, setProfileData] = useState<GymProfileInit>({
    apodo: '',
    edad: '',
    estatura: '',
    peso_corporal: '',
    frase: '',
    objetivo: '',
    summary: '',
    pesos: {
      pressBanca: '',
      sentadilla: '',
      pesoMuerto: '',
      prensa: '',
      biceps: ''
    }
  });

  // Manejar cambios en los campos de texto
  const handleInputChange = (field: keyof Omit<GymProfileInit, 'pesos'>, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar cambios en los pesos
  const handlePesoChange = (exercise: keyof Pesos, value: string) => {
    setProfileData(prev => ({
      ...prev,
      pesos: {
        ...prev.pesos,
        [exercise]: value
      }
    }));
  };

  // Manejar cambios en la descripción
  const handleDescripcionChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      descripcion: value
    }));
  };

  // Función para activar el perfil
  const handleActivate = async () => {
    // Filtrar campos vacíos opcionales
    const filteredData: GymProfileInit= {
      ...profileData,
      pesos: Object.entries(profileData.pesos || {}).reduce((acc, [key, value]) => {
        if (value) acc[key as keyof Pesos] = value;
        return acc;
      }, {} as Pesos)
    };
    
    // Eliminar campos vacíos
    Object.keys(filteredData).forEach(key => {
      if (filteredData[key as keyof typeof filteredData] === '') {
        delete filteredData[key as keyof typeof filteredData];
      }
    });
    
    await apiService.init_profile_gamer(filteredData)
    setOpenInitProfile(false);
    refreshUser(); 
    
  };

  return (
    <Dialog open={openInitProfile} onOpenChange={setOpenInitProfile}>
      <DialogContent className="max-w-4xl max-h-[90vh] text-white overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Iniciar Perfil</DialogTitle>
          <p className="text-sm text-slate-400 mt-1">Completa tu perfil de entrenamiento</p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Sección 1: Información Personal */}
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold text-white mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label htmlFor="edad" className="text-slate-300">Edad</Label>
                <Input
                  id="edad"
                  value={profileData.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  placeholder="Tu edad"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso_corporal" className="text-slate-300">Peso Corporal (kg)</Label>
                <Input
                  id="peso_corporal"
                  type="number"
                  value={profileData.peso_corporal}
                  onChange={(e) => handleInputChange('peso_corporal', e.target.value)}
                  placeholder="Ej: 75"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estatura" className="text-slate-300">Estatura(cm)</Label>
                <Input
                  id="estatura"
                  value={profileData.estatura}
                  onChange={(e) => handleInputChange('estatura', e.target.value)}
                  placeholder="Tu estatura"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frase" className="text-slate-300">Frase personal</Label>
                <Input
                  id="frase"
                  value={profileData.frase}
                  onChange={(e) => handleInputChange('frase', e.target.value)}
                  placeholder="Una frase o lema personal que te identifique"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apodo" className="text-slate-300">Apodo</Label>
                <Input
                  id="apodo"
                  value={profileData.apodo}
                  onChange={(e) => handleInputChange('apodo', e.target.value)}
                  placeholder="Tu apodo en el gym"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo" className="text-slate-300">Objetivo</Label>
                <Input
                  id="objetivo"
                  value={profileData.objetivo}
                  onChange={(e) => handleInputChange('objetivo', e.target.value)}
                  placeholder="Algun objetivo proyecto que tengas en mente"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="frase" className="text-slate-300">Frase Motivacional</Label>
              <Input
                id="frase"
                value={profileData.frase}
                onChange={(e) => handleInputChange('frase', e.target.value)}
                placeholder="Tu frase o lema personal"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Sección 2: Pesos */}
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold text-white mb-4">Récords de Pesos (kg)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'pressBanca', label: 'Press Banca', placeholder: 'Ej: 100' },
                { id: 'sentadilla', label: 'Sentadilla', placeholder: 'Ej: 120' },
                { id: 'pesoMuerto', label: 'Peso Muerto', placeholder: 'Ej: 150' },
                { id: 'prensa', label: 'Prensa', placeholder: 'Ej: 200' },
                { id: 'biceps', label: 'Bíceps', placeholder: 'Ej: 40' }
              ].map((exercise) => (
                <div key={exercise.id} className="space-y-2">
                  <Label htmlFor={exercise.id} className="text-slate-300">{exercise.label}</Label>
                  <Input
                    id={exercise.id}
                    type="number"
                    value={profileData.pesos?.[exercise.id as keyof Pesos] || ''}
                    onChange={(e) => handlePesoChange(exercise.id as keyof Pesos, e.target.value)}
                    placeholder={exercise.placeholder}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sección 3: Descripción */}
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold text-white mb-4">Resumen / Descripción Personal</h2>
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-slate-300">
                Cuéntanos sobre ti, tu experiencia, motivación, etc.
              </Label>
              <Textarea
                id="descripcion"
                value={profileData.summary}
                onChange={(e) => handleDescripcionChange(e.target.value)}
                placeholder="Escribe aquí tu descripción personal..."
                rows={5}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                {profileData.summary?.length || 0}/500 caracteres
              </p>
            </div>
          </div>

          {/* Botón de activación */}
          <Button 
            onClick={handleActivate} 
            variant="outline" 
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-700 hover:from-slate-700 hover:to-slate-800 hover:text-white hover:border-slate-600 transition-all duration-300 py-6"
          >
            <Settings2 className="h-5 w-5 mr-3" />
            <span className="text-lg font-semibold">Activar Perfil</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};