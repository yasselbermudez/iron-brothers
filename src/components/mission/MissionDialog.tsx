import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Trophy, Star, Zap, Crown, Award, BookCheck} from "lucide-react";
import type { MissionModal } from "../../services/api.interfaces"

interface MissionDialogProps {
  mission: MissionModal | null;
  open: boolean;
  result?: string;
  onOpenChange: (open: boolean) => void;
}

function MissionDialog({ mission, open, result, onOpenChange }: MissionDialogProps) {
  if (!mission) return null;

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
      <DialogContent className="sm:max-w-[525px] bg-slate-950 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${
              mission.nivel ? getNivelColor(mission.nivel.numeroNivel) : 'from-gray-600 to-gray-700'
            } rounded-lg flex items-center justify-center`}>
              {mission.nivel ? getNivelIcon(mission.nivel.numeroNivel) : <Trophy className="w-6 h-6" />}
            </div>
            {mission.nombre}
          </DialogTitle>
        </DialogHeader>
        
         <div 
          className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#4f46e5 #1e293b' }}
        >

        <div className="space-y-6">
          {/* Descripción */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Descripción</h3>
            <p className="text-slate-300 leading-relaxed">{mission.descripcion}</p>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-2 gap-4">
            {/* Recompensa Base */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-1">Recompensa Base</h3>
              <p className="text-xl font-bold text-amber-400">{mission.recompensa} XP</p>
            </div>

            {/* Nivel */}
            {mission.nivel && (
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Nivel</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 bg-gradient-to-br ${getNivelColor(mission.nivel.numeroNivel)} rounded flex items-center justify-center text-xs font-bold`}>
                    {mission.nivel.numeroNivel}
                  </span>
                  <span className="text-white font-semibold">{mission.nivel.descripcionNivel}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{mission.nivel.rangoXp}</p>
              </div>
            )}
          </div>

          {/* Recompensa Extra */}
          {mission.extra && (
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-700/30">
              <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Recompensa Extra
              </h3>
              <p className="text-slate-300 mb-3 leading-relaxed">{mission.extra.descripcion}</p>
              <div className="bg-purple-900/50 rounded px-3 py-2 inline-block">
                <span className="text-sm font-semibold text-purple-300">+{mission.extra.recompensa} XP Extra</span>
              </div>
            </div>
          )}

          {/* Logro */}
          {mission.logro && (
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
                      src={mission.logro.pegatina}
                      alt={mission.logro.nombre}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </div>
                
                {/* Información del logro */}
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-1">{mission.logro.nombre}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{mission.logro.descripcion}</p>
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
              <p className="text-slate-300 mb-3 leading-relaxed">{result}</p>
            </div>
          )}

        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MissionDialog