import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from '../../AuthContext/auth-hooks';
import MissionsDashboard from "../MissionsDashboard";
import MissionHistory from "../History";

function Missions() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-slate-950">
        <Tabs defaultValue="myMissions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 text-white border border-slate-700 p-0 mb-2 sm:mb-4 lg:mb-6">
            <TabsTrigger value="myMissions" className="data-[state=active]:bg-slate-800 hover:bg-slate-800" > 
              Misiones 
            </TabsTrigger>
            <TabsTrigger value="group" className="data-[state=active]:bg-slate-800 hover:bg-slate-800" > 
              Perfil Grupal 
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-slate-800 hover:bg-slate-800"> 
              Historia 
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myMissions" >
              <MissionsDashboard userId={user.id} />
          </TabsContent>

          <TabsContent value="group" >
            <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-6">
              {/* Contenido del perfil grupal */}
            </div>
          </TabsContent>

          <TabsContent value="history" > 
              <MissionHistory userId={user.id}/>
          </TabsContent>
        </Tabs>
    </main>
  );
}

export default Missions;