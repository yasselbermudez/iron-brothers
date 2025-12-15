import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Users, CheckCircle } from 'lucide-react';
import apiService from '../services/api.service';
import type { Assignment, UpdateMissionsParamsVote } from '../services/api.interfaces';
import { MissionType } from '../services/api.interfaces';
interface Props{
  isOpen:boolean,
  onClose: ()=>void
  users:User[]
  me: string
}

interface User {
  user_name:string
  user_id: string
}

interface PendingMissions {
  type: MissionType
  label: string,
  mission_name: string
  mission_id: string
  status: "active" | "pending_review" | "completed" | "failed"
  creation_date: string
  result?: string
  like?: number
  dislike?: number
  voters: string[]
}

const MissionReviewModal = ({ isOpen, onClose, users ,me}:Props) => {

  const [selectedPlayerId, setSelectedPlayerId] = useState<string|null>(null);
  const [playerData, setPlayerData] = useState<Assignment|null>(null);
  const [selectedMission, setSelectedMission] = useState<PendingMissions|null>(null);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  
  const totalUsers = users.length
  const players = users.filter(user => user.user_id !== me);

  const canVote = selectedMission?.voters.filter(voterId => voterId === me).length === 0;

  console.log("total users: ",totalUsers)

  const fetchPlayerMissions = async (playerId:string) => {
    try {
      setLoading(true);
      setPlayerData(null);
      setSelectedMission(null);

      const data = await apiService.getAssignament(playerId);
      setPlayerData(data);
    
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelect = (playerId:string) => {
    setSelectedPlayerId(playerId);
    fetchPlayerMissions(playerId);
  };

  const handleVote = async (approve:boolean) => {
    if (!selectedMission || voting || !selectedPlayerId) return;
    
    try {
      setVoting(true);
      
      const voteData:UpdateMissionsParamsVote = approve
      ?{
        mission_type:selectedMission.type,
        group_size: totalUsers,
        like: 1
      }
      :
      {
        mission_type:selectedMission.type,
        group_size: totalUsers,
        dislike: 1
      }
      
      const response = await apiService.updateAssignmentVote(selectedPlayerId,voteData)
      
      if(!response.success) throw response.message;
      
      fetchPlayerMissions(selectedPlayerId);
      setSelectedMission(null);

    } catch (error) {
      console.error('Error al votar:', error);
      alert('Error al registrar el voto');
    } finally {
      setVoting(false);
    }
  };

  const getPendingMissions = () => {
    if (!playerData) return [];

    const missions = [];
    
    if (playerData.mission?.status === 'pending_review') {
      missions.push({ ...playerData.mission, type: MissionType.Principal, label: 'Misión Principal' });
    }
    if (playerData.secondary_mission?.status === 'pending_review') {
      missions.push({ ...playerData.secondary_mission, type: MissionType.Secondary, label: 'Misión Secundaria' });
    }
    if (playerData.group_mission?.status === 'pending_review') {
      missions.push({ ...playerData.group_mission, type: MissionType.Group, label: 'Misión Grupal' });
    }

    return missions;
  };

  const pendingMissions:PendingMissions[] = getPendingMissions();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Discutir Resultados</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selector de Jugador */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Seleccionar Jugador
            </label>
            <select
              value={selectedPlayerId || ''}
              onChange={(e) => handlePlayerSelect(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">-- Selecciona un jugador --</option>
              {players.map((player) => (
                <option key={player.user_id} value={player.user_id}>
                  {player.user_name}
                </option>
              ))}
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-slate-400">Cargando...</p>
            </div>
          )}

          {/* Lista de Misiones Pendientes */}
          {!loading && playerData && pendingMissions.length > 0 && !selectedMission && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Misiones Pendientes de {playerData.person_name}
              </h3>
              <div className="space-y-3">
                {pendingMissions.map((mission) => (
                  <button
                    key={mission.mission_id}
                    onClick={() => setSelectedMission(mission)}
                    className="w-full text-left p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500 hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-400 font-medium mb-1">{mission.label}</p>
                        <p className="font-semibold text-white">{mission.mission_name}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {/*Votos: {mission.votes}/{votesNeeded}*/}
                        </p>
                      </div>
                      <Users className="text-slate-500" size={20} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sin Misiones Pendientes */}
          {!loading && playerData && pendingMissions.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
              <p className="text-slate-400">
                {playerData.person_name} no tiene misiones pendientes de revisión
              </p>
            </div>
          )}

          {/* Detalle de Misión Seleccionada */}
          {selectedMission && (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedMission(null)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                ← Volver a la lista
              </button>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <p className="text-xs text-blue-400 font-medium mb-1">{selectedMission.result}</p>
                <h3 className="text-xl font-bold text-white mb-2">
                  {selectedMission.mission_name}
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Jugador: {playerData?.person_name}
                </p>
                
                <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">
                  <p className="text-sm font-medium text-slate-300 mb-2">Resultado:</p>
                  <p className="text-white">{selectedMission.result}</p>
                </div>
                {/*
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <span>Votos actuales: {selectedMission.votes}/{votesNeeded}</span>
                  <span>
                    Faltan: {Math.max(0, votesNeeded - selectedMission?.votes)} votos
                  </span>
                </div>
                */}
                {/* Botones de Votación */}
                {canVote && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVote(false)}
                    disabled={voting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <ThumbsDown size={20} />
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleVote(true)}
                    disabled={voting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <ThumbsUp size={20} />
                    Aprobar
                  </button>
                </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionReviewModal;