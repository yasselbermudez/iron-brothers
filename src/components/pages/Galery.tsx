import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from '../../AuthContext/auth-hooks';
import MisionesGame from "./AllMissions";
import AllLogros from "./Logros";

function Galery() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) return 

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="myGymProfile" className="w-full">
          {/* TabsList con estilo oscuro */}
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-700 rounded-lg p-1 mb-6">
            <TabsTrigger 
              value="myGymProfile"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-400 hover:text-slate-300 transition-all duration-200 py-2 rounded-md"
            >
              Todas las Misiones
            </TabsTrigger>
            <TabsTrigger 
              value="gymProfiles"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-400 hover:text-slate-300 transition-all duration-200 py-2 rounded-md"
            >
              Todos los Logros
            </TabsTrigger>
          </TabsList>

          {/* TabsContent con fondo coherente */}
          <TabsContent value="myGymProfile" className="mt-6">
            <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-1">
              <MisionesGame/>
            </div>
          </TabsContent>

          <TabsContent value="gymProfiles" className="mt-6">
            <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-1">
              <AllLogros/>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default Galery;