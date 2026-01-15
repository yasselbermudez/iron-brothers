import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from '../../AuthContext/auth-hooks';
import MissionsDashboard from "../mission/MissionsDashboard";
import MissionHistory from "../mission/History";

function Missions() {
  const { user } = useAuth();
 
  if (!user) return

  return (
    <Tabs defaultValue="myMissions" className="w-full">
      <TabsList className="
        text-slate-500 rounded-xl grid 
        sm:w-full grid-cols-2 bg-slate-900
        mx-2 mt-2
        sm:mx-0 sm:mb-0
        md:mb-0 md:mt-2
        lg:mt-4 lg:mb-2
      ">
        <TabsTrigger value="myMissions" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white"> 
          Misiones 
        </TabsTrigger>
        <TabsTrigger value="history" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white"> 
           Historia 
        </TabsTrigger>
      </TabsList>
      <div className="bg-slate-900 border-t sm:border border-slate-700 sm:rounded-xl min-h-screen">
        <TabsContent value="myMissions">
          <MissionsDashboard user={user} />
        </TabsContent>

        <TabsContent value="history"> 
          <MissionHistory user={user}/>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Missions;