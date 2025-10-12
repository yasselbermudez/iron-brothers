import React, { useState } from 'react';
import { User, Weight, TrendingUp, Edit2, X, Save } from 'lucide-react';

export default function GymProfileCards() {
  const [profiles, setProfiles] = useState([
        {
            id: 1,
            name: 'Javier', 
            apodo: "Alcoholicus Prime",
            titulo: "Comprometido",
            pesoCorporal: "67 kg", 
            altura: "170 cm", 
            aura: "-2000",
            deuda:{
                tipo: 'barra',
                cantidad: "1900"
            },
            pesos:{
                pressBanca: "120 kg",
                sentadilla: "130 kg",
                pesoMuerto: "140 kg",
                prensa: "250 kg",
                biceps: "60 kg"
            },
            mujeres: "0",
            reto: "Dispararle a la inglesa",
            frase: "Que haces Insecto",
            objetivo: "mover 140 en press de banca",
            evento: "tomar el finde en una esquina",
            img: "./assets/javier.png"
        },
        {
            id: 2,
            name: 'Yassel', 
            apodo: "El Tejon",
            titulo: "El que no se rinde",
            pesoCorporal: "53 kg", 
            altura: "170 cm", 
            aura: "-2000",
            deuda:{
                tipo: 'barra',
                cantidad: "350"
            },
            pesos:{
                pressBanca: "120 kg",
                sentadilla: "130 kg",
                pesoMuerto: "140 kg",
                prensa: "140 kg",
                biceps: "60 kg"
            },
            mujeres: "casado",
            reto : "una semana sin perder aura",
            frase: "Le doy dos",
            objetivo: "subir a 55 kg de peso corporal",
            evento: "",
            img: "./assets/tejon.png"
        },
        {   
            id: 3,
            name: 'Lazaro', 
            apodo: "El Pollo",
            titulo: "Descareando",
            pesoCorporal: "68 kg", 
            altura: "175 cm", 
            aura: "-1000",
            deuda:{
                tipo: 'barra',
                cantidad: "200"
            },
            pesos:{
                pressBanca: "93 kg",
                sentadilla: "100 kg",
                pesoMuerto: "120 kg",
                prensa: "220 kg",
                biceps: "40 kg"
            },
            mujeres: "0",
            reto : "tener mas pulgadas que el javiko",
            frase: "placer y penetracion",
            objetivo: "conquistar la pollita",
            evento: "",
            img: "./assets/pollo.png"
        },
        {
            id: 4,
            name: 'Luis Angel', 
            apodo: "El nuevo",
            titulo: "El que no se rinde en piernas",
            pesoCorporal: "68 kg", 
            altura: "175 cm", 
            aura: "0",
            deuda:{
                tipo: 'barra',
                cantidad: "0"
            },
            pesos:{
                pressBanca: "40 kg",
                sentadilla: "50 kg",
                pesoMuerto: "10 kg",
                prensa: "100 kg",
                biceps: "10 kg"
            },
            mujeres: "0",
            reto : "empotrar en el gym",
            frase: "te sientes fea, ven a mi casa, yo no creo en nadie",
            objetivo: "levantar mas que el tejon(imposible)",
            evento: "",
            img: "./assets/luis.png"
        },
        {
            id: 5,
            name: 'Marquitos', 
            apodo: "El tarru",
            titulo: "El terror de las menores",
            pesoCorporal: "68 kg", 
            altura: "175 cm", 
            aura: "-10000000000",
            deuda:{
                tipo: 'barra',
                cantidad: "0"
            },
            pesos:{
                pressBanca: "0 kg",
                sentadilla: "0 kg",
                pesoMuerto: "0 kg",
                prensa: "0 kg",
                biceps: "0 kg"
            },
            mujeres: "0",
            reto : "ir al gym",
            frase: "donde estan las menores",
            objetivo: "coger una menor y que no le pegue los tarros",
            evento: "",
            img: "./assets/marquitos.png"
        },
    ]);

  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleCardClick = (id) => {
    if (editingId === null) {
      setSelectedId(selectedId === id ? null : id);
    }
  };

  const startEditing = (profile) => {
    setEditingId(profile.id);
    setEditForm({
      apodo: profile.apodo,
      titulo: profile.titulo,
      pesoCorporal: profile.pesoCorporal,
      pesos: { ...profile.pesos },
      mujeres: profile.mujeres,
      objetivo: profile.objetivo
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    setProfiles(profiles.map(p => 
      p.id === editingId 
        ? { ...p, ...editForm }
        : p
    ));
    setEditingId(null);
    setEditForm({});
  };

  const updateEditForm = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const updatePeso = (ejercicio, value) => {
    setEditForm({
      ...editForm,
      pesos: { ...editForm.pesos, [ejercicio]: value }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          <Weight className="inline-block mr-3 mb-1" size={36} />
          Perfiles del Gym
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => {
            const isExpanded = selectedId === profile.id;
            const isEditing = editingId === profile.id;
            const displayData = isEditing ? editForm : profile;

            return (
              <div
                key={profile.id}
                className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                  isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Card Header - Siempre visible */}
                <div
                  onClick={() => handleCardClick(profile.id)}
                  className={`p-6 cursor-pointer hover:bg-gray-750 transition-colors ${
                    isEditing ? 'pointer-events-none' : ''
                  }`}
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
                          {displayData.pesoCorporal}
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
                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2 mb-4 pt-4">
                      {!isEditing ? (
                        <button
                          onClick={() => startEditing(profile)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                          Editar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={cancelEditing}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                          >
                            <X size={18} />
                            Cancelar
                          </button>
                          <button
                            onClick={saveEditing}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <Save size={18} />
                            Guardar
                          </button>
                        </>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Columna izquierda */}
                      <div className="space-y-4">
                        {/* Info editable */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-white mb-3">Información Personal</h3>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="text-gray-400 text-sm">Apodo:</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.apodo}
                                  onChange={(e) => updateEditForm('apodo', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 outline-none"
                                />
                              ) : (
                                <p className="text-white">"{displayData.apodo}"</p>
                              )}
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Título:</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.titulo}
                                  onChange={(e) => updateEditForm('titulo', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 outline-none"
                                />
                              ) : (
                                <p className="text-white">{displayData.titulo}</p>
                              )}
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Peso Corporal:</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.pesoCorporal}
                                  onChange={(e) => updateEditForm('pesoCorporal', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 outline-none"
                                />
                              ) : (
                                <p className="text-white">{displayData.pesoCorporal}</p>
                              )}
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Mujeres:</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.mujeres}
                                  onChange={(e) => updateEditForm('mujeres', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 outline-none"
                                />
                              ) : (
                                <p className="text-white">{displayData.mujeres}</p>
                              )}
                            </div>

                            <div>
                              <label className="text-gray-400 text-sm">Objetivo:</label>
                              {isEditing ? (
                                <textarea
                                  value={editForm.objetivo}
                                  onChange={(e) => updateEditForm('objetivo', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 outline-none"
                                  rows="2"
                                />
                              ) : (
                                <p className="text-white">{displayData.objetivo}</p>
                              )}
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
                            <p className="text-gray-300">
                              <span className="text-gray-400">Reto:</span> {profile.reto}
                            </p>
                            <p className="text-gray-300">
                              <span className="text-gray-400">Evento:</span> {profile.evento}
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
                            Records de Pesos
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
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editForm.pesos[ejercicio]}
                                    onChange={(e) => updatePeso(ejercicio, e.target.value)}
                                    className="w-24 px-2 py-1 bg-gray-500 text-white rounded border border-gray-400 focus:border-blue-500 outline-none text-right"
                                  />
                                ) : (
                                  <span className="text-white font-bold">{peso}</span>
                                )}
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