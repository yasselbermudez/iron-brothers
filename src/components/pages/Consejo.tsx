import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Target} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Group, Member } from '../../services/api.interfaces';
import { useAuth } from '../../AuthContext/auth-hooks';
import apiService from '../../services/api.service';
import ChatConsejo from '../consejo/chatConsejo';
import MissionReview from '../consejo/missionReview';
import Report from '../consejo/report';

interface ChatMember{
  user_name:string
  user_id: string
  img: string
  status: Status
}

type Status = "online"|"offline"

export default function ConsejoEpico() {
  
  const { user } = useAuth();
  const [group,setGroup] = useState<Group|null>(null);
  
  const chatMembers = getStatus(group?.members?group?.members:[])

  function getStatus(groupMembers: Member[] | []): ChatMember[] {
  return groupMembers.map(member => ({
    ...member,
    img: "",
    status: "online" as Status
  }));
}

  useEffect(() => {
    
    const fetchGroup = async () => {
      if(!user?.group_id) return
      const response = await apiService.getGroup(user?.group_id)
      setGroup(response)
    }
    fetchGroup()
  }, [user?.group_id]);

  if(!user) return

  return (
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="text-slate-500 rounded-xl grid w-full grid-cols-3 bg-slate-900">
            <TabsTrigger value="chat" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              <Users className="w-4 h-4 mr-2" />
              Chat del Consejo
            </TabsTrigger>
            <TabsTrigger value="incidentes" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reportar Incidente
            </TabsTrigger>
            <TabsTrigger value="misiones" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Revisar Misiones
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Chat */}
          <TabsContent value="chat" className="mt-1 md:mt-2 lg:mt-3">
              <ChatConsejo
                chatMembers={chatMembers}
              />
          </TabsContent>

          {/* Tab 2: Reportar Incidente */}
          <TabsContent value="incidentes" className="mt-1 md:mt-2 lg:mt-3">
            <Report
              chatMembers={chatMembers}
            />
          </TabsContent>

          {/* Tab 3: Revisar Misiones */}
          <TabsContent value="misiones" className="mt-1 md:mt-2 lg:mt-3">
            <MissionReview
              chatMembers={chatMembers}
            />
          </TabsContent>
        </Tabs>
  );
}