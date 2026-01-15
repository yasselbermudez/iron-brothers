import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import { MissionType, type Assignment, type MissionAssignment, type MissionDetails, type MissionStatus } from "../../services/api.interfaces";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";
import MissionResult from "./MissionResult";
import MissionDetailsDialog from "./MissionDetailsDialog";
import { Separator } from "../ui/separator";

interface MissionCardProps{
    missionType:MissionType
    mission:MissionAssignment 
    missionsDetails?:MissionDetails
    setAssignament:(assignment:Assignment)=>void
    updateMissionDetails: ()=>void
}

export default function MissionCard ({mission,missionsDetails, missionType,setAssignament,updateMissionDetails}:MissionCardProps){
    
    
    const [openResultModal, setOpenResultModal] = useState(false);
    const [openMissionDetails,setOpenMissionDetails] = useState(false)

    if (!mission) return null;

    const getDescription = (type:MissionType)=>{
        switch(type){
            case MissionType.Principal:
                return '🎯 Misión Principal'
            case MissionType.Secondary:
                return '⚡ Misión Secundaria'
            case MissionType.Group:
                return '👥 Misión Grupal'
            default:
                return 'Mission'
        }
    }

    const getStatusConfig = (status:MissionStatus) => {
        const configs = {
          active: {
            label: 'Activa',
            color: 'bg-blue-900/50 text-blue-300 border-blue-700',
            icon: <AlertCircle className="w-4 h-4" />,
          },
          pending_review: {
            label: 'Pendiente de Revisión',
            color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
            icon: <Clock className="w-4 h-4" />,
          },
          completed: {
            label: 'Completada',
            color: 'bg-green-900/50 text-green-300 border-green-700',
            icon: <CheckCircle className="w-4 h-4" />,
          },
          failed: {
            label: 'Fallida',
            color: 'bg-red-900/50 text-red-300 border-red-700',
            icon: <CheckCircle className="w-4 h-4" />,
          }
        };
        return configs[status] || configs.active;
      };

    const statusConfig = getStatusConfig(mission.status);
    const description = getDescription(missionType)
    const isActive = mission.status === 'active';

    return (
      <Card className='bg-slate-800 transition-all border border-slate-700'>
        <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white">
                        {mission.mission_name}
                    </CardTitle>
                    <CardDescription className="font-bold text-slate-300">
                        {description}
                        <Separator className="border my-3 border-slate-700"/>
                        <Badge 
                            variant="outline" 
                            className={`flex items-center gap-2 px-3 py-1 ${statusConfig.color}`}
                        >
                            {statusConfig.icon}
                            <span className="text-sm font-medium">{statusConfig.label}</span>
                        </Badge>
                    </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-white">
            <div className="flex items-start gap-2 text-sm ">
                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                    <span className="font-medium text-slate-300">Asignada: </span>
                    {new Date(mission.creation_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                {isActive && (
                    <Button
                    onClick={() => setOpenResultModal(true)}
                    variant="outline"
                    className="rounded text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700"
                    >
                    Introducir Resultado
                    </Button>
                )}

            {missionsDetails && (
                <Button
                onClick={() => setOpenMissionDetails(true)}
                variant="outline"
                className="rounded text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700"
                >
                Detalles de misión
                </Button>
            )}
            </div>

            {openResultModal && 
                <MissionResult
                    missionName={mission.mission_name}
                    missionType={missionType}
                    setAssignament={setAssignament}
                    updateMissionDetails={updateMissionDetails}
                    open={openResultModal}
                    onOpenChange={setOpenResultModal}
                />
            }

            {openMissionDetails && missionsDetails &&
                <MissionDetailsDialog
                    open={openMissionDetails}
                    onOpenChange={setOpenMissionDetails}
                    result={mission?.result?mission.result:undefined}
                    missionDetails={missionsDetails}
                />
            }
      </CardContent>
    </Card>
    );
  };