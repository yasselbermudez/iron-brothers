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
        <Tabs defaultValue="myMissions" className="w-full">
          <TabsList className="text-slate-500 rounded-xl grid w-full grid-cols-3 bg-slate-900">
            <TabsTrigger value="myMissions" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white"> 
              Misiones 
            </TabsTrigger>
            <TabsTrigger value="group" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white"> 
              Perfil Grupal 
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:text-white data-[state=active]:border-slate-700 rounded-xl hover:text-white"> 
              Historia 
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myMissions" className="mt-1 md:mt-2 lg:mt-3">
              <MissionsDashboard userId={user.id} />
          </TabsContent>

          <TabsContent value="group" className="mt-1 md:mt-2 lg:mt-3">
            <div className="text-center text-white bg-slate-900/30 border border-slate-700 rounded-xl p-6">
              <h1 className="text-3xl font-bold mb-8 text-white text-center">En desarrollo</h1>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-1 md:mt-2 lg:mt-3"> 
              <MissionHistory/>
          </TabsContent>
        </Tabs>
  );
}

export default Missions;