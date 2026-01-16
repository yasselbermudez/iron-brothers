import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Target} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Group, Member } from '../../services/api.interfaces';
import { useAuth } from '../../AuthContext/auth-hooks';
import apiService from '../../services/api.service';
import ChatConsejo from '../consejo/chatConsejo';
import MissionReview from '../consejo/missionReview';
import Report from '../consejo/report';
import Loader from '../loader';

interface ChatMember{
  user_name:string
  user_id: string
  img: string
  status: Status
}

type Status = "online"|"offline"

function Consejo() {
  
  const { user } = useAuth();
  
  const [group,setGroup] = useState<Group|null>(null);

  const [loadingGroup,setLoadingGroup] = useState(false);

  const chatMembers = getStatus(group?.members?group?.members:null)

  function getStatus(groupMembers: Member[] | null): ChatMember[] | null {
    if (!groupMembers) return null
    return groupMembers.map(member => ({
    ...member,
    img: "",
    status: "online" as Status
  }));
  }

  useEffect(() => {
    const fetchGroup = async () => {
      if(!user?.is_active || !user?.group_id) return 
      try{
        setLoadingGroup(true)
        const response = await apiService.getGroup(user?.group_id)
        setGroup(response)
      } catch (error){
        console.log("Error cargando grupos: ",error)
      } finally {
        setLoadingGroup(false)
      }
    }

    fetchGroup()

  }, [user?.group_id,user?.is_active]);

  if (loadingGroup) return <Loader/>
     
  if(!user) return

  return (

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="
            text-slate-500 rounded-xl grid 
            sm:w-full grid-cols-3 bg-slate-900
            mx-2 mt-2
            sm:mx-0 sm:mb-0
            md:mb-0 md:mt-2
            lg:mt-4 lg:mb-2
          ">
            <TabsTrigger value="chat" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white ">
              <Users className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="incidentes" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Incidentes
            </TabsTrigger>
            <TabsTrigger value="misiones" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Votaciones
            </TabsTrigger>
          </TabsList>
          <div className="bg-slate-900 border-t sm:border border-slate-700 sm:rounded-xl min-h-screen">
            <TabsContent value="chat">
                <ChatConsejo
                  chatMembers={chatMembers}
                  user={user}
                />
            </TabsContent>

            <TabsContent value="incidentes">
              <Report
                chatMembers={chatMembers}
                user={user}
              />
            </TabsContent>

            <TabsContent value="misiones">
              <MissionReview
                chatMembers={chatMembers}
                user={user}
              />
            </TabsContent>
          </div>
        </Tabs>
  );
}

export default Consejo