import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from '../../AuthContext/auth-hooks';
import MissionsDashboard from "./MissionsDashboard";
import MissionHistory from "./History";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="myMissions" className="w-full">
          {/* TabsList con estilo oscuro */}
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-700 rounded-lg p-1 mb-6">
            <TabsTrigger 
              value="myMissions"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-400 hover:text-slate-300 transition-all duration-200 py-2 rounded-md"
            >
              Misiones
            </TabsTrigger>
            <TabsTrigger 
              value="group"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-400 hover:text-slate-300 transition-all duration-200 py-2 rounded-md"
            >
              Perfil Grupal
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-400 hover:text-slate-300 transition-all duration-200 py-2 rounded-md"
            >
              Historia
            </TabsTrigger>
          </TabsList>

          {/* TabsContent con fondo coherente */}
          <TabsContent value="myMissions" className="mt-6">
            <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-1">
              <MissionsDashboard userId={user.id} />
            </div>
          </TabsContent>

          <TabsContent value="group" className="mt-6">
            <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-1">
              
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-1">
              <MissionHistory userId={user.id}/>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default Missions;