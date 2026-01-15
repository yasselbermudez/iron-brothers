import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import type { Assignment, MissionType, UpdateMissionsParams } from "../../services/api.interfaces";
import apiService from "../../services/api.service";
import { useToast } from "../../hooks/useToast";
import { Textarea } from "../ui/textarea";

interface MissionResultProps{
    missionName: string
    missionType:MissionType
    open:boolean
    onOpenChange:(open:boolean)=>void
    setAssignament:(assignment:Assignment)=>void
}

export default function MissionResult({missionName,missionType,open,onOpenChange,setAssignament}:MissionResultProps){

    const [missionResult, setMissionResult] = useState('');
    const [isSendingResult,setIsSendingResult] = useState(false)

    const {addToast} = useToast()
    
    const handleSubmitResult = async () => {
        if (!missionResult.trim()) return;
    
        const updateParams : UpdateMissionsParams = {
              mission_type: missionType,
              status: "pending_review",
              result: missionResult
          }
        
        try {
          setIsSendingResult(true)
          const result = await apiService.updateAssignmentParams(updateParams)
          setAssignament(result)
          addToast("Resultado enviado exitosamente") 
        } catch (error) {
          console.error('Error enviando resultado de mision:', error);
          addToast("Error enviando resultado","error")
        } finally {
          onOpenChange(false);
        }
    };

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] bg-slate-950 border-slate-800 text-white rounded-xl">
                <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                    Introducir Resultado
                </DialogTitle>
                <DialogDescription>
                    Misión: <span className="font-semibold text-slate-400">{missionName}</span>
                </DialogDescription>
                </DialogHeader>
                <div 
                    className="max-h-[calc(90vh-100px)] overflow-y-auto"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff #0f172a' }}
                >
                    <Textarea
                        value={missionResult}
                        onChange={(e) => setMissionResult(e.target.value)}
                        placeholder="Describe el resultado de la misión..."
                        className="w-full h-32 px-4 py-3 bg-slate-800 border-slate-800 text-slate-300 rounded"
                    />
                    <div className="flex gap-3 mt-6">
                        <Button
                            onClick={()=>onOpenChange(false)}
                            disabled={isSendingResult}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white font-medium py-3 rounded transition-colors"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => handleSubmitResult()}
                            disabled={!missionResult.trim()||isSendingResult}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition-colors"
                        > 
                            {isSendingResult
                            ?<><Loader2 className='animate-spin'/>Enviando</>
                            :"Enviar"
                            }
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}