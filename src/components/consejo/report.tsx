import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import type { User } from '../../services/api.interfaces';
import ErrorData from '../ErroDataMessage';
import { Separator } from '../ui/separator';

interface ReportProps{
    chatMembers:ChatMember[]|null
    user:User
}

interface ChatMember{
  user_name:string
  user_id: string
  img: string
}

interface Mensaje {
  id: string;
  usuario: string;
  mensaje: string;
  timestamp: Date;
  tipo: 'sistema' | 'usuario';
}


export default function Report ({chatMembers, user}:ReportProps){
    
    const [selectedMember, setSelectedMember] = useState<string>("");
    const [showIncidentDialog, setShowIncidentDialog] = useState(false);
    const [incidentType, setIncidentType] = useState<string>("");
    const [incidentDescription, setIncidentDescription] = useState("");

    const getInitials = (name: string) => {
        return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const reportarIncidente = () => {
    if (!selectedMember || !incidentType || !incidentDescription.trim()) return;

    const memberName = chatMembers
    ?chatMembers.find(m => m.user_id === selectedMember)?.user_name || "Miembro"
    :"Miembro"
    
    const mensajeSistema: Mensaje = {
      id: Date.now().toString(),
      usuario: "Sistema de Incidentes",
      mensaje: `⚠️ Incidente reportado: ${incidentType} - Involucrado: ${memberName}`,
      timestamp: new Date(),
      tipo: "sistema"
    };
    
    console.log(mensajeSistema)
    //registrar el mensaje en algun lado
    //setMensajes(prev => [...prev, mensajeSistema]);
    setShowIncidentDialog(false);
    setSelectedMember("");
    setIncidentType("");
    setIncidentDescription("");
  };

  const handleSelectedMember = (user_id:string) => {
    setSelectedMember(user_id)
    setShowIncidentDialog(true)
  }

    if(!user || !user.is_active || !user.group_id) return (
      <ErrorData
        message='Reportar incidente no disponible'
        description='Asegurate de iniciar el perfil y de pertenecer a un grupo'
      />
    )
    
    if(!chatMembers) return (
      <ErrorData
        message='No se pudo cargar el reporte de incidentes'
      />
    )

    return(
        <Card className="border-0">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Reportar Incidente
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Selecciona un miembro del consejo e informa sobre el incidente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator className='bg-slate-700'/>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {chatMembers.map((member) => (
                    <Card
                    key={member.user_id}
                        className={'cursor-pointer transition-all bg-slate-800/50 border-slate-700 hover:border-red-500'}
                        onClick={() => handleSelectedMember(member.user_id) }
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
                            X Incidentes
                          </Badge>
                        </CardContent>
                      </Card>
                  ))}
                </div>

                <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                      <DialogTitle>⚠️ Reportar Incidente</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Proporciona los detalles del incidente reportado
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tipo-incidente" className="text-slate-300">
                          Tipo de Incidente
                        </Label>
                        <Select value={incidentType} onValueChange={setIncidentType}>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Selecciona el tipo de incidente" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            <SelectItem value="equipo">Fallo en equipo</SelectItem>
                            <SelectItem value="comportamiento">Comportamiento anti-gym</SelectItem>
                            <SelectItem value="seguridad">Problema de seguridad</SelectItem>
                            <SelectItem value="lesion">Lesión o accidente</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descripcion" className="text-slate-300">
                          Descripción del Incidente
                        </Label>
                        <Textarea
                          id="descripcion"
                          value={incidentDescription}
                          onChange={(e) => setIncidentDescription(e.target.value)}
                          placeholder="Describe detalladamente lo ocurrido..."
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
                        />
                      </div>

                      {selectedMember && (
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                          <p className="text-slate-400 text-sm mb-1">Miembro involucrado:</p>
                          <p className="text-white font-medium">
                            {chatMembers.find(m => m.user_id === selectedMember)?.user_name}
                          </p>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowIncidentDialog(false)}
                        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={reportarIncidente}
                        disabled={!incidentType || !incidentDescription.trim()}
                        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-red-500"
                      >
                        Enviar Reporte
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
    )
}

