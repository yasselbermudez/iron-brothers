import { useState, useEffect, useCallback } from 'react';
import { User, TrendingUp, Edit2, X, Save } from 'lucide-react';

import apiService from '../services/api.service';
import type { GymProfile, Pesos } from '../services/api.interfaces';

interface Props {
  userId: string;
}

type EditFormData = {
  apodo: string;
  frase: string;
  peso_corporal: string;
  pesos: Pesos;
  mujeres: string;
  objetivo: string;
};

export const MyGymProfile: React.FC<Props> = ({ userId }) => {
  const [profile, setProfile] = useState<GymProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchMyProfile = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.getMyGymProfile(userId);
      setProfile(response);
    } catch (error) {
      console.error('Error fetching gym profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  const startEditing = (): void => {
    if (profile) {
      setEditForm({
        apodo: profile.apodo,
        frase: profile.frase,
        peso_corporal: profile.peso_corporal,
        pesos: { ...profile.pesos },
        mujeres: profile.mujeres,
        objetivo: profile.objetivo
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
    setEditForm(null);
  };

  const saveProfile = async (): Promise<void> => {
    if (!profile || !editForm) return;

    setSaveLoading(true);
    setMessage('');

    try {
      const response = await apiService.updateGymProfile(editForm);

      if (response) {
        fetchMyProfile()
        setIsEditing(false);
        setEditForm(null);
        setMessage('Perfil actualizado correctamente');
        
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      setMessage('Error al guardar el perfil. Intenta nuevamente.');
    } finally {
      setSaveLoading(false);
    }
  };

  const updateEditForm = (field: keyof EditFormData, value: string): void => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updatePeso = (ejercicio: keyof Pesos, value: string): void => {
    setEditForm(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pesos: {
          ...prev.pesos,
          [ejercicio]: value
        }
      };
    });
  };

  // Datos a mostrar - si está editando usa editForm, sino profile
  const displayData = isEditing ? editForm : profile;

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
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center my-4">
          <h1 className="text-4xl font-bold text-white mt-4">
            Mi Perfil del Gym
          </h1>
          <p className="text-slate-400">Gestiona y actualiza tu información de entrenamiento</p>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-900/50 border border-red-700 text-red-200' 
              : 'bg-green-900/50 border border-green-700 text-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Tarjeta del perfil - Siempre expandida */}
        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          {/* Header de la tarjeta */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                {profile.img ? (
                  <img 
                    src={profile.img} 
                    alt={profile.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <User size={48} className="text-white" />
                )}
              </div>

              {/* Información básica */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                    <p className="text-purple-400 text-xl italic mt-1">"{displayData?.apodo || ''}"</p>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={startEditing}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
                      >
                        <Edit2 size={18} />
                        Editar Perfil
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        >
                          <X size={18} />
                          Cancelar
                        </button>
                        <button
                          onClick={saveProfile}
                          disabled={saveLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors shadow-lg"
                        >
                          <Save size={18} />
                          {saveLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-slate-700 text-slate-300 rounded-full text-sm border border-slate-600">
                    {displayData?.frase || ''}
                  </span>
                  <span className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                    {displayData?.peso_corporal || ''}
                  </span>
                  <span className="px-4 py-2 bg-slate-700 text-slate-300 rounded-full text-sm border border-slate-600">
                    {profile.estatura}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido expandido - Siempre visible */}
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Columna izquierda - Información personal */}
              <div className="space-y-6">
                {/* Información editable */}
                <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                    Información Personal
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm font-medium block mb-2">Apodo:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData?.apodo || ''}
                          onChange={(e) => updateEditForm('apodo', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                          placeholder="Tu apodo en el gym"
                        />
                      ) : (
                        <p className="text-white text-lg">"{displayData?.apodo || ''}"</p>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm font-medium block mb-2">Frase:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData?.frase|| ''}
                          onChange={(e) => updateEditForm('frase', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                          placeholder="Ej: Powerlifter, Bodybuilder, etc."
                        />
                      ) : (
                        <p className="text-white text-lg">{displayData?.frase || ''}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm font-medium block mb-2">Peso Corporal:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData?.peso_corporal || ''}
                          onChange={(e) => updateEditForm('peso_corporal', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                          placeholder="Ej: 85 kg"
                        />
                      ) : (
                        <p className="text-white text-lg">{displayData?.peso_corporal || ''}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm font-medium block mb-2">Mujeres:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayData?.mujeres || ''}
                          onChange={(e) => updateEditForm('mujeres', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors"
                          placeholder="Ej: 15 mujeres"
                        />
                      ) : (
                        <p className="text-white text-lg">{displayData?.mujeres || ''}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm font-medium block mb-2">Objetivo:</label>
                      {isEditing ? (
                        <textarea
                          value={displayData?.objetivo || ''}
                          onChange={(e) => updateEditForm('objetivo', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-colors resize-none"
                          rows={3}
                          placeholder="Describe tus objetivos de entrenamiento..."
                        />
                      ) : (
                        <p className="text-white text-lg leading-relaxed">{displayData?.objetivo || ''}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información no editable */}
                <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-600 pb-2">
                    Características
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-600/50">
                      <span className="text-slate-400">Estatura:</span>
                      <span className="text-red-400 font-bold text-lg">{profile.estatura}cm</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-600/50">
                      <span className="text-slate-400">Aura:</span>
                      <span className="text-red-400 font-bold text-lg">{profile.aura}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-600/50">
                      <span className="text-slate-400">Titulo:</span>
                      <span className="text-red-400 font-bold text-lg">"{profile.titulo}"</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Records de pesos */}
              <div>
                <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 sticky top-6">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-600 pb-2 flex items-center gap-2">
                    <TrendingUp size={24} />
                    Records de Pesos
                  </h3>
                  <div className="space-y-4">
                    {displayData?.pesos && Object.entries(displayData.pesos).map(([ejercicio, peso]) => (
                      <div 
                        key={ejercicio} 
                        className="flex justify-between items-center bg-slate-600/50 p-4 rounded-lg border border-slate-500 hover:border-slate-400 transition-colors"
                      >
                        <span className="text-slate-300 capitalize font-medium">
                          {ejercicio === 'pressBanca' ? 'Press Banca' : 
                           ejercicio === 'sentadilla' ? 'Sentadilla' :
                           ejercicio === 'pesoMuerto' ? 'Peso Muerto' :
                           ejercicio === 'biceps' ? 'Bíceps' : 
                           ejercicio}
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={peso || ''}
                            onChange={(e) => updatePeso(ejercicio as keyof Pesos, e.target.value)}
                            className="w-32 px-3 py-2 bg-slate-500 text-white rounded border border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-right font-bold"
                            placeholder="0 kg"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg bg-slate-700 px-3 py-1 rounded">
                            {peso}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};