import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '../../AuthContext/auth-hooks';
import { Send } from 'lucide-react';
import { Input } from '../ui/input';

interface Mensaje {
  id: string;
  usuario: string;
  mensaje: string;
  timestamp: Date;
  tipo: 'sistema' | 'usuario';
}

interface ChatConsejoProps{
    chatMembers:ChatMember[]|[]
}

interface ChatMember{
  user_name:string
  user_id: string
  img: string
  status: Status
}

type Status = "online"|"offline"

export default function ChatConsejo ({chatMembers}:ChatConsejoProps){
    
    const {user} = useAuth()
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [showConsejoDialog, setShowConsejoDialog] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [mensajes, setMensajes] = useState<Mensaje[]>([
        {
          id: "1",
          usuario: "Gran GymBro Sabio",
          mensaje: "¡Bienvenidos al Consejo, hermanos! Aquí forjaremos leyendas...",
          timestamp: new Date(),
          tipo: "sistema"
        }
    ]);
    

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    },[mensajes]);

    const enviarMensaje = () => {
        if (nuevoMensaje.trim() === "" || !user) return;

        const mensaje: Mensaje = {
        id: Date.now().toString(),
        usuario: user.name,
        mensaje: nuevoMensaje,
        timestamp: new Date(),
        tipo: "usuario"
        };

        setMensajes([...mensajes, mensaje]);
        setNuevoMensaje("");
    };  

    const convocarConsejo = () => {
        setShowConsejoDialog(false);
        const mensajeSistema: Mensaje = {
        id: Date.now().toString(),
        usuario: "Heraldo del Consejo",
        mensaje: "🏛️ ¡SE CONVOCA EL CONSEJO! Todos los GymBros deben reunirse para deliberar.",
        timestamp: new Date(),
        tipo: "sistema"
        };
        
        setMensajes(prev => [...prev, mensajeSistema]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje();
        }
    };

    const formatearHora = (fecha: Date) => {
        return fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
        });
    };

    if (!user) return

    return(
        <>
        <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <CardTitle className="text-white">Consejo en Sesión</CardTitle>
                  </div>
                  <Button 
                    onClick={() => setShowConsejoDialog(true)}
                    className="bg-slate-800 text-white hover:bg-slate-700"
                  >
                    🏛️ Convocar Consejo
                  </Button>
                </div>
                <CardDescription className="text-slate-400 pb-2 ">
                  {mensajes.length} mensajes en el historial
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96 p-4" ref={chatContainerRef}>
                  <div className="space-y-4">
                    {mensajes.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.tipo === 'sistema' ? 'justify-center' : 
                          msg.usuario === user.name ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
                            msg.tipo === 'sistema' 
                              ? 'bg-amber-950/50 border border-amber-900 text-amber-200 text-center' 
                              : msg.usuario === user.name
                              ? 'bg-slate-800 border border-slate-700 text-white'
                              : 'bg-blue-950/50 border border-blue-900 text-white'
                          }`}
                        >
                          {msg.tipo !== 'sistema' && (
                            <div className="font-bold text-sm mb-1 text-slate-300">
                              {msg.usuario}
                            </div>
                          )}
                          <div className="text-sm">{msg.mensaje}</div>
                          <div className="text-xs mt-2 text-slate-500">
                            {formatearHora(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Input de Mensaje */}
                <div className="p-4 border-t border-slate-800">
                  <div className="flex space-x-2">
                    <Input
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje para el consejo..."
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    <Button
                      onClick={enviarMensaje}
                      className="bg-slate-800 text-white hover:bg-slate-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dialog: Convocar Consejo */}
        <Dialog open={showConsejoDialog} onOpenChange={setShowConsejoDialog}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>🏛️ Convocar Consejo</DialogTitle>
              <DialogDescription className="text-slate-400">
                Estás a punto de convocar una sesión extraordinaria del consejo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-slate-300">
                Todos los miembros del consejo serán notificados y deberán reunirse para deliberar.
              </p>
              <div className="bg-amber-950/30 border border-amber-900 rounded-lg p-4">
                <p className="text-amber-200 text-sm">
                  ⚠️ Esta acción notificará a {chatMembers.length} miembros del consejo.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConsejoDialog(false)}
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={convocarConsejo}
                className="bg-slate-800 text-white hover:bg-slate-700"
              >
                Confirmar Convocatoria
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
    )

}