import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Trophy, Star, Zap, Crown, Award, BookCheck} from "lucide-react";
import type { MissionDetails } from "../../services/api.interfaces"

interface MissionDialogProps {
  missionDetails: MissionDetails;
  result?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MissionDetailsDialog({ missionDetails, open, result, onOpenChange }: MissionDialogProps) {
  if (!missionDetails) return null;

  const getNivelColor = (nivelNumero: number) => {
    switch (nivelNumero) {
      case 1: return 'from-amber-600 to-orange-700';
      case 2: return 'from-purple-600 to-fuchsia-700';
      case 3: return 'from-cyan-600 to-blue-700';
      case 4: return 'from-red-600 to-rose-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getNivelIcon = (nivelNumero: number) => {
    switch (nivelNumero) {
      case 1: return <Award className="w-5 h-5" />;
      case 2: return <Star className="w-5 h-5" />;
      case 3: return <Zap className="w-5 h-5" />;
      case 4: return <Crown className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] bg-slate-950 border-slate-800 text-white rounded-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl  font-bold text-white flex items-center gap-3">
            <div className={`bg-gradient-to-br rounded w-7 h-7 ${
              missionDetails.nivel ? getNivelColor(missionDetails.nivel.numeroNivel) : 'from-gray-600 to-gray-700'
            } flex items-center justify-center`}>
              {missionDetails.nivel ? getNivelIcon(missionDetails.nivel.numeroNivel) : <Trophy className="w-6 h-6" />}
            </div>
            {missionDetails.nombre}
          </DialogTitle>
        </DialogHeader>
        
        <div 
          className="max-h-[calc(90vh-100px)] px-2 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff #0f172a' }}
        >

        <div className="space-y-6">
          {/* Descripción */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Descripción</h3>
            <p className="text-slate-300 break-words">{missionDetails.descripcion}</p>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-2 gap-4">
            {/* Recompensa Base */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-1">Recompensa Base</h3>
              <p className="text-xl font-bold text-amber-400">{missionDetails.recompensa} XP</p>
            </div>

            {/* Nivel */}
            {missionDetails.nivel && (
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Nivel</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 bg-gradient-to-br ${getNivelColor(missionDetails.nivel.numeroNivel)} rounded flex items-center justify-center text-xs font-bold`}>
                    {missionDetails.nivel.numeroNivel}
                  </span>
                  <span className="text-white font-semibold">{missionDetails.nivel.descripcionNivel}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{missionDetails.nivel.rangoXp}</p>
              </div>
            )}
          </div>

          {/* Recompensa Extra */}
          {missionDetails.extra && (
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-700/30">
              <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Recompensa Extra
              </h3>
              <p className="text-slate-300 mb-3 leading-relaxed">{missionDetails.extra.descripcion}</p>
              <div className="bg-purple-900/50 rounded px-3 py-2 inline-block">
                <span className="text-sm font-semibold text-purple-300">+{missionDetails.extra.recompensa} XP Extra</span>
              </div>
            </div>
          )}

          {/* Logro */}
          {missionDetails.logro && (
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-700/30">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Logro Desbloqueable
              </h3>
              
              <div className="flex items-start gap-4">
                {/* Imagen del logro */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={missionDetails.logro.pegatina}
                      alt={missionDetails.logro.nombre}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                
                {/* Información del logro */}
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-1">{missionDetails.logro.nombre}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{missionDetails.logro.descripcion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Resulttado */}
          {result && (
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-700/30">
              <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                <BookCheck className="w-4 h-4" />
                Resultado:
              </h3>
              <p className="text-slate-300 break-words whitespace-pre-wrap">{result}</p>
            </div>
          )}

        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

