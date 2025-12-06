import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Plus, Loader2 } from 'lucide-react';
import type {Assignment, UpdateMissionsParams} from "../../services/api.interfaces"
import apiService from "../../services/api.service"
import type{ MissionAssignment} from "../../services/api.interfaces"
import  {MissionStatus,MissionType,type AssignmentMissionResponse} from "../../services/api.interfaces"
import { Button } from "../ui/button";
import MissionDialog from "../mission/MissionDialog"

const MissionsDashboard = ({userId}:{userId:string}) => {
  const [data, setData] = useState<Assignment|null>(null);
  const [activeModal, setActiveModal] = useState<MissionType|null>(null);
  
  const [missionResult, setMissionResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  //detalles de mision
  const [missionsData,setMissionsData] = useState<AssignmentMissionResponse|null>(null)
  const [openMissionDetail,setOpenMissionDetail] = useState<boolean>(false)
  const [missionDetailType,setMissionDetailType] = useState<MissionType|null>(null)

  //actualizando una mission
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, []);

  const fetchAssignment = async () => {
        try {
          const response = await apiService.getAssignament(userId);
          const missionsData = await apiService.getAssignamentAllMissions(userId)
          setData(response)
          setMissionsData(missionsData)
        } catch (error) {
          console.error('Error fetching assignament:', error);
        }
      };

  const getStatusConfig = (status:MissionStatus) => {
    const configs = {
      active: {
        label: 'Activa',
        color: 'bg-blue-900/50 text-blue-300 border-blue-700',
        icon: <AlertCircle className="w-4 h-4" />,
        bgCard: 'bg-slate-900/50'
      },
      pending_review: {
        label: 'Pendiente de Revisión',
        color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
        icon: <Clock className="w-4 h-4" />,
        bgCard: 'bg-slate-900/50'
      },
      completed: {
        label: 'Completada',
        color: 'bg-green-900/50 text-green-300 border-green-700',
        icon: <CheckCircle className="w-4 h-4" />,
        bgCard: 'bg-slate-900/50'
      },
      failed: {
        label: 'Fallida',
        color: 'bg-red-900/50 text-red-300 border-red-700',
        icon: <CheckCircle className="w-4 h-4" />,
        bgCard: 'bg-slate-900/50'
      }
    };
    return configs[status] || configs.active;
  };

  const canGenerateSecondaryMission = () => {
    
    if (!data?.secondary_mission) return true;
    
    const mission = data.secondary_mission;
    if (mission.status == MissionStatus.Pending || mission.status == MissionStatus.Active ) return false;

    const creationDate = new Date(mission.creation_date);
    const oneWeekLater = new Date(creationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    return now >= oneWeekLater;
  };

  const canUpdateMission = () => {
    
    if (!data?.mission) return true;
    
    const mission = data.mission;
    if (mission.status == MissionStatus.Completed || mission.status == MissionStatus.Failed) return true;

  };

  const handleSubmitResult = async (missionType:MissionType) => {
    if (!missionResult.trim() || !data?.person_id) return;

    const updateParams : UpdateMissionsParams = {
          mission_type: missionType,
          status: "pending_review",
          result: missionResult
      }
    
    try {
      const result  = await apiService.updateAssignmentParams(updateParams)
      if(!result.success) throw new Error('Error al actualizar la asignacion');
      fetchAssignment(); 
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el resultado.');
    } finally {
      setMissionResult('');
      setActiveModal(null);
    }
  };

  const handleUpdateMission = async () => {
    setIsUpdating(true);
    
    if(!data?.person_id) return
    
    try {
      const result = await apiService.updateAssignment(MissionType.Principal)
      if(!result.success) throw new Error('Error al asignar la misión secundaria');
      await fetchAssignment();
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al actualizar la misión principal');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateSecondaryMission = async () => {
    setIsGenerating(true);
    
    if(!data?.person_id) return
    
    try {
      const result = await apiService.updateAssignment(MissionType.Secondary)
      if(!result.success) throw new Error('Error al asignar la misión secundaria');
      await fetchAssignment();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al generar la misión secundaria. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMissionCard = (mission:MissionAssignment, title:string, missionType:MissionType) => {
    if (!mission) return null;

    const statusConfig = getStatusConfig(mission.status);
    const isActive = mission.status === 'active';

    return (
      <div className={`rounded-lg border-2 shadow-lg p-6 transition-all hover:shadow-xl ${statusConfig.bgCard} border-slate-700`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-300 mb-2">{title}</h2>
            <h3 className="text-2xl font-semibold text-white mb-3">{mission.mission_name}</h3>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.color}`}>
            {statusConfig.icon}
            <span className="text-sm font-medium">{statusConfig.label}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-400 mb-4">
          {/*
          <p><span className="font-medium text-slate-300">ID:</span> {mission.mission_id}</p>
          */}
          
          <p><span className="font-medium text-slate-300">Asignada:</span> {new Date(mission.creation_date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

        {isActive && (
          <button
            onClick={() => setActiveModal(missionType)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Introducir Resultado
          </button>
        )}

        {missionsData&& (
          <Button
            type="button"
              variant="outline"
              onClick={() => {
                setOpenMissionDetail(true)
                setMissionDetailType(missionType)
              }}
              className="my-3 border-slate-700 text-white hover:bg-slate-800"
          >
            Detalles de mision
          </Button>
        )}


        
      </div>
    );
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xl text-slate-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando misiones...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel de Misiones</h1>
          <p className="text-lg text-slate-400">Bienvenido, <span className="font-semibold text-slate-200">{data.person_name}</span></p>

          {canGenerateSecondaryMission() && (
          <button
            onClick={handleGenerateSecondaryMission}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-3"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Generar Misión Secundaria
              </>
            )}
          </button>
        )}

        {canUpdateMission() && (
          <button
            onClick={handleUpdateMission}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                actualizando...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Actualizar Misión Principal
              </>
            )}
          </button>
        )}
        
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderMissionCard(data.mission, '🎯 Misión Principal', MissionType.Principal)}
          {data.secondary_mission && renderMissionCard(data.secondary_mission, '⚡ Misión Secundaria', MissionType.Secondary)}
          {data.group_mission && renderMissionCard(data.group_mission, '👥 Misión Grupal', MissionType.Group)}
        </div>
      </div>

      {/* Modal para introducir resultado */}
      {activeModal && data[activeModal] && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Introducir Resultado</h3>
            <p className="text-slate-300 mb-4">
              Misión: <span className="font-semibold text-white">{data[activeModal].mission_name}</span>
            </p>
            <textarea
              value={missionResult}
              onChange={(e) => setMissionResult(e.target.value)}
              placeholder="Describe el resultado de la misión..."
              className="w-full h-32 px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setActiveModal(null);
                  setMissionResult('');
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSubmitResult(activeModal)}
                disabled={!missionResult.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/**Modal para mostar detalles de misiones */}
      {openMissionDetail && missionDetailType==MissionType.Principal &&  missionsData?.mission && (
        <MissionDialog
          open={openMissionDetail}
          onOpenChange={setOpenMissionDetail}
          mission={missionsData?.mission}
        />

      )}

      {openMissionDetail && missionDetailType==MissionType.Secondary && missionsData?.secondary_mission && (
        <MissionDialog
          open={openMissionDetail}
          onOpenChange={setOpenMissionDetail}
          mission={missionsData?.secondary_mission}
        />

      )}

    </div>
  );
};

export default MissionsDashboard;
