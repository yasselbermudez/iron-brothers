import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { CheckCircle, ThumbsDown, ThumbsUp, Users, Vote, CheckCheck } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MissionStatus,MissionType,type Assignment, type UpdateMissionsParamsVote, type User } from '../../services/api.interfaces';
import apiService from '../../services/api.service';
import { useToast } from '../../hooks/useToast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ErrorData from '../ErroDataMessage';
import { Separator } from '../ui/separator';

interface ReportProps {
  chatMembers: ChatMember[] | null
  user: User
}

interface ChatMember {
  user_name: string
  user_id: string
  img: string
}

interface PendingMissions {
  type: MissionType
  label: string
  mission_name: string
  mission_id: string
  status: MissionStatus
  creation_date: string
  result?: string
  like?: number
  dislike?: number
  voters: string[]
}

export default function MissionReview({ chatMembers, user }: ReportProps) {

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [playerData, setPlayerData] = useState<Assignment | null>(null);
  const [selectedMission, setSelectedMission] = useState<PendingMissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const {addToast} = useToast()

  const totalUsers = chatMembers?chatMembers.length:0;
  const filteredChatMembers = chatMembers
  ?chatMembers.filter(member => member.user_id !== user?.id)
  :[]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleVote = async (approve: boolean) => {
    if (!selectedMission || voting || !selectedPlayerId) return;

    try {
      setVoting(true);
      const voteData:UpdateMissionsParamsVote = {
            mission_type:selectedMission.type,
            group_size: totalUsers,
            like: approve
        }
      await apiService.updateAssignmentVote(selectedPlayerId,voteData)
      await fetchPlayerMissions(selectedPlayerId);
      setSelectedMission(null);
      addToast("Voto registrado con éxito")
    } catch (error) {
      console.error('Error al registrar voto:', error);
      addToast("Error al registrar voto","error")
    } finally {
      setVoting(false);
    }
  };

  const getAllMissions = () => {
    if (!playerData) return [];

    const missions = [];

    if (playerData.mission?.status === MissionStatus.Pending) {
      missions.push({ ...playerData.mission, type: MissionType.Principal, label: 'Misión Principal' });
    }
    if (playerData.secondary_mission?.status === MissionStatus.Pending) {
      missions.push({ ...playerData.secondary_mission, type: MissionType.Secondary, label: 'Misión Secundaria' });
    }
    if (playerData.group_mission?.status === MissionStatus.Pending) {
      missions.push({ ...playerData.group_mission, type: MissionType.Group, label: 'Misión Grupal' });
    }

    return missions;
  };

  const allMissions: PendingMissions[] = getAllMissions();

  const fetchPlayerMissions = async (playerId: string) => {
    try {
      setLoading(true);
      setPlayerData(null);

      const response = await apiService.getAssignament(playerId);
      setPlayerData(response);
      
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUserForReview = (userId: string) => {
    setSelectedPlayerId(userId);
    setOpenModal(true);
    setSelectedMission(null);
    fetchPlayerMissions(userId);
  };

  if(!user || !user.is_active || !user.group_id) return (
    <ErrorData
      message='Revisar Missiones no disponible'
      description='Asegurate de iniciar el perfil y de pertenecer a un grupo'
    />
  )
      
  const hasUserVoted = (mission: PendingMissions) => {
    return mission.voters.includes(user.id);
  };

  const getVotesNeeded = () => {
    return Math.ceil(totalUsers / 2);
  };

  if(!chatMembers) return (
    <ErrorData
      message='No se pudo cargar la revicion de misiones'
    />
  )

  return (
    <>
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-white text-2xl">
            Revisar Resultados de Misión
          </CardTitle>
          <CardDescription className="text-slate-400">
            Selecciona un miembro para revisar su desempeño en las misiones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator className='bg-slate-700'/>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredChatMembers.map((member) => (
              <Card
                key={member.user_id}
                className="bg-slate-800/50 border-slate-700 hover:border-emerald-600 transition-all cursor-pointer"
                onClick={() => handleSelectUserForReview(member.user_id)}
              >
                <CardContent className="p-4 flex flex-col items-center space-y-3">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={member.img} />
                    <AvatarFallback className="bg-slate-700 text-white text-4xl">
                      {getInitials(member.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-white font-medium">{member.user_name}</p>
                    
                  </div>
                  <Badge 
                    variant="outline" 
                    className='border-slate-600 text-slate-400'
                  >
                    X Misioones
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
       <DialogContent className="max-w-[95vw] p-2 bg-slate-900 border-slate-800 text-white rounded-xl">
        <DialogHeader className='border-b border-slate-800 p-4'>
          <DialogTitle className="text-2xl font-bold text-white">
              Revisar Resultados
          </DialogTitle>
        </DialogHeader>
          <div 
            className="px-2 pb-2 overflow-y-auto max-h-[70vh]"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#fdfdfd #04152e' }}
          >
              {/* Loading */}
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                  <p className="mt-4 text-slate-400">Cargando misiones...</p>
                </div>
              )}

              {/* Lista de Misiones */}
              {!loading && playerData && allMissions.length > 0 && !selectedMission && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Misiones de {playerData.person_name}
                    </h3>
                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                      {allMissions.length} {allMissions.length === 1 ? 'Misión' : 'Misiones'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {allMissions.map((mission) => {
                      const voted = hasUserVoted(mission);
                      const votesNeeded = getVotesNeeded();
                      
                      return (
                        <button
                          key={mission.mission_id}
                          onClick={() => setSelectedMission(mission)}
                          className="w-full text-left p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-emerald-600 hover:bg-slate-800/70 transition group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50">
                                  {mission.label}
                                </Badge>
                                {voted ? (
                                  <Badge className="bg-green-600/20 text-green-400 border-green-600/50">
                                    <CheckCheck className="w-3 h-3 mr-1" />
                                    Ya votaste
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/50">
                                    <Vote className="w-3 h-3 mr-1" />
                                    Pendiente
                                  </Badge>
                                )}
                              </div>
                              <p className="font-semibold text-white mb-1 group-hover:text-emerald-400 transition">
                                {mission.mission_name}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Users size={14} />
                                  {mission.voters.length}/{votesNeeded} votos
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="flex items-center gap-1 text-green-400">
                                    <ThumbsUp size={14} />
                                    {mission.like || 0}
                                  </span>
                                  <span className="flex items-center gap-1 text-red-400">
                                    <ThumbsDown size={14} />
                                    {mission.dislike || 0}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="text-slate-500 group-hover:text-emerald-500 transition">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sin Misiones Pendientes */}
              {!loading && playerData && allMissions.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-green-500 mb-3" size={56} />
                  <p className="text-lg text-slate-300 font-medium mb-2">
                    Sin misiones pendientes
                  </p>
                  <p className="text-slate-400">
                    {playerData.person_name} no tiene misiones pendientes de revisión
                  </p>
                </div>
              )}

              {/* Detalle de Misión Seleccionada */}
              {selectedMission && (
                <div className="space-y-4">
                
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedMission(null)}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 -ml-2"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a la lista
                  </Button>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/50">
                          {selectedMission.label}
                        </Badge>
                        {hasUserVoted(selectedMission) && (
                          <Badge className="bg-green-600/20 text-green-400 border-green-600/50">
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Ya votaste en esta misión
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-white text-xl">
                        {selectedMission.mission_name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Jugador: {playerData?.person_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Votos actuales */}
                      <div className="flex items-center gap-6 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex items-center gap-2">
                          <Users className="text-slate-400" size={18} />
                          <span className="text-slate-300 text-sm">
                            {selectedMission.voters.length}/{getVotesNeeded()} votos
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-green-400">
                            <ThumbsUp size={16} />
                            {selectedMission.like || 0}
                          </span>
                          <span className="flex items-center gap-1.5 text-red-400">
                            <ThumbsDown size={16} />
                            {selectedMission.dislike || 0}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                        <p className="text-sm font-semibold text-slate-300 mb-2">Resultado enviado:</p>
                        <p className="text-white break-words leading-relaxed">{selectedMission.result}</p>
                      </div>

                      {!hasUserVoted(selectedMission) && (
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => handleVote(false)}
                            disabled={voting}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold h-12"
                          >
                            {voting ? (
                              <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Votando...
                              </span>
                            ) : (
                              <>
                                <ThumbsDown className="mr-2" size={20} />
                                Rechazar
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleVote(true)}
                            disabled={voting}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold h-12"
                          >
                            {voting ? (
                              <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Votando...
                              </span>
                            ) : (
                              <>
                                <ThumbsUp className="mr-2" size={20} />
                                Aprobar
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
          </div>
      </DialogContent>
    </Dialog>
    </>
  );
}