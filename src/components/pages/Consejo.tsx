import { useState, useRef, useEffect } from 'react';
import MissionReviewModal from '../MissionReview';
import { useAuth } from '../../AuthContext/auth-hooks';
import apiService from '../../services/api.service';
import type { Group } from '../../services/api.interfaces';

interface Mensaje{
  id: string,
  usuario: string,
  mensaje: string,
  timestamp: Date,
  tipo: string
}

const ConsejoEpico = () => {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "1231231",
      usuario: "Gran GymBro Sabio",
      mensaje: "¡Bienvenidos al Consejo, hermanos! Aquí forjaremos leyendas...",
      timestamp: new Date(),
      tipo: "sistema"
    }
  ]);
  const [group,setGroup] = useState<Group|null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-scroll al último mensaje
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    fetchGroup()
  }, []);

  const fetchGroup = async () => {
      if(!user?.group_id) return
      const response = await apiService.getGroup(user?.group_id)
      setGroup(response)
  }

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === "" || !user?.id || !user?.name) return;

    const mensaje:Mensaje = {
      id: user?.id,
      usuario: user?.name,
      mensaje: nuevoMensaje,
      timestamp: new Date(),
      tipo: "usuario"
    };

    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje("");
  };

  const handleKeyPress = (e:React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      enviarMensaje();
    }
  };

  const convocarConsejo = () => {
    setTipoModal("convocar");
    setMostrarModal(true);
    const id = mensajes.length + 1
    const mensajeSistema:Mensaje = {
      id: id.toString(),
      usuario: "Heraldo del Consejo",
      mensaje: "¡SE CONVOCA EL CONSEJO! Todos los GymBros deben reunirse para deliberar.",
      timestamp: new Date(),
      tipo: "sistema"
    };
    
    setMensajes(prev => [...prev, mensajeSistema]);
  };

  const reportarIncidente = () => {
    setTipoModal("incidente");
    setMostrarModal(true);
  };

  const discutirResultado = () => {
    setReviewModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTipoModal("");
  };

  const formatearHora = (fecha:Date) => {
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if(!user) return

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      {/* Header Épico */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          EL CONSEJO
        </h1>
        <p className="text-gray-400 text-sm">Cámara de deliberaciones épicas</p>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <button
          onClick={convocarConsejo}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold text-white hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          🏛️ CONVOCAR CONSEJO
        </button>
        
        <button
          onClick={reportarIncidente}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold text-white hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
        >
          ⚠️ REPORTAR INCIDENTE
        </button>
        
        <button
          onClick={discutirResultado}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-bold text-white hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
        >
          🎯 DISCUTIR RESULTADO DE MISIÓN
        </button>
      </div>

      {/* Área del Chat */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header del Chat */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white">Consejo en Sesión</h2>
            </div>
            <div className="text-gray-400 text-sm">
              {mensajes.length} mensajes
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div 
          ref={chatContainerRef}
          className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900"
        >
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.tipo === 'sistema' ? 'justify-center' : 
                msg.usuario === 'GymBro Sabio' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
                  msg.tipo === 'sistema' 
                    ? 'bg-yellow-900 border border-yellow-700 text-yellow-200 text-center' 
                    : msg.usuario === 'GymBro Sabio'
                    ? 'bg-blue-900 border border-blue-600 text-white'
                    : 'bg-gray-700 border border-gray-600 text-white'
                }`}
              >
                {msg.tipo !== 'sistema' && (
                  <div className={`font-bold text-sm mb-1 ${
                    msg.usuario === 'GymBro Sabio' ? 'text-blue-300' : 'text-gray-300'
                  }`}>
                    {msg.usuario}
                  </div>
                )}
                <div className="text-sm">{msg.mensaje}</div>
                <div className={`text-xs mt-2 ${
                  msg.tipo === 'sistema' ? 'text-yellow-300' : 'text-gray-400'
                }`}>
                  {formatearHora(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input de Mensaje */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje para el consejo..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={enviarMensaje}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>

            <MissionReviewModal 
              isOpen={reviewModal} 
              onClose={() => setReviewModal(false)} 
              users={group?.members?group?.members:[]}
              me={user?.id} 
            />

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-600">
            <h3 className="text-xl font-bold text-white mb-4">
              {tipoModal === "convocar" && "🏛️ Convocar Consejo"}
              {tipoModal === "incidente" && "⚠️ Reportar Incidente"}
              {tipoModal === "resultado" && "🎯 Discutir Resultado"}
            </h3>
            
            {tipoModal === "convocar" && (
              <div className="text-gray-300 mb-4">
                <p>Has convocado una sesión extraordinaria del consejo.</p>
                <p className="mt-2">Todos los miembros serán notificados.</p>
              </div>
            )}
            
            {tipoModal === "incidente" && (
              <div className="space-y-4">
                <textarea 
                  placeholder="Describe el incidente ocurrido..."
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-red-500 focus:outline-none h-32"
                />
                <select className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-red-500 focus:outline-none">
                  <option>Selecciona tipo de incidente</option>
                  <option>Fallo en equipo</option>
                  <option>Comportamiento anti-gym</option>
                  <option>Problema de seguridad</option>
                  <option>Otro</option>
                </select>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la lógica para enviar el formulario
                  cerrarModal();
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsejoEpico;