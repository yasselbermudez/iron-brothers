import { Dialog, DialogContent, DialogHeader, DialogTitle ,DialogDescription} from '../ui/dialog';
import apiService from "../../services/api.service";
import type { GymProfileInit } from '../../services/api.interfaces';
import { useToast } from '../../hooks/useToast';
import { ProfileForm } from '../profile/ProfileForm';

interface ProfileDialogProps {
  openInitProfile: boolean;
  setOpenInitProfile: (open: boolean) => void;
  refreshUser: ()=> void;
}

export const InitProfileDialog: React.FC<ProfileDialogProps> = ({
  openInitProfile,
  setOpenInitProfile,
  refreshUser
}) => {
  
  const {addToast} = useToast()

  //const [startingProfile,setStartingProfile] = useState(false)

  const handleActivate = async (dataForm:GymProfileInit) => {
    try{
      //setStartingProfile(true)
      await apiService.init_profile_gamer(dataForm)
      addToast("Perfil iniciado correctamente")
    } catch(error){
      console.error("Error al inicial el perfil: ",error)
      addToast("Error al inicial el perfil","error")
      setOpenInitProfile(false);
    }finally{
      //setStartingProfile(false)
      setOpenInitProfile(false);
      refreshUser();
    }
     
  };

  return (
    <Dialog open={openInitProfile} onOpenChange={setOpenInitProfile}>
      <DialogContent className="max-w-[95vw] overflow-hidden text-white bg-slate-950 border-slate-700 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Iniciar Perfil</DialogTitle>
          <DialogDescription className="text-slate-400">Completa tu perfil de entrenamiento</DialogDescription>
        </DialogHeader>
        <div 
          className="pr-2 overflow-y-auto max-h-[calc(90vh-100px)]"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff #0f172a' }}
        >
          <ProfileForm
            onSubmit={handleActivate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};