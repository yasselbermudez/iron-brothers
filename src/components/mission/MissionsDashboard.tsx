import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import type {Assignment, User, AssignmentMissionDetails} from "../../services/api.interfaces"
import { MissionStatus,MissionType } from "../../services/api.interfaces"
import apiService from "../../services/api.service"
import { Button } from "../ui/button";
import { useToast } from '../../hooks/useToast';
import Loader from '../loader';
import MissionCard from './MissionCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

const MissionsDashboard = ({user}:{user:User}) => {
  
  const [loading,setLoading] = useState(false)

  const [assignament, setAssignament] = useState<Assignment|null>(null);
  
  const {addToast} = useToast()
  
  //mission details
  const [missionsDetails,setMissionsDetails] = useState<AssignmentMissionDetails|null>(null)

  //loading
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAssignment = useCallback(async () => {
    if(!user.is_active || !user.id) return
    try {
      setLoading(true)
      const response = await apiService.getAssignament(user.id);
      const missionsData = await apiService.getAssignamentAllMissions(user.id)
      setAssignament(response)
      setMissionsDetails(missionsData)
    } catch (error) {
      console.error('Error fetching assignament:', error);
    } finally {
      setLoading(false)
    }
  },[user.id,user.is_active,])

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const canGenerateSecondaryMission = () => {
    
    if (!assignament?.secondary_mission) return true;
    
    const mission = assignament.secondary_mission;
    if (mission.status == MissionStatus.Pending || mission.status == MissionStatus.Active ) return false;

    const creationDate = new Date(mission.creation_date);
    const oneWeekLater = new Date(creationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    return now >= oneWeekLater;
  };

  const canUpdateMission = () => {
    if (!assignament?.mission) return true;
    const mission = assignament.mission;
    if (mission.status == MissionStatus.Completed || mission.status == MissionStatus.Failed) return true;

  };

  const handleUpdateMission = async () => {
    if(!assignament?.person_id) return
    setIsUpdating(true);
    try {
      const result = await apiService.updateAssignment(MissionType.Principal)
      setAssignament(result)
      addToast("Mission principal actualizada")
    } catch (error) {
      console.error('Error actualizando mision principal:', error);
      addToast('Error actualizando mision principal',"error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateSecondaryMission = async () => {
    if(!assignament?.person_id) return
    setIsGenerating(true);
    try {
      const result = await apiService.updateAssignment(MissionType.Secondary)
      setAssignament(result)
      addToast('Mission secundaria generada exitosamente');
    } catch (error) {
      console.error('Error generando mision secundaria:', error);
      addToast('No se pudo generar la mision secundaria',"error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user.is_active) {
    return (
      <div className='p-10 text-center'>
            <h1 className='text-white text-xl font-semibold'>Misiones no disponibles</h1>
            <p className='text-slate-400'>Asegurate de iniciar el perfil</p>
      </div>
    );
  }

  if (loading) {
    return <Loader text="Cargando misiones"/>
  }

  if (!assignament) {
    return (
      <div className="p-10 text-center ">
        <div className="text-white text-xl font-semibold">No se pudieron cargar las misiones</div>
      </div>
    );
  }

  return (

    <Card className='border-0'>
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Panel de Misiones
            </CardTitle>
            <CardDescription className="text-slate-400 font-semibold">
              Completa los resultados de misiones pendientes
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator className='bg-slate-700'/>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Button
                onClick={handleGenerateSecondaryMission}
                disabled={(isGenerating || !canGenerateSecondaryMission())}
                className="rounded text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
              >
                {isGenerating ? (
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
              </Button>
            
              <Button
                onClick={handleUpdateMission}
                disabled={(isUpdating || !canUpdateMission())}
                className="rounded text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Actualizar Misión Principal
                  </>
                )}
              </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignament.mission && 
              <MissionCard
                missionType={MissionType.Principal}
                mission={assignament.mission}
                missionsDetails={missionsDetails?.mission}
                setAssignament={setAssignament}
              />
            }
            {assignament.secondary_mission && 
              <MissionCard
                missionType={MissionType.Secondary}
                mission={assignament.secondary_mission}
                missionsDetails={missionsDetails?.secondary_mission}
                setAssignament={setAssignament}
              />
            }
            {assignament.group_mission && 
              <MissionCard
                missionType={MissionType.Group}
                mission={assignament.group_mission}
                missionsDetails={missionsDetails?.group_mission}
                setAssignament={setAssignament}
              />
            }
          </div>
        </CardContent>
    </Card>
  );
};

export default MissionsDashboard;
