import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import apiService from "../../services/api.service";
import type { CreateGroup } from "../../services/api.interfaces";
import { useToast } from "../../hooks/useToast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user_data: {
    user_name: string
    user_id: string
  }
  refreshUser: ()=>void
}

export function CrearGrupoDialog({ open, onOpenChange,user_data,refreshUser}:Props) {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading,setLoading] = useState(false);
  const {addToast} = useToast()


  const handleCerateGroup = async () => {

    try {
      if (contrasena.trim()) {
        setLoading(true)
        const groupData: CreateGroup = {
            current_user_id: user_data.user_id,
            current_user_name: user_data.user_name,
            group_name: nombreGrupo,
            password: contrasena,
        }
        await apiService.createGroup(groupData)
      }
      addToast("Grupo creado exitosamente");
    } catch (error) {
      setLoading(false)  
      console.error("Error al crear el grupo:", error);
      addToast("Error al crear el grupo","error")
    } finally{
        setNombreGrupo("");
        setContrasena("");
        onOpenChange(false);
        refreshUser()
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCerateGroup();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] rounded-xl bg-slate-950 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Crear Nuevo Grupo</DialogTitle>
          <DialogDescription className="text-slate-400">
            Completa la información para crear un nuevo grupo. Todos los campos son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
          
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-white text-sm font-medium">
                Nombre del Grupo
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ingresa el nombre del grupo"
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-400"
                required
              />
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="contrasena" className="text-white text-sm font-medium">
                Contraseña
              </Label>
              <Input
                id="contrasena"
                type="password"
                placeholder="Establece una contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-400"
                required
                minLength={6}
              />
              <p className="text-xs text-slate-500">
                La contraseña debe tener al menos 6 caracteres
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              Cancelar
            </Button>

            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!nombreGrupo.trim() || contrasena.length < 6|| loading}
            >
              {loading
                ?<><Loader2 className='animate-spin'/>Creando</>
                :"Crear Grupo"}
            </Button>
          
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CrearGrupoDialog